import { remote } from "webdriverio";

const isAndroid = false;
const device = {
  name: "iPhone 17",
  id: "1",
};
const mjpegServerPort = 8080;
const capabilities = {
  platformName: isAndroid ? "Android" : "iOS",
  "appium:automationName": isAndroid ? "UiAutomator2" : "XCUITest",
  "appium:deviceName": device.name,
  // 'appium:udid': device.id, // ID in mock is "1", "2". Real UDID needed for real devices.
  // Using device.id as UDID might fail if it's not a valid UDID.
  // However, for the purpose of this task, I will use device.id as requested context implies "for each device".
  // If these are emulators/simulators, name might be enough or udid.
  // I will add udid if it looks like one, or just pass it.
  "appium:mjpegServerPort": mjpegServerPort,
  "appium:newCommandTimeout": 0, // Keep session alive

  "appium:mjpegScalingFactor": 75,
  "appium:mjpegServerScreenshotQuality": 20,
  "appium:mjpegServerFramerate": 60,
};

const options = {
  hostname: "127.0.0.1",
  port: 4723,
  path: "/",
  capabilities,
};

export async function startAppium() {
  console.log("starting webdriverio");
  // ios
  await remote(options);
  // android
  await remote({
    ...options,
    capabilities: {
      ...capabilities,
      platformName: "Android",
      "appium:automationName": "UiAutomator2",
      "appium:mjpegServerPort": 8083,
      "appium:udid": "emulator-5554",
      // "appium:deviceName": "Medium_Phone_API_36.1",
      "appium:deviceName": "Pixel_9",
    },
  });
}
