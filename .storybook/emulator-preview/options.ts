import type { Channel as StorybookChannel } from "storybook/internal/channels";

export type EmulatorDevice = {
  id: string;
  name: string;
  platform: "ios" | "android";
};

export type EmulatorPreviewOptions = {
  channel: StorybookChannel;
  devices: EmulatorDevice[];
};
