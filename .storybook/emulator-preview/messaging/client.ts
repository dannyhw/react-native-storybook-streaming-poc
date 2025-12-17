import { addons } from "storybook/preview-api";
import type { EmulatorPreviewChannel } from "./types";

export const getClientChannel = (): EmulatorPreviewChannel => {
  return addons.getChannel();
};
