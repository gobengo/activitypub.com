import { After, ensureReady } from "@jaredpalmer/after";
import { ThemeProvider } from "@material-ui/styles";
import * as React from "react";
import { hydrate } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import MaterialUiMdxProvider from "./components/MaterialUiMdxProvider";
import DOMWindowContext from "./contexts/DOMWindowContext";
import ConfigContext, {
  IPublicConfig,
  queryDocumentForPublicConfigSsrData,
} from "./contexts/PublicConfigContext";
import routes from "./routes";
import theme from "./theme";

async function main() {
  const ClientComponent = (props: {
    children?: React.ReactNode;
    publicConfig: IPublicConfig;
  }) => {
    return (
      <ConfigContext.Provider value={props.publicConfig}>
        <DOMWindowContext.Provider value={(global as any).window}>
          <BrowserRouter>
            <ThemeProvider theme={theme}>
              <MaterialUiMdxProvider>{props.children}</MaterialUiMdxProvider>
            </ThemeProvider>
          </BrowserRouter>
        </DOMWindowContext.Provider>
      </ConfigContext.Provider>
    );
  };
  const afterData = await ensureReady(routes);
  const publicConfig = queryDocumentForPublicConfigSsrData(document);
  await hydrate(
    <ClientComponent publicConfig={publicConfig}>
      <After data={afterData} routes={routes} />
    </ClientComponent>,
    document.getElementById("root"),
    () => {
      // [ReHydratation](https://github.com/cssinjs/jss/blob/master/docs/ssr.md)
      const jssStyles = document.getElementById("jss-ssr");
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }
    },
  );
}

export default main;

if (module.hot) {
  module.hot.accept();
}
