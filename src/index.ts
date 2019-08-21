import http from "http";
import { IServerModule, ServerModule } from "./lib/server/server";

let currentServerModule: IServerModule = ServerModule();
const server = http.createServer();
currentServerModule.install(server);

server.listen(process.env.PORT || 3000, () => {
  console.log("🚀 started");
});

if (module.hot) {
  console.log("✅  Server-side HMR Enabled!");
  module.hot.accept(["./lib/server/server"], () => {
    console.log("🔁  HMR Reloading `./server`...");
    try {
      const newServerModule: IServerModule = require("./lib/server/server").ServerModule();
      currentServerModule.uninstall(server);
      newServerModule.install(server);
      currentServerModule = newServerModule;
    } catch (error) {
      console.error(error);
    }
  });
}
