import { remote } from "webdriverio";
import { iosDevices, androidDevices, defaultConfig } from "./devices.ts";

const ios = iosDevices[defaultConfig.iosDevice];
const android = androidDevices[defaultConfig.androidDevice];

const baseCapabilities = {
  "appium:newCommandTimeout": 0,
  "appium:mjpegScalingFactor": defaultConfig.mjpegScalingFactor,
  "appium:mjpegServerScreenshotQuality": defaultConfig.mjpegScreenshotQuality,
  "appium:mjpegServerFramerate": defaultConfig.mjpegFramerate,
};

const iosCapabilities = {
  platformName: "iOS",
  "appium:automationName": ios.appium.automationName,
  "appium:deviceName": ios.appium.deviceName,
  "appium:mjpegServerPort": defaultConfig.iosStreamPort,
  ...baseCapabilities,
};

const androidCapabilities = {
  platformName: "Android",
  "appium:automationName": android.appium.automationName,
  "appium:deviceName": android.appium.deviceName,
  "appium:udid": android.appium.udid,
  "appium:mjpegServerPort": defaultConfig.androidStreamPort,
  ...baseCapabilities,
};

const baseOptions = {
  hostname: defaultConfig.appiumHost,
  port: defaultConfig.appiumPort,
  path: "/",
};

export async function startAppium() {
  console.log("Starting WebDriverIO connections...");

  // iOS
  await remote({
    ...baseOptions,
    capabilities: iosCapabilities,
  });
  console.log(`iOS connected (MJPEG stream on port ${defaultConfig.iosStreamPort})`);

  // Android
  await remote({
    ...baseOptions,
    capabilities: androidCapabilities,
  });
  console.log(`Android connected (MJPEG stream on port ${defaultConfig.androidStreamPort})`);
}
