import test from 'ava';
import { createActivityPubComApplication } from './application.js';
import fetch from '@web-std/fetch'
import { addressUrl, withServer } from './net.js';

test('application can use withServer', async t => {
  const app = createActivityPubComApplication();
  let didUseServer = false;
  await withServer(app.listen(0), async (server) => {
    didUseServer = true;
    const url = addressUrl('http', server.address());
    // fetch url
    const response = await fetch(url);
    t.is(response.status, 200)
  })
  t.is(didUseServer, true, 'did use server');
});

test('application has a did.json',
  async t => withServer(
    createActivityPubComApplication().listen(0),
    async (server, url = addressUrl('http', server.address())) => {
      const response = await fetch(new URL(`/.well-known/did.json`, url))
      t.is(response.status, 200);
      const didDocument = await response.json();
      t.is(typeof didDocument.id, 'string', 'did document id is a string');
    }
  )
);
