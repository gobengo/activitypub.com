import express from "express";

const application = express();

const port = process.env.PORT
if (!port) {
    throw new Error("PORT environment variable is not set");
}

application
  .get("/", (req, res) => {
    res.send({
      message: "Hello, World!",
    }).end();
  })
  .get('/.well-known/did.json', (req, res) => {
    res.status(200).send(JSON.stringify({
      "@context": [
        "https://www.w3.org/ns/did/v1"
      ],
      "id": process.env.APP_DID ?? "did:web:activitypub-dev.com",
      "verificationMethod": [],
      alsoKnownAs: process.env.APP_DID_ALSOKNOWNAS,
      testing: true,
    }))
  })
  .get("/random", (req, res) => {
    res.send({
      number: Math.floor(Math.random() * 100),
    });
  });

application.listen(port, () => {
  console.log(`Application listening on port ${port}`);
});
