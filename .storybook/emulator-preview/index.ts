import { getAppium } from "./appium";
import type { EmulatorPreviewOptions } from "./options";
import { createEmulatorPreviewChannel } from "./messaging/channel";

export const emulatorPreview = async (
  options: EmulatorPreviewOptions
): Promise<void> => {
  const appium = await getAppium({});
  const sessions = await Promise.all(
    options.devices.map(async (device) => appium.getSession(device))
  );

  createEmulatorPreviewChannel(options.channel, options);

  const cleanup = async () => {
    try {
      await Promise.all(sessions.map((session) => session.deleteSession()));
    } catch {
      // Ignore errors
    }
  };

  // Set up cleanup on process exit
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
  process.on("exit", cleanup);
};
