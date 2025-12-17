import { getAppium } from "./appium";
import type { EmulatorPreviewOptions } from "./options";
import { createServerChannel } from "./messaging/server";
import { createPreviewSession } from "./preview-session";

export const emulatorPreview = async (
  options: EmulatorPreviewOptions
): Promise<void> => {
  const appium = await getAppium({});
  const sessions = await Promise.all(
    options.devices.map(async (device) => createPreviewSession(appium, device))
  );

  createServerChannel(options, sessions);

  const cleanup = async () => {
    try {
      await Promise.all(sessions.map((session) => session.dispose()));
    } catch {
      // Ignore errors
    }
  };

  // Set up cleanup on process exit
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
  process.on("exit", cleanup);
};
