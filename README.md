# ActivityPub.com

Website that powers [ActivityPub.com](https://activitypub.com).
* Written in TypeScript
* Using koa, React, material-ui, razzle

It includes a bit of ActivityPub-protocol functionality:
* Actor response: URLs not required to do other stuff will respond to application/ld+json requests indicating that they have an as:inbox
* Inbox: other ActivityPub servers should be able to deliver objects whose audience includes a URL at https://activitypub.com/ to https://activitypub.com/api/activitypub/inbox
  * You can also make a WebSocket connection to /api/activitypub/inbox to subscribe to real-time updates of things being delivered
* More soon
  * To interop with Mastodon, some things are required on top of ActivityPub
    * HTTP Signatures
    * Webfinger
  * Possible Mastodon interop stories
    * Allow remote ActivityPub actors to follow the ActivityPub.com inbox (or derrived Collection) such that it appears in their Mastodon feed. Kind of like an aggregator account of ActivityPub-related discussion.
    * Support ActivityPub.com actor URLs sending follows to external Actors. This would allow a demo of posting something in e.g. Mastodon and having it be delivered to ActivityPub.com for display.

## Developing

`npm start` will run razzle, which will run src/client and src/server through webpack, then run them with a file watcher to recompile on updates. It listens on process.env.PORT or defaults to 3000.

`npm test` runs some tests.

`npm run build` will compile everything with webpack and output to `./build/`. `npm run start:prod` will run that built artifact.

The Dockerfile works and build the image used in production at activitypub.com.

You can send some example activities into the inbox when developing with. `./node_modules/.bin/ts-node src/bin/send-activities https://localhost:3000/api/activitypub/inbox`.

### Modules

* src/client.ts: is the entrypoint that runs in the browser
  * src/lib/react-app: Has stuff for the frontend UI
    * src/lib/react-app/pages: Components for each page
    * src/lib/react-app/routes: URL Routes for UI
* src/lib/server: koa ActivityPub implementation. This should be broken up into some smaller modules. It also includes a [ws](https://github.com/websockets/ws).Server that implements the WebSocket connection handling.
  * src/lib/server.test.ts: Some tests that should pass on any changes (`npm test` runs them)
* src/lib/activitystreams2-react: Potentially reusable React components for other ActivityPub apps
* src/lib/activitystreams2-io-ts: [io-ts](https://github.com/gcanti/io-ts)-defined types for some ActivityStreams shapes. Can be used as static TypeScript types but also at runtime to validate incoming JSON.

## Contributing

Please file issues to suggest improvements you'd find useful, or try to add them and make a PR.
