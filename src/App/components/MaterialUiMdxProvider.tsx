import Link from "@material-ui/core/Link";
import { createMuiTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { MDXProvider } from "@mdx-js/react";
import React, { useContext } from "react";
// import CodeBlock from "./CodeBlock";

export const createMuiComponentsForMdx = (headersStartAt: number) => {
  const h = (hNumIn: number) => {
    let hNum = headersStartAt - 1 + hNumIn;
    if (hNum > 6) {
      hNum = 6;
    }
    const hString = `h${hNum}`;
    return hString;
  };
  return {
    a: Link,
    h1: (props: any) => <Typography variant={h(1)} {...props} />,
    h2: (props: any) => <Typography variant={h(2)} {...props} />,
    h3: (props: any) => <Typography variant={h(3)} {...props} />,
    h4: (props: any) => <Typography variant={h(4)} {...props} />,
    h5: (props: any) => <Typography variant={h(5)} {...props} />,
    h6: (props: any) => <Typography variant={h(6)} {...props} />,
    p: (props: any) => <Typography paragraph {...props} />,
    // pre: props => <div {...props} />,
    // code: CodeBlock,
  };
};

const defaultMuiComponentsForMdx = createMuiComponentsForMdx(3);

const MaterialUiMdxProvider: React.FunctionComponent = ({ children }) => {
  return (
    <MDXProvider components={defaultMuiComponentsForMdx}>
      {children}
    </MDXProvider>
  );
};
export default MaterialUiMdxProvider;
