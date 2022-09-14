import { AddressInfo, Server } from "node:net";

export async function withServer(server: Server, callback: (server: Server) => Promise<void>) {
  if ( ! server.listening) {
    await new Promise((resolve, reject) => {
      server.once('listening', () => { resolve(undefined); });
    })
  }
  // server is listening
  await callback(server);
  // clean up
  let didClose = false;
  await new Promise((resolve, reject) => {
    server.once('close', () => {
      didClose = true;
      resolve(undefined)
    });
    server.close();
  })
}

export function addressUrl(scheme: string, addressInfo: string | AddressInfo | null): URL {
  if (addressInfo === null)
    throw new TypeError("addressInfo is unexpectedly null");
  if (typeof addressInfo === "string") return new URL(addressInfo);
  const { address, port } = addressInfo;
  const host = address === "::" ? "127.0.0.1" : address;
  const urlString = `${scheme}://${host}:${port}`;
  return new URL(urlString);
}

export function addressPort(addressInfo: string | AddressInfo | null): number {
  if (addressInfo === null)
    throw new TypeError("addressInfo is unexpectedly null");
  if (typeof addressInfo === "string")
    throw new TypeError("addressInfo is unexpectedly string");
  const { port } = addressInfo;
  return port;
}
