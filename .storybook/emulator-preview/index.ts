import { getAppium } from "./appium";
import type { EmulatorPreviewOptions } from "./options";
import { createEmulatorPreviewChannel } from "./messaging/channel";

export const emulatorPreview = async (options: EmulatorPreviewOptions) => {
  const appium = await getAppium({});
  const sessions = await Promise.all(
    options.devices.map(async (device) => appium.getSession(device))
  );

  createEmulatorPreviewChannel(options.channel, options);

  return sessions;
};
