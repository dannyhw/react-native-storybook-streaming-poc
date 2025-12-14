import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { default as StorybookUIRoot } from "./.rnstorybook";

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <StorybookUIRoot />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
