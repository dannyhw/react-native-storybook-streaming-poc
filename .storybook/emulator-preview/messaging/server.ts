import { EmulatorPreviewOptions } from "../options";
import type { PreviewSession } from "../preview-session";

export const createServerChannel = (
  { channel: storybookChannel }: EmulatorPreviewOptions,
  sessions: PreviewSession[]
): void => {
  storybookChannel.on("emulator-preview/get-all-devices", async () => {
    storybookChannel.emit("emulator-preview/get-all-devices-response", {
      devices: sessions.map((session) => {
        return {
          ...session.device,
          streamUrl: session.getStreamUrl(),
        };
      }),
    });
  });
};
