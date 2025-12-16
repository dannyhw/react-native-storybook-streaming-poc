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
        <View
          style={{
            flexDirection: "row",
            columnGap: 64,
            flex: 1,
            width: "100%",
          }}
        >
          <View style={{ borderWidth: 1, borderColor: "lightgray" }}>
            <img src="http://localhost:8080" style={{ maxHeight: "90vh" }} />
          </View>
          <View style={{ borderWidth: 1, borderColor: "lightgray" }}>
            <img src="http://localhost:8083" style={{ maxHeight: "90vh" }} />
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
