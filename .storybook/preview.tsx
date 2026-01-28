import type { Preview } from "@storybook/react-native-web-vite";
import type { CSSProperties } from "react";

const labelStyle: CSSProperties = {
  marginTop: 12,
  fontSize: 13,
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  fontWeight: 500,
  color: "#6b7280",
  letterSpacing: "0.01em",
};

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
      <div style={{ flex: 1, display: "flex" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            columnGap: 64,
            flex: 1,
            width: "100%",
          }}
        >
          {/* iPhone */}
          <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
            <div style={{ position: "relative", maxHeight: "85vh" }}>
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
            </div>
            <span style={labelStyle}>iOS</span>
          </div>
          {/* Android */}
          <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
            <div style={{ position: "relative", maxHeight: "85vh" }}>
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
            </div>
            <span style={labelStyle}>Android</span>
          </div>
          {/* Web */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "85vh",
                width: "100%",
                borderRadius: 8,
                overflow: "hidden",
                border: "1px solid #e0e0e0",
                backgroundColor: "#fff",
              }}
            >
              {/* Browser toolbar */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  padding: "10px 12px",
                  backgroundColor: "#f5f5f5",
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                {/* Traffic lights */}
                <div style={{ display: "flex", flexDirection: "row", gap: 6 }}>
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: "#ff5f57",
                    }}
                  />
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: "#ffbd2e",
                    }}
                  />
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: "#28c840",
                    }}
                  />
                </div>
                {/* URL bar */}
                <div
                  style={{
                    flex: 1,
                    marginLeft: 12,
                    backgroundColor: "#fff",
                    borderRadius: 4,
                    padding: "4px 10px",
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      color: "#999",
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                    }}
                  >
                    localhost:6006
                  </span>
                </div>
              </div>
              {/* Content */}
              <div style={{ flex: 1, padding: 16 }}>
                <Story />
              </div>
            </div>
            <span style={{ ...labelStyle, textAlign: "center" }}>Web</span>
          </div>
        </div>
      </div>
    ),
  ],
};

export default preview;
