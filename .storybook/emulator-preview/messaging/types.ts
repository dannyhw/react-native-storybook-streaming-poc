import type { EmulatorDevice } from "../options";

export type GetAllDevicesMessage = {};

export type GetAllDevicesResponseMessage = {
  devices: EmulatorDevice[];
};

export type EmulatorPreviewMessageMap = {
  "emulator-preview/get-all-devices": GetAllDevicesMessage;
  "emulator-preview/get-all-devices-response": GetAllDevicesResponseMessage;
};
