import type { Preview } from "@storybook/react-native-web-vite";
import type { CSSProperties } from "react";
import {
  iosDevices,
  androidDevices,
  defaultConfig,
  type DeviceGlobals,
} from "./devices.ts";

const fontFamily =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

const labelStyle: CSSProperties = {
  marginTop: 12,
  fontSize: 13,
  fontFamily,
  fontWeight: 500,
  color: "#6b7280",
  letterSpacing: "0.01em",
};

const DeviceFrame = ({
  frameUrl,
  streamUrl,
  screenPosition,
  label,
}: {
  frameUrl: string;
  streamUrl: string;
  screenPosition: { top: string; left: string; width: string; height: string; borderRadius: string };
  label: string;
}) => (
  <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
    <div style={{ position: "relative", maxHeight: "85vh" }}>
      <img
        src={frameUrl}
        style={{
          maxHeight: "85vh",
          position: "relative",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      <img
        src={streamUrl}
        style={{
          position: "absolute",
          top: screenPosition.top,
          left: screenPosition.left,
          width: screenPosition.width,
          height: screenPosition.height,
          objectFit: "cover",
          borderRadius: screenPosition.borderRadius,
        }}
      />
    </div>
    <span style={labelStyle}>{label}</span>
  </div>
);

const WebFrame = ({ children }: { children: React.ReactNode }) => (
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
          <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#ff5f57" }} />
          <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#ffbd2e" }} />
          <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#28c840" }} />
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
          <span style={{ fontSize: 12, color: "#999", fontFamily }}>localhost:6006</span>
        </div>
      </div>
      {/* Content */}
      <div style={{ flex: 1, padding: 16 }}>{children}</div>
    </div>
    <span style={{ ...labelStyle, textAlign: "center" }}>Web</span>
  </div>
);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  globalTypes: {
    iosDevice: {
      description: "iOS device frame",
      toolbar: {
        title: "iOS Device",
        items: Object.entries(iosDevices).map(([id, device]) => ({
          value: id,
          title: device.name,
        })),
        dynamicTitle: true,
      },
    },
    androidDevice: {
      description: "Android device frame",
      toolbar: {
        title: "Android Device",
        items: Object.entries(androidDevices).map(([id, device]) => ({
          value: id,
          title: device.name,
        })),
        dynamicTitle: true,
      },
    },
    showIos: {
      description: "Show iOS device",
      toolbar: {
        title: "iOS",
        items: [
          { value: true, title: "Show iOS", icon: "mobile" },
          { value: false, title: "Hide iOS", icon: "close" },
        ],
      },
    },
    showAndroid: {
      description: "Show Android device",
      toolbar: {
        title: "Android",
        items: [
          { value: true, title: "Show Android", icon: "mobile" },
          { value: false, title: "Hide Android", icon: "close" },
        ],
      },
    },
    showWeb: {
      description: "Show Web preview",
      toolbar: {
        title: "Web",
        items: [
          { value: true, title: "Show Web", icon: "browser" },
          { value: false, title: "Hide Web", icon: "close" },
        ],
      },
    },
  },
  initialGlobals: {
    iosDevice: defaultConfig.iosDevice,
    androidDevice: defaultConfig.androidDevice,
    iosStreamPort: defaultConfig.iosStreamPort,
    androidStreamPort: defaultConfig.androidStreamPort,
    showIos: true,
    showAndroid: true,
    showWeb: true,
  } satisfies DeviceGlobals,
  decorators: [
    (Story, context) => {
      const globals = context.globals as DeviceGlobals;
      const ios = iosDevices[globals.iosDevice];
      const android = androidDevices[globals.androidDevice];

      const webOnly = globals.showWeb && !globals.showIos && !globals.showAndroid;

      if (webOnly) {
        return <Story />;
      }

      return (
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
            {globals.showIos && ios && (
              <DeviceFrame
                frameUrl={ios.frame}
                streamUrl={`http://localhost:${globals.iosStreamPort}`}
                screenPosition={ios.screen}
                label="iOS"
              />
            )}
            {globals.showAndroid && android && (
              <DeviceFrame
                frameUrl={android.frame}
                streamUrl={`http://localhost:${globals.androidStreamPort}`}
                screenPosition={android.screen}
                label="Android"
              />
            )}
            {globals.showWeb && (
              <WebFrame>
                <Story />
              </WebFrame>
            )}
          </div>
        </div>
      );
    },
  ],
};

export default preview;
