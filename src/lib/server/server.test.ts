import { Repeater } from "@repeaterjs/repeater";
import { timeout } from "@repeaterjs/timers";
import { Expect, Focus, Test, TestFixture } from "alsatian";
import { cli } from "alsatian-cli-function";
import { take, toArray } from "axax";
import { wait } from "axax/es5/wait";
import * as http from "http";
import fetch from "node-fetch";
import * as urlModule from "url";
import { withHttpServer } from "with-http-server";
import WebSocket from "ws";
import { ServerModule } from "./server";

/** Given a WebSocket, return an Async Iterator of messages */
const webSocketMessages = (
  socket: WebSocket,
): AsyncIterableIterator<string> => {
  const messages = new Repeater<string>(async (push, stop) => {
    socket.onmessage = ev => push(ev.data.toString());
    socket.onerror = error => stop(error);
    socket.onclose = () => stop();
    await stop;
    socket.close();
  });
  return messages;
};

function TestableActivityPubDotComServer() {
  const server = http.createServer();
  ServerModule().install(server);
  return server;
}

@TestFixture("ActivityPubDotComServer")
export class ActivityPubDotComServerTest {
  @Test()
  public async testGetIndex() {
    await withHttpServer(TestableActivityPubDotComServer())(async ({ url }) => {
      const response = await fetch(url);
      const responseText = await response.text();
      Expect(responseText).toBeTruthy();
      Expect(response.status).toBe(200);
    });
  }

  @Test()
  public async testGetWebSocket() {
    await withHttpServer(TestableActivityPubDotComServer())(async ({ url }) => {
      const streamUrl = urlModule.resolve(url, "/stream");
      const ws = new WebSocket(streamUrl);
      Expect(ws).toBeTruthy();
      const messagesIterator = webSocketMessages(ws);
      const messages = await Promise.race([
        wait(1000),
        toArray(take(1)(messagesIterator)) as Promise<string[]>,
      ]);
      if (!messages) {
        throw new Error(`Expected messages from websocket but got none`);
      }
      const [firstMessage] = messages;
      Expect(firstMessage).toBeTruthy();
      const parsedFirstMessage = JSON.parse(firstMessage);
      Expect(typeof parsedFirstMessage).toBe("object");
      Expect(parsedFirstMessage["@context"]).toEqual(
        "https://www.w3.org/ns/activitystreams",
      );
    });
  }
}

if (require.main === module) {
  (async () => {
    await cli(__filename);
  })();
}
