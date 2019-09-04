import { AfterData, AfterRoot } from "@jaredpalmer/after";
import { ServerStyleSheets, ThemeProvider } from "@material-ui/styles";
import { JSDOM } from "jsdom";
import React, { Component } from "react";
import { htmlTitle } from "../../config/public";
import MaterialUiMdxProvider from "./components/MaterialUiMdxProvider";
import DOMWindowContext from "./contexts/DOMWindowContext";
import theme from "./theme";

export class Document extends Component<any, any> {
  public static async getInitialProps({ assets, data, renderPage }: any) {
    const sheets = new ServerStyleSheets();

    const page = await renderPage(
      (App: React.ComponentType<any>) => (props: any) =>
        sheets.collect(
          <DOMWindowContext.Provider value={new JSDOM().window}>
            <ThemeProvider theme={theme}>
              <MaterialUiMdxProvider>
                <App {...props} />
              </MaterialUiMdxProvider>
            </ThemeProvider>
          </DOMWindowContext.Provider>,
        ),
    );

    return { assets, data, sheets, ...page };
  }

  public render() {
    const { helmet, assets, data, sheets } = this.props; // 4) Get sheets from props

    // get attributes from React Helmet
    const htmlAttrs = helmet.htmlAttributes.toComponent();
    const bodyAttrs = helmet.bodyAttributes.toComponent();
    const assetStylesheetLink = assets && assets.client.css && (
      <link rel="stylesheet" href={assets.client.css} />
    );
    return (
      <html {...htmlAttrs}>
        <head>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta charSet="utf-8" />
          <title>{htmlTitle}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {helmet.title.toComponent()}
          {helmet.meta.toComponent()}
          {helmet.link.toComponent()}
          {assetStylesheetLink}
          <style
            type="text/css"
            dangerouslySetInnerHTML={{ __html: sheets.toString() }}
          />
        </head>
        <body {...bodyAttrs}>
          <AfterRoot />
          <AfterData data={data} />
          {Object.entries(assets || {}).map(
            ([name, asset]: [string, any]) =>
              name && (
                <script
                  key={name}
                  type="text/javascript"
                  src={asset.js}
                  defer={true}
                  crossOrigin="anonymous"
                />
              ),
          )}
        </body>
      </html>
    );
  }
}

export default Document;
