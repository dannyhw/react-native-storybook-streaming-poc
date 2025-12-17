import type { Preview } from "@storybook/react-native-web-vite";
import { previewFrameDecorator } from "./emulator-preview/preview";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [previewFrameDecorator],
};

export default preview;
