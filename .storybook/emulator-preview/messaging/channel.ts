import type { Channel } from "storybook/internal/channels";
import { EmulatorPreviewOptions } from "../options";

export const createEmulatorPreviewChannel = (
  storybookChannel: Channel,
  options: EmulatorPreviewOptions
): void => {
  storybookChannel.on("emulator-preview/get-all-devices", async () => {
    storybookChannel.emit("emulator-preview/get-all-devices-response", {
      devices: options.devices,
    });
  });
};
