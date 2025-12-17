import { execa } from "execa";
import semver from "semver";
import { remote } from "webdriverio";
import type { EmulatorDevice } from "./options";

export type AppiumOptions = {
  appiumBinary?: string;
};

export type Appium = {
  getSession: (device: EmulatorDevice) => Promise<WebdriverIO.Browser>;
};

type InternalAppiumOptions = Required<AppiumOptions>;

const isCompatibleAppiumInstalled = async (
  options: InternalAppiumOptions
): Promise<boolean> => {
  try {
    const { stdout } = await execa(options.appiumBinary, ["--version"]);
    return semver.satisfies(stdout, ">=3.0.0");
  } catch (error) {
    return false;
  }
};

export const getAppium = async ({
  appiumBinary = "appium",
}: AppiumOptions): Promise<Appium> => {
  const isInstalled = await isCompatibleAppiumInstalled({ appiumBinary });

  if (!isInstalled) {
    throw new Error("Appium is not installed or is not compatible");
  }

  return {
    getSession: async (device: EmulatorDevice) => {
      return remote({
        hostname: "localhost",
        port: 4723,
        path: "/",
        capabilities: {
          platformName: device.platform === "android" ? "Android" : "iOS",
          "appium:automationName":
            device.platform === "android" ? "UiAutomator2" : "XCUITest",
          "appium:mjpegServerPort": 8083,
          "appium:udid": device.id,
          "appium:deviceName": device.name,
        },
      });
    },
  };
};
