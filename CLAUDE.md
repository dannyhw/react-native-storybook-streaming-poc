# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a proof-of-concept that syncs React Native Storybook with React Native Web Storybook and streams live simulator/emulator views directly into the Storybook canvas via Appium.

## Common Commands

```bash
# Install dependencies
bun install

# Run web Storybook (port 6006)
bun storybook

# Run React Native Storybook (Expo dev server)
bun start

# Generate story files for React Native
bun storybook-generate

# Build web Storybook
bun build-storybook

# Run Appium server (required for device streaming)
appium
```

## Architecture

### Dual Storybook Setup
- **`.storybook/`** - Web Storybook configuration using `@storybook/react-native-web-vite`
- **`.rnstorybook/`** - React Native Storybook configuration using `@storybook/react-native`

Both configurations share stories from `stories/` directory.

### Key Components

**`.storybook/main.ts`** - Web Storybook config with custom server channel:
- Starts WebSocket server on port 7007 for bidirectional communication with mobile app
- Integrates Appium via `startAppium()` to capture device screens
- Forwards Storybook events between web UI and mobile devices

**`.storybook/preview.tsx`** - Decorator that displays three views side-by-side:
- iOS simulator stream (localhost:8080)
- Android emulator stream (localhost:8083)
- Web component render

**`.storybook/wdui.mjs`** - WebDriverIO/Appium configuration:
- Connects to iOS simulator (MJPEG on port 8080)
- Connects to Android emulator (MJPEG on port 8083)
- Configures streaming quality and framerate

**`.rnstorybook/index.ts`** - Mobile Storybook entry:
- Connects to WebSocket server for story synchronization
- Uses different hosts for iOS (localhost) vs Android (10.0.2.2)

**`App.tsx`** - Expo app entry that renders the React Native Storybook UI

### Communication Flow
1. User selects story in web Storybook UI
2. Event sent via WebSocket (port 7007) to connected mobile devices
3. Mobile apps render the selected story
4. Appium streams device screens back to web canvas via MJPEG

### Running the Full Setup
Requires three terminals:
1. `appium` - Appium server for device communication
2. `bun storybook` - Web Storybook
3. `bun start` - Expo/React Native (boot iOS/Android from here)
