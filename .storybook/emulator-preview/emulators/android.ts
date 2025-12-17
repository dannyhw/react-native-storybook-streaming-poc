import { execa, type ExecaChildProcess } from "execa";
import type {
  EmulatorAdapter,
  EmulatorInfo,
  EmulatorState,
  CreateEmulatorAdapterOptions,
} from "./types";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type AndroidEmulatorAdapterOptions = CreateEmulatorAdapterOptions & {
  /**
   * Path to the Android SDK emulator binary
   */
  emulatorPath?: string;

  /**
   * Path to the adb binary
   */
  adbPath?: string;
};

type InternalOptions = Required<AndroidEmulatorAdapterOptions>;

const getDefaultOptions = (
  options: AndroidEmulatorAdapterOptions
): InternalOptions => ({
  binaryPath: options.binaryPath ?? "emulator",
  emulatorPath: options.emulatorPath ?? "emulator",
  adbPath: options.adbPath ?? "adb",
});

// Store running emulator processes
const runningEmulators = new Map<string, ExecaChildProcess>();

const getAvdList = async (options: InternalOptions): Promise<string[]> => {
  try {
    const { stdout } = await execa(options.emulatorPath, ["-list-avds"]);
    return stdout
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  } catch {
    return [];
  }
};

type AdbDevice = {
  serial: string;
  state: string;
};

const getConnectedDevices = async (
  options: InternalOptions
): Promise<AdbDevice[]> => {
  try {
    const { stdout } = await execa(options.adbPath, ["devices"]);
    const lines = stdout.split("\n").slice(1); // Skip header line

    return lines
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        const [serial, state] = line.split("\t");
        return { serial, state };
      })
      .filter((device) => device.serial.startsWith("emulator-"));
  } catch {
    return [];
  }
};

const getEmulatorSerial = async (
  options: InternalOptions,
  avdName: string
): Promise<string | null> => {
  const devices = await getConnectedDevices(options);

  for (const device of devices) {
    try {
      const { stdout } = await execa(options.adbPath, [
        "-s",
        device.serial,
        "emu",
        "avd",
        "name",
      ]);
      const name = stdout.split("\n")[0].trim();
      if (name === avdName) {
        return device.serial;
      }
    } catch {
      // Continue checking other devices
    }
  }

  return null;
};

const isDeviceBooted = async (
  options: InternalOptions,
  serial: string
): Promise<boolean> => {
  try {
    const { stdout } = await execa(options.adbPath, [
      "-s",
      serial,
      "shell",
      "getprop",
      "sys.boot_completed",
    ]);
    return stdout.trim() === "1";
  } catch {
    return false;
  }
};

const getEmulatorState = async (
  options: InternalOptions,
  avdName: string
): Promise<EmulatorState> => {
  const serial = await getEmulatorSerial(options, avdName);

  if (!serial) {
    return "shutdown";
  }

  const devices = await getConnectedDevices(options);
  const device = devices.find((d) => d.serial === serial);

  if (!device) {
    return "shutdown";
  }

  if (device.state === "device") {
    const booted = await isDeviceBooted(options, serial);
    return booted ? "booted" : "booting";
  }

  if (device.state === "offline") {
    return "booting";
  }

  return "unknown";
};

export const createAndroidEmulatorAdapter = (
  options: AndroidEmulatorAdapterOptions = {}
): EmulatorAdapter => {
  const internalOptions = getDefaultOptions(options);

  return {
    platform: "android",

    listEmulators: async (): Promise<EmulatorInfo[]> => {
      const avds = await getAvdList(internalOptions);

      const emulators: EmulatorInfo[] = [];

      for (const avdName of avds) {
        const state = await getEmulatorState(internalOptions, avdName);
        emulators.push({
          id: avdName,
          name: avdName,
          state,
          platform: "android",
        });
      }

      return emulators;
    },

    start: async (id: string): Promise<void> => {
      // Check if already running
      const serial = await getEmulatorSerial(internalOptions, id);
      if (serial) {
        // Already running
        return;
      }

      // Start the emulator in the background
      const process = execa(
        internalOptions.emulatorPath,
        ["-avd", id, "-no-snapshot-load"],
        {
          detached: true,
          stdio: "ignore",
        }
      );

      // Store the process reference for later cleanup
      runningEmulators.set(id, process);

      // Allow the process to start independently
      process.unref();

      // Give it a moment to start
      await sleep(2000);
    },

    stop: async (id: string): Promise<void> => {
      const serial = await getEmulatorSerial(internalOptions, id);

      if (serial) {
        try {
          await execa(internalOptions.adbPath, ["-s", serial, "emu", "kill"]);
        } catch {
          // Emulator may already be stopped
        }
      }

      // Clean up the stored process reference
      const process = runningEmulators.get(id);
      if (process) {
        try {
          process.kill();
        } catch {
          // Process may already be dead
        }
        runningEmulators.delete(id);
      }
    },

    waitForBoot: async (id: string, timeout = 120000): Promise<void> => {
      const startTime = Date.now();
      const pollInterval = 2000;

      while (Date.now() - startTime < timeout) {
        const serial = await getEmulatorSerial(internalOptions, id);

        if (serial) {
          const booted = await isDeviceBooted(internalOptions, serial);
          if (booted) {
            // Additional wait for the device to be fully ready
            await sleep(2000);
            return;
          }
        }

        await sleep(pollInterval);
      }

      throw new Error(
        `Timeout waiting for Android emulator ${id} to boot after ${timeout}ms`
      );
    },

    isBooted: async (id: string): Promise<boolean> => {
      const serial = await getEmulatorSerial(internalOptions, id);

      if (!serial) {
        return false;
      }

      return isDeviceBooted(internalOptions, serial);
    },

    getEmulatorInfo: async (id: string): Promise<EmulatorInfo | null> => {
      const avds = await getAvdList(internalOptions);

      if (!avds.includes(id)) {
        return null;
      }

      const state = await getEmulatorState(internalOptions, id);

      return {
        id,
        name: id,
        state,
        platform: "android",
      };
    },
  };
};
