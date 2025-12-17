import { execa } from "execa";
import semver from "semver";
import { remote } from "webdriverio";
import type { EmulatorDevice } from "./options";
import { findAvailablePort } from "./utils";

export type AppiumOptions = {
  appiumBinary?: string;
  hostname?: string;
  port?: number;
  path?: string;
};

export type AppiumSession = WebdriverIO.Browser;

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

const setDefaultOptions = (options: AppiumOptions): InternalAppiumOptions => {
  return {
    appiumBinary: options.appiumBinary ?? "appium",
    hostname: options.hostname ?? "localhost",
    port: options.port ?? 4723,
    path: options.path ?? "/",
  };
};

const getSessionCapabilities = async (
  device: EmulatorDevice
): Promise<Record<string, unknown>> => {
  const mjpegServerPort = await findAvailablePort();

  if (device.platform === "android") {
    return {
      platformName: "Android",
      "appium:automationName": "UiAutomator2",
      "appium:mjpegServerPort": mjpegServerPort,
      "appium:udid": device.id,
      "appium:deviceName": device.name,
    };
  }

  if (device.platform === "ios") {
    return {
      platformName: "iOS",
      "appium:automationName": "XCUITest",
      "appium:mjpegServerPort": mjpegServerPort,
      "appium:udid": device.id,
      "appium:deviceName": device.name,
    };
  }

  throw new Error(`Unsupported platform: ${device.platform}`);
};

export const getAppium = async (options: AppiumOptions): Promise<Appium> => {
  const internalOptions = setDefaultOptions(options);
  const isInstalled = await isCompatibleAppiumInstalled(internalOptions);

  if (!isInstalled) {
    throw new Error("Appium is not installed or is not compatible");
  }

  return {
    getSession: async (device: EmulatorDevice) => {
      const capabilities = await getSessionCapabilities(device);

      return remote({
        hostname: internalOptions.hostname,
        port: internalOptions.port,
        path: internalOptions.path,
        capabilities,
      });
    },
  };
};
