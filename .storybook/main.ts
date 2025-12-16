import type { StorybookConfig } from "@storybook/react-native-web-vite";
import { Channel } from "storybook/internal/channels";
import { Options } from "storybook/internal/types";
import { WebSocketServer } from "ws";
import EVENTS from "storybook/internal/core-events";
import { startAppium } from "./wdui.mjs";

type ReactNativeServerOptions = {
  host?: string;
  port?: number;
};

async function experimental_serverChannel(
  channel: Channel,
  { configType, presets, loglevel: logLevel }: Options
) {
  startAppium();
  if (configType === "DEVELOPMENT") {
    const options = await presets.apply<ReactNativeServerOptions>(
      "reactNativeServerOptions"
    );

    if (options) {
      const port = options.port ?? 7007;

      const host = options.host ?? "localhost";

      const wss = new WebSocketServer({ port, host });

      wss.on("connection", function connection(ws) {
        console.log("websocket connection established");

        ws.on("error", console.error);

        ws.on("message", function message(data) {
          try {
            const json = JSON.parse(data.toString());

            if (logLevel === "debug") {
              console.log("Websocket message received from client:");
              console.log("type: ", json.type);
              console.log("args: ", json.args[0]);
            }

            if (json.args && Array.isArray(json.args) && json.args.length > 0) {
              channel.emit?.(json.type, json.args[0]);
            } else {
              channel.emit?.(json.type);
            }
          } catch (error) {
            console.error(error);
          }
        });
      });

      setInterval(function ping() {
        wss.clients.forEach(function each(ws) {
          ws.send(JSON.stringify({ type: "ping", args: [] }));
        });
      }, 10000);

      [
        ...Object.values(EVENTS),
        "storybook-addon-background:set",
        "storybook-addon-background:unset",
        "storybook-addon-background:update",
        "storybook/actions/action-event",
        "storybook/actions/action-clear",
      ].forEach((curEvent) => {
        channel.on(curEvent, async (data) => {
          if (logLevel === "debug") {
            console.log("before event thing");
          }
          try {
            const arg0 = data?.data?.args?.[0];
            if (curEvent === "storybook/actions/action-event" && arg0) {
              arg0.nativeEvent = null;
              arg0.target = null;
              arg0.currentTarget = null;
              arg0.view = null;
              arg0.stateNode = null;
            }

            if (logLevel === "debug") {
              console.log("message received on the storybook channel");
              console.log("type: ", curEvent);
              console.log("data: ", data);
              console.log("arg: ", data?.data?.args?.[0]);
            }

            const toSend = JSON.stringify({ type: curEvent, args: [data] });

            wss.clients.forEach((ws) => ws.send(toSend));
          } catch (error) {
            console.error({ event: curEvent, error });
          }
        });
      });
    }
  }

  return channel;
}

const config: StorybookConfig & {
  reactNativeServerOptions: ReactNativeServerOptions;
  experimental_serverChannel: (
    channel: Channel,
    options: Options
  ) => Promise<Channel>;
} = {
  stories: ["../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [],
  framework: "@storybook/react-native-web-vite",
  staticDirs: ["./static"],
  experimental_serverChannel,
  reactNativeServerOptions: {
    host: "localhost",
    port: 7007,
  },
};
export default config;
