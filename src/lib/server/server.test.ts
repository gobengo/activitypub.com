import { Repeater } from "@repeaterjs/repeater";
import { timeout } from "@repeaterjs/timers";
import { Expect, Focus, Test, TestFixture } from "alsatian";
import { cli } from "alsatian-cli-function";
import { take, tap, toArray } from "axax";
import { wait } from "axax/es5/wait";
import * as http from "http";
import fetch from "node-fetch";
import * as urlModule from "url";
import { withHttpServer } from "with-http-server";
import WebSocket from "ws";
import { as2PublicAudienceUri } from "../activitystreams2";
import { ServerModule } from "./server";

const as2ContentType = `application/ld+json; profile="https://www.w3.org/ns/activitystreams"`;
const as2ContextUrl = "https://www.w3.org/ns/activitystreams";

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
  @Test("can discover ActivityPub inbox from /")
  public async testDiscoverInbox() {
    await withHttpServer(TestableActivityPubDotComServer())(async ({ url }) => {
      const response = await fetch(url, {
        headers: { accept: as2ContentType },
      });
      Expect(response.status).toBe(200);
      Expect(response.headers.get("content-type")).toEqual(as2ContentType);
      const responseJsonObject = await response.json();
      Expect(responseJsonObject).toBeTruthy();
    });
  }

  @Test()
  public async testGetIndex() {
    await withHttpServer(TestableActivityPubDotComServer())(async ({ url }) => {
      const response = await fetch(url);
      const responseText = await response.text();
      Expect(responseText).toBeTruthy();
      Expect(response.status).toBe(200);
    });
  }

  @Test("POST /api/activitypub/inbox")
  public async testPostInbox() {
    await withHttpServer(TestableActivityPubDotComServer())(async ({ url }) => {
      const inboxUrl = urlModule.resolve(url, "/api/activitypub/inbox");
      const messageToPost = {
        "@context": as2ContextUrl,
        type: "Create",
        // tslint:disable-next-line: object-literal-sort-keys
        object: {
          content: "Hello, world",
          type: "Note",
        },
        bcc: [as2PublicAudienceUri],
      };
      const response = await fetch(inboxUrl, {
        body: JSON.stringify(messageToPost, null, 2),
        headers: {
          accept: "application/json",
          "content-type": as2ContentType,
        },
        method: "post",
      });
      const responseText = await response.text();
      Expect(response.status).toEqual(201);
      Expect(responseText).toBeTruthy();
    });
  }

  @Test("POST /api/activitypub/inbox with invalid JSON errors with 400")
  public async testPostInboxWithBadJson() {
    await withHttpServer(TestableActivityPubDotComServer())(async ({ url }) => {
      const inboxUrl = urlModule.resolve(url, "/api/activitypub/inbox");
      const response = await fetch(inboxUrl, {
        body: `{ invalidJson }`,
        headers: { "content-type": as2ContentType },
        method: "post",
      });
      const responseText = await response.text();
      Expect(responseText).toBeTruthy();
      Expect(response.status).toEqual(400);
    });
  }

  @Test("POST /api/activitypub/inbox with non-public Activity errors with 400")
  public async testPostInboxWithNonPublic() {
    await withHttpServer(TestableActivityPubDotComServer())(async ({ url }) => {
      const inboxUrl = urlModule.resolve(url, "/api/activitypub/inbox");
      const messageToPost = {
        "@context": as2ContextUrl,
        content: "Hello, world",
        type: "Note",
      };
      const response = await fetch(inboxUrl, {
        body: JSON.stringify(messageToPost, null, 2),
        headers: { "content-type": as2ContentType },
        method: "post",
      });
      const responseText = await response.text();
      Expect(response.status).toEqual(400);
      Expect(responseText).toBeTruthy();
    });
  }

  @Test("POST /api/activitypub/inbox sends activity down websocket /stream")
  public async testPostInboxWhileConsumingStream() {
    await withHttpServer(TestableActivityPubDotComServer())(async ({ url }) => {
      const inboxUrl = urlModule.resolve(url, "/api/activitypub/inbox");
      const streamUrl = urlModule.resolve(url, "/stream");
      const webSocket = new WebSocket(streamUrl);
      const messagesIterator = webSocketMessages(webSocket);
      const messageToPost = {
        "@context": as2ContextUrl,
        bcc: [as2PublicAudienceUri],
        object: {
          content: "Hello, world",
          type: "Note",
        },
        type: "Create",
      };
      const [message] = await Promise.all([
        messagesIterator.next().then(({ value }) => value),
        (async () => {
          // send a message
          const response = await fetch(inboxUrl, {
            body: JSON.stringify(messageToPost, null, 2),
            headers: { "content-type": as2ContentType },
            method: "post",
          });
          Expect(response.status).toEqual(201);
        })(),
      ]);

      Expect(message).toBeTruthy();
      const parsedMessage = JSON.parse(message);
      Expect(parsedMessage).toEqual(messageToPost);
      webSocket.close();
    });
  }
}

if (require.main === module) {
  (async () => {
    await cli(__filename);
  })();
}
