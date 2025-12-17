export type {
  Platform,
  EmulatorState,
  EmulatorInfo,
  EmulatorAdapter,
  CreateEmulatorAdapterOptions,
} from "./types";

export {
  createIOSEmulatorAdapter,
  type IOSEmulatorAdapterOptions,
} from "./ios";

export {
  createAndroidEmulatorAdapter,
  type AndroidEmulatorAdapterOptions,
} from "./android";
