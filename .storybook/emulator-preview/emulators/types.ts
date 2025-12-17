export type Platform = "ios" | "android";

export type EmulatorState = "booted" | "shutdown" | "booting" | "unknown";

export type EmulatorInfo = {
  id: string;
  name: string;
  state: EmulatorState;
  platform: Platform;
};

export type EmulatorAdapter = {
  /**
   * Get the platform this adapter handles
   */
  platform: Platform;

  /**
   * List all available emulators/simulators
   */
  listEmulators: () => Promise<EmulatorInfo[]>;

  /**
   * Start an emulator by its ID
   * @param id - The emulator/simulator ID
   * @returns Promise that resolves when the emulator process has started
   */
  start: (id: string) => Promise<void>;

  /**
   * Stop an emulator by its ID
   * @param id - The emulator/simulator ID
   */
  stop: (id: string) => Promise<void>;

  /**
   * Wait for an emulator to be fully booted and ready
   * @param id - The emulator/simulator ID
   * @param timeout - Maximum time to wait in milliseconds (default: 120000)
   */
  waitForBoot: (id: string, timeout?: number) => Promise<void>;

  /**
   * Check if an emulator is currently booted
   * @param id - The emulator/simulator ID
   */
  isBooted: (id: string) => Promise<boolean>;

  /**
   * Get information about a specific emulator
   * @param id - The emulator/simulator ID
   */
  getEmulatorInfo: (id: string) => Promise<EmulatorInfo | null>;
};

export type CreateEmulatorAdapterOptions = {
  /**
   * Custom path to the emulator binary (Android) or simctl (iOS)
   */
  binaryPath?: string;
};
