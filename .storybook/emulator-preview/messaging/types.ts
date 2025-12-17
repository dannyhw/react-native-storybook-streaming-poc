import type { EmulatorDevice } from "../options";

export type EmulatorDeviceWithStreamUrl = EmulatorDevice & {
  streamUrl: string;
};

export type GetAllDevicesMessage = {};

export type GetAllDevicesResponseMessage = {
  devices: EmulatorDeviceWithStreamUrl[];
};

export type EmulatorPreviewMessageMap = {
  "emulator-preview/get-all-devices": GetAllDevicesMessage;
  "emulator-preview/get-all-devices-response": GetAllDevicesResponseMessage;
};

export type EmulatorPreviewChannel = {
  emit<K extends keyof EmulatorPreviewMessageMap>(
    key: K,
    message?: EmulatorPreviewMessageMap[K]
  ): void;
  on<K extends keyof EmulatorPreviewMessageMap>(
    key: K,
    listener: (message: EmulatorPreviewMessageMap[K]) => void
  ): void;
  off<K extends keyof EmulatorPreviewMessageMap>(
    key: K,
    listener: (message: EmulatorPreviewMessageMap[K]) => void
  ): void;
};
