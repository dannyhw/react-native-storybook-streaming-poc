import net from "node:net";

export const isPortAvailable = (port: number): Promise<boolean> => {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => {
      server.close();
      resolve(false);
    });
    server.once("listening", () => {
      server.close();
      resolve(true);
    });
    server.listen(port);
  });
};

export const findAvailablePort = async (
  startPort: number = 9000,
  maxPort: number = 9100
): Promise<number> => {
  let port = startPort;

  while (!(await isPortAvailable(port))) {
    port++;

    if (port > maxPort) {
      throw new Error(
        `No available port found between ${startPort} and ${maxPort}`
      );
    }
  }

  return port;
};
