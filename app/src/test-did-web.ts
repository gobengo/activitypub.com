import type { Server } from "net";
import { addressUrl, withServer } from "./net.js";
import type { Test, TestClass, Tester } from "./test.js";
import fetch from "@web-std/fetch";

/**
 * Test that a server will likely resolve via did:web
 */
export class DidWebTest implements TestClass {
  constructor(
    protected createServer: () => Server
  ) {}
  test = (t: Tester) => {
    return withServer(
      this.createServer(),
      async (server, url = addressUrl('http', server.address())) => {
        const response = await fetch(new URL(`/.well-known/did.json`, url))
        t.is(response.status, 200);
        const didDocument = await response.json();
        t.is(typeof didDocument.id, 'string', 'did document id is a string');
      }
    )
  }
}
