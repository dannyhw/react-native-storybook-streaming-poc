import AsyncStorage from "@react-native-async-storage/async-storage";
import { view } from "./storybook.requires";
import { Platform } from "react-native";
import { defaultConfig } from "../.storybook/devices";
import { LiteUI } from "@storybook/react-native-ui-lite";

const StorybookUIRoot = view.getStorybookUI({
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
  onDeviceUI: false,
  enableWebsockets: true,
  CustomUIComponent: LiteUI,
  // Android emulator uses 10.0.2.2 to reach host machine's localhost
  host: Platform.OS === "ios" ? defaultConfig.websocketHost : "10.0.2.2",
  port: defaultConfig.websocketPort,
});

export default StorybookUIRoot;
