import type { Appium } from "./appium";
import { EmulatorDevice } from "./options";

export type PreviewSession = {
  device: EmulatorDevice;
  dispose: () => Promise<void>;
  getStreamUrl: () => string;
};

export const createPreviewSession = async (
  appium: Appium,
  device: EmulatorDevice
): Promise<PreviewSession> => {
  const session = await appium.getSession(device);

  const dispose = async () => {
    try {
      await session.deleteSession();
    } catch {
      // Nothing we can do here
    }
  };

  const getStreamUrl = (): string => {
    return `${session.options.hostname}:${session.capabilities["appium:mjpegServerPort"]}`;
  };

  return {
    device,
    dispose,
    getStreamUrl,
  };
};
