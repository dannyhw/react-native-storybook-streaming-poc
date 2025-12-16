# React Native Storybook Streaming

A proof-of-concept that syncs **React Native Storybook** with **React Native Web Storybook** and streams live simulator/emulator views directly into the Storybook canvas.

## What it does

- **Synchronized story selection**: When you select a story in the web Storybook UI, the corresponding story is automatically rendered on the connected React Native simulator/emulator
- **Live simulator streaming**: The iOS Simulator and Android Emulator screens are streamed in real-time to the Storybook canvas via Appium, so you can see your native components rendered on actual device frames
- **Unified development experience**: Develop and preview React Native components in a familiar Storybook web interface while seeing true native rendering

## How it works

- `.storybook/preview.tsx` - Contains a decorator that overlays the streamed simulator view onto the Storybook canvas with device frame mockups
- `.storybook/main.ts` - React Native Web Vite Storybook setup with a modified version of `@storybook/addon-react-native-server` for device communication
- `.rnstorybook/` - React Native Storybook configuration that runs on the mobile app

## How to run

```bash
# Install Appium globally
bun i -g appium
appium setup

# Install project dependencies
bun install

# Terminal 1: Run Appium server
appium

# Terminal 2: Run web Storybook
bun storybook

# Terminal 3: Run React Native Storybook (starts simulator)
bun start
```

## Extending

- Add server-side/Node.js functionality in `.storybook/main.ts`
- Customize the canvas overlay and device frames in `.storybook/preview.tsx`
