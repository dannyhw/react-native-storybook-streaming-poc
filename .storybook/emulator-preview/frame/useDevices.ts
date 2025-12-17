import { useEffect, useState } from "react";
import type { EmulatorDevice } from "../options";
import { getClientChannel } from "../messaging/client";

const emulatorPreviewChannel = getClientChannel();

export const useDevices = () => {
  const [devices, setDevices] = useState<EmulatorDevice[]>([]);

  useEffect(() => {
    const handleDevicesResponse = (data: { devices: EmulatorDevice[] }) => {
      setDevices(data.devices);
    };

    emulatorPreviewChannel.on(
      "emulator-preview/get-all-devices-response",
      handleDevicesResponse
    );
    emulatorPreviewChannel.emit("emulator-preview/get-all-devices");

    return () => {
      emulatorPreviewChannel.off(
        "emulator-preview/get-all-devices-response",
        handleDevicesResponse
      );
    };
  }, []);

  return devices;
};
