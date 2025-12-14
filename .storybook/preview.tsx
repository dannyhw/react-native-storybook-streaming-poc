import type { Preview } from "@storybook/react-native-web-vite";
import { Text, View } from "react-native";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", columnGap: 64 }}>
          <View style={{ borderWidth: 1, borderColor: "red" }}>
            <Text style={{ color: "red" }}>VIDEO STREAM GOES HERE</Text>
          </View>
          <View>
            <Story />
          </View>
        </View>
      </View>
    ),
  ],
};

export default preview;
