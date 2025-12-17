import { execa } from "execa";
import type {
  EmulatorAdapter,
  EmulatorInfo,
  EmulatorState,
  CreateEmulatorAdapterOptions,
} from "./types";

type SimctlDevice = {
  udid: string;
  name: string;
  state: string;
  isAvailable: boolean;
};

type SimctlOutput = {
  devices: Record<string, SimctlDevice[]>;
};

const mapSimulatorState = (state: string): EmulatorState => {
  switch (state.toLowerCase()) {
    case "booted":
      return "booted";
    case "shutdown":
      return "shutdown";
    case "booting":
      return "booting";
    default:
      return "unknown";
  }
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type IOSEmulatorAdapterOptions = CreateEmulatorAdapterOptions & {
  /**
   * Path to xcrun binary
   */
  xcrunPath?: string;
};

type InternalOptions = Required<IOSEmulatorAdapterOptions>;

const getDefaultOptions = (
  options: IOSEmulatorAdapterOptions
): InternalOptions => ({
  binaryPath: options.binaryPath ?? "xcrun",
  xcrunPath: options.xcrunPath ?? "xcrun",
});

const runSimctl = async (
  options: InternalOptions,
  args: string[]
): Promise<string> => {
  const { stdout } = await execa(options.xcrunPath, ["simctl", ...args]);
  return stdout;
};

const getAllDevices = async (
  options: InternalOptions
): Promise<SimctlDevice[]> => {
  const stdout = await runSimctl(options, ["list", "devices", "--json"]);
  const parsed: SimctlOutput = JSON.parse(stdout);

  const devices: SimctlDevice[] = [];
  for (const runtime of Object.keys(parsed.devices)) {
    for (const device of parsed.devices[runtime]) {
      if (device.isAvailable) {
        devices.push(device);
      }
    }
  }

  return devices;
};

export const createIOSEmulatorAdapter = (
  options: IOSEmulatorAdapterOptions = {}
): EmulatorAdapter => {
  const internalOptions = getDefaultOptions(options);

  return {
    platform: "ios",

    listEmulators: async (): Promise<EmulatorInfo[]> => {
      const devices = await getAllDevices(internalOptions);

      return devices.map((device) => ({
        id: device.udid,
        name: device.name,
        state: mapSimulatorState(device.state),
        platform: "ios" as const,
      }));
    },

    start: async (id: string): Promise<void> => {
      try {
        await runSimctl(internalOptions, ["boot", id]);
      } catch (error) {
        // If the device is already booted, simctl will throw an error
        // We check if it's already booted and ignore that specific error
        const message = error instanceof Error ? error.message : String(error);
        if (
          !message.includes("Unable to boot device in current state: Booted")
        ) {
          throw error;
        }
      }
    },

    stop: async (id: string): Promise<void> => {
      try {
        await runSimctl(internalOptions, ["shutdown", id]);
      } catch (error) {
        // Ignore errors if the device is already shut down
        const message = error instanceof Error ? error.message : String(error);
        if (!message.includes("current state: Shutdown")) {
          throw error;
        }
      }
    },

    waitForBoot: async (id: string, timeout = 120000): Promise<void> => {
      const startTime = Date.now();
      const pollInterval = 1000;

      while (Date.now() - startTime < timeout) {
        const devices = await getAllDevices(internalOptions);
        const device = devices.find((d) => d.udid === id);

        if (device && device.state.toLowerCase() === "booted") {
          // Additional wait for the simulator to be fully ready
          await runSimctl(internalOptions, ["bootstatus", id]);
          return;
        }

        await sleep(pollInterval);
      }

      throw new Error(
        `Timeout waiting for iOS simulator ${id} to boot after ${timeout}ms`
      );
    },

    isBooted: async (id: string): Promise<boolean> => {
      const devices = await getAllDevices(internalOptions);
      const device = devices.find((d) => d.udid === id);
      return device?.state.toLowerCase() === "booted";
    },

    getEmulatorInfo: async (id: string): Promise<EmulatorInfo | null> => {
      const devices = await getAllDevices(internalOptions);
      const device = devices.find((d) => d.udid === id);

      if (!device) {
        return null;
      }

      return {
        id: device.udid,
        name: device.name,
        state: mapSimulatorState(device.state),
        platform: "ios",
      };
    },
  };
};
