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
          {/* iPhone */}
          <View style={{ alignItems: "center" }}>
            <View style={{ position: "relative", maxHeight: "85vh" }}>
              <img
                src="/Apple iPhone 14 Starlight.png"
                style={{
                  maxHeight: "85vh",
                  position: "relative",
                  zIndex: 1,
                  pointerEvents: "none",
                }}
              />
              <img
                src="http://localhost:8080"
                style={{
                  position: "absolute",
                  top: "2.4%",
                  left: "5.8%",
                  width: "88.5%",
                  height: "95.2%",
                  objectFit: "cover",
                  borderRadius: "8%",
                }}
              />
            </View>
            <Text style={{ marginTop: 12, fontSize: 14, color: "#666" }}>
              iOS
            </Text>
          </View>
          {/* Android */}
          <View style={{ alignItems: "center" }}>
            <View style={{ position: "relative", maxHeight: "85vh" }}>
              <img
                src="/Samsung Galaxy Note 10 Aura Glow.png"
                style={{
                  maxHeight: "85vh",
                  position: "relative",
                  zIndex: 1,
                  pointerEvents: "none",
                }}
              />
              <img
                src="http://localhost:8083"
                style={{
                  position: "absolute",
                  top: "2.5%",
                  left: "3.5%",
                  width: "93%",
                  height: "95%",
                  objectFit: "cover",
                  borderRadius: "4%",
                }}
              />
            </View>
            <Text style={{ marginTop: 12, fontSize: 14, color: "#666" }}>
              Android
            </Text>
          </View>
          {/* Web */}
          <View style={{ flex: 1 }}>
            <View
              style={{
                height: "85vh",
                width: "100%",
                borderRadius: 8,
                overflow: "hidden",
                borderWidth: 1,
                borderColor: "#e0e0e0",
                backgroundColor: "#fff",
              }}
            >
              {/* Browser toolbar */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  backgroundColor: "#f5f5f5",
                  borderBottomWidth: 1,
                  borderBottomColor: "#e0e0e0",
                }}
              >
                {/* Traffic lights */}
                <View style={{ flexDirection: "row", gap: 6 }}>
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: "#ff5f57",
                    }}
                  />
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: "#ffbd2e",
                    }}
                  />
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: "#28c840",
                    }}
                  />
                </View>
                {/* URL bar */}
                <View
                  style={{
                    flex: 1,
                    marginLeft: 12,
                    backgroundColor: "#fff",
                    borderRadius: 4,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                  }}
                >
                  <Text style={{ fontSize: 12, color: "#999" }}>
                    localhost:6006
                  </Text>
                </View>
              </View>
              {/* Content */}
              <View style={{ flex: 1, padding: 16 }}>
                <Story />
              </View>
            </View>
            <Text
              style={{
                marginTop: 12,
                fontSize: 14,
                color: "#666",
                textAlign: "center",
              }}
            >
              Web
            </Text>
          </View>
        </View>
      </View>
    ),
  ],
};

export default preview;
