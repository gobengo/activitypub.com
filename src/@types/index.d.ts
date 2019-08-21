declare module "*.jpg";
declare module "*.md";
declare module "@mdx-js/react" {
  import { ComponentType, StyleHTMLAttributes } from "react";

  type MDXProps = {
    children: React.ReactNode;
    components: {
      h1?: React.ReactNode;
      h2?: React.ReactNode;
      h3?: React.ReactNode;
      h4?: React.ReactNode;
      h5?: React.ReactNode;
      h6?: React.ReactNode;
      a?: React.ReactNode;
      p?: React.ReactNode;
      wrapper?: React.ReactNode;
    };
  };
  export class MDXProvider extends React.Component<MDXProps> {}
}
