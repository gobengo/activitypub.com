import * as http from "http";

type IHttpConnection = http.IncomingMessage['connection'] & {
  // This is present in some versions of node, but not all.
  encrypted?: any;
};

export function incomingMessageIsSecure (req: http.IncomingMessage): boolean {
  const trustHttpProxy = process.env.TRUST_HTTP_PROXY;
  const { connection } = req;
  const isDefinitelyEncrypted = connection && (connection as IHttpConnection).encrypted;
  const forwardedProtocol = req.headers['x-forwarded-proto'];
  const isSecure =
     (isDefinitelyEncrypted && true)
  || (trustHttpProxy && forwardedProtocol)
  || false;
  return Boolean(isSecure);
}

export function incomingMessageUrl (req: http.IncomingMessage) {
  const trustHttpProxy = process.env.TRUST_HTTP_PROXY;
  const forwardedProtocol = req.headers['x-forwarded-proto'];
  const protocol =
    trustHttpProxy
      ? forwardedProtocol
    : incomingMessageIsSecure(req)
      ? 'https'
      : 'http';
  const host = req.headers.host;
  const url = `${protocol}://${host}${req.url}`;
  return url;
}
