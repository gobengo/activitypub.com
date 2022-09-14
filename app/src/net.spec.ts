import test from 'ava';
import fetch from '@web-std/fetch'
import { addressPort, addressUrl, withServer } from './net.js';
import { createServer, createConnection } from 'node:net';
import { createServer as createHttpServer } from 'node:http';

test('withServer can use an net server', async t => {
  let didWriteToConnection = true;
  const receivedData = [];
  const server = createServer((c) => {
    c.on('data', chunk => { receivedData.push(chunk); });
  });
  await withServer(server.listen(0), async (server) => {
    const conn = createConnection(addressPort(server.address()))
    await new Promise((resolve) => {
      conn.write('foo')
      conn.end(() => { resolve(undefined); });
    });
    didWriteToConnection = true
  });
  t.is(didWriteToConnection, true, 'did write to connection');
  t.is(receivedData.length, 1, 'received 1 data');
});

test('withServer can use an http server', async t => {
  let didWriteToConnection = true;
  const server = createHttpServer((req, res) => {
    res.writeHead(200).end();
  });
  let didGetResponse = false
  await withServer(server.listen(0), async (server) => {
    const response = await fetch(addressUrl('http', server.address()));
    t.is(response.status, 200);
    didGetResponse = true;
  });
  t.is(didGetResponse, true, 'did get response');
});
