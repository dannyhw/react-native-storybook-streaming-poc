import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { addons } from "storybook/preview-api";
import type { EmulatorDevice } from "../options";

const storybookChannel = addons.getChannel();

interface DeviceFrameProps {
  device: EmulatorDevice;
  story: React.ComponentType;
}

const DeviceFrame: React.FC<DeviceFrameProps> = ({ device, story: Story }) => {
  const getDeviceFrameImage = (platform: string) => {
    if (platform === "ios") {
      return "/Apple iPhone 14 Starlight.png";
    } else if (platform === "android") {
      return "/Samsung Galaxy S9 Titanium Gray.png";
    }
    return "";
  };

  const getDeviceUrl = (platform: string) => {
    if (platform === "ios") {
      return "http://localhost:8080";
    } else if (platform === "android") {
      return "http://localhost:8083";
    }
    return "";
  };

  const getFramePositioning = (platform: string) => {
    if (platform === "ios") {
      return {
        top: "2.4%",
        left: "5.8%",
        width: "88.5%",
        height: "95.2%",
        borderRadius: "8%",
      };
    } else if (platform === "android") {
      return {
        top: "8.5%",
        left: "2.8%",
        width: "94.5%",
        height: "93%",
        borderRadius: "3%",
      };
    }
    return {};
  };

  const frameImage = getDeviceFrameImage(device.platform);
  const deviceUrl = getDeviceUrl(device.platform);
  const positioning = getFramePositioning(device.platform);

  return (
    <View style={{ alignItems: "center" }}>
      <View style={{ position: "relative", maxHeight: "85vh" }}>
        <img
          src={frameImage}
          style={{
            maxHeight: "85vh",
            position: "relative",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
        <img
          src={deviceUrl}
          style={{
            position: "absolute",
            ...positioning,
            objectFit: "cover",
          }}
        />
      </View>
      <Text style={{ marginTop: 12, fontSize: 14, color: "#666" }}>
        {device.platform === "ios" ? "iOS" : "Android"}
      </Text>
    </View>
  );
};

export const previewFrameDecorator = (Story: React.ComponentType) => {
  const [devices, setDevices] = useState<EmulatorDevice[]>([]);

  useEffect(() => {
    const handleDevicesResponse = (data: { devices: EmulatorDevice[] }) => {
      setDevices(data.devices);
    };

    storybookChannel.on(
      "emulator-preview/get-all-devices-response",
      handleDevicesResponse
    );
    storybookChannel.emit("emulator-preview/get-all-devices");

    return () => {
      storybookChannel.off(
        "emulator-preview/get-all-devices-response",
        handleDevicesResponse
      );
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          columnGap: 64,
          flex: 1,
          width: "100%",
        }}
      >
        {/* Dynamic device frames */}
        {devices.map((device) => (
          <DeviceFrame key={device.id} device={device} story={Story} />
        ))}

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
  );
};
