import { After, ensureReady } from "@jaredpalmer/after";
import { ThemeProvider } from "@material-ui/styles";
import React from "react";
import { hydrate } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import MaterialUiMdxProvider from "./App/components/MaterialUiMdxProvider";
import routes from "./App/routes";
import theme from "./App/theme";

ensureReady(routes).then(data => {
  hydrate(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <MaterialUiMdxProvider>
          <After data={data} routes={routes} />
        </MaterialUiMdxProvider>
      </ThemeProvider>
    </BrowserRouter>,
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

if (module.hot) {
  module.hot.accept();
}
