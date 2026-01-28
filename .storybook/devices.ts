// Shared device configuration for Storybook and Appium

export const iosDevices = {
  "iphone-14-starlight": {
    name: "iPhone 14",
    frame: "/Apple iPhone 14 Starlight.png",
    screen: { top: "2.4%", left: "5.8%", width: "88.5%", height: "95.2%", borderRadius: "8%" },
    appium: {
      deviceName: "iPhone 17",
      automationName: "XCUITest",
    },
  },
} as const;

export const androidDevices = {
  "samsung-note10-aura": {
    name: "Galaxy Note 10",
    frame: "/Samsung Galaxy Note 10 Aura Glow.png",
    screen: { top: "2.5%", left: "3.5%", width: "93%", height: "95%", borderRadius: "4%" },
    appium: {
      deviceName: "Pixel_9",
      udid: "emulator-5554",
      automationName: "UiAutomator2",
    },
  },
} as const;

export type IosDeviceId = keyof typeof iosDevices;
export type AndroidDeviceId = keyof typeof androidDevices;

// Default configuration
export const defaultConfig = {
  // Device selection
  iosDevice: "iphone-14-starlight" as IosDeviceId,
  androidDevice: "samsung-note10-aura" as AndroidDeviceId,

  // MJPEG stream ports (where device screens are streamed to)
  iosStreamPort: 8080,
  androidStreamPort: 8083,

  // Appium server
  appiumHost: "127.0.0.1",
  appiumPort: 4723,

  // MJPEG quality settings
  mjpegScalingFactor: 75,
  mjpegScreenshotQuality: 20,
  mjpegFramerate: 60,

  // WebSocket server (for RN <-> Web Storybook sync)
  websocketHost: "localhost",
  websocketPort: 7007,
};

export interface DeviceGlobals {
  iosDevice: IosDeviceId;
  androidDevice: AndroidDeviceId;
  iosStreamPort: number;
  androidStreamPort: number;
  showIos: boolean;
  showAndroid: boolean;
  showWeb: boolean;
}
