import { createContext } from "react";

const defaultConfig = {
  streamPathname: "/api/stream",
};

const ConfigContext = createContext(defaultConfig);

export default ConfigContext;
