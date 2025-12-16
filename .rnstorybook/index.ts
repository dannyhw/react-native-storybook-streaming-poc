import AsyncStorage from "@react-native-async-storage/async-storage";
import { view } from "./storybook.requires";
import { Platform } from "react-native";

const StorybookUIRoot = view.getStorybookUI({
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
  onDeviceUI: false,
  enableWebsockets: true,
  host: Platform.OS === "ios" ? "localhost" : "10.0.2.2",
  port: 7007,
});

export default StorybookUIRoot;
