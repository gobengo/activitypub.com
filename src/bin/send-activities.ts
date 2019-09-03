/**
 * Send activities to the provided URL of an ActivityPub inbox.
 * Used for testing.
 */

import * as assert from "assert";
import fetch from "node-fetch";
import { specOverSectionExampleConversation } from "../lib/activitypub-examples/activitypubSpecExamples";
import { as2ContentType, as2PublicAudienceUri } from "../lib/activitystreams2";

async function main() {
  const [...args] = process.argv.slice(2);
  const [url] = args;
  for (const activity of specOverSectionExampleConversation.map(a => ({
    ...a,
    bcc: [as2PublicAudienceUri],
  }))) {
    const response = await fetch(url, {
      body: JSON.stringify(activity, null, 2),
      headers: {
        "content-type": as2ContentType,
      },
      method: "post",
    });
    if (response.status !== 201) {
      console.warn(await response.text());
    }
    assert.equal(response.status, 201);
    console.log("sent activity", JSON.stringify(activity), "\n");
  }
}

if (require.main === module) {
  (async () => {
    await main();
  })();
}
