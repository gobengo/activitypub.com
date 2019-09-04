import { After, ensureReady } from "@jaredpalmer/after";
import { ThemeProvider } from "@material-ui/styles";
import * as React from "react";
import { hydrate } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import MaterialUiMdxProvider from "./components/MaterialUiMdxProvider";
import DOMWindowContext from "./contexts/DOMWindowContext";
import routes from "./routes";
import theme from "./theme";

async function main() {
  const ClientComponent = (props: { children?: React.ReactNode }) => {
    return (
      <DOMWindowContext.Provider value={(global as any).window}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <MaterialUiMdxProvider>{props.children}</MaterialUiMdxProvider>
          </ThemeProvider>
        </BrowserRouter>
      </DOMWindowContext.Provider>
    );
  };
  await ensureReady(routes).then(data => {
    hydrate(
      <ClientComponent>
        <After data={data} routes={routes} />
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
  });
}

export default main;

if (module.hot) {
  module.hot.accept();
}
