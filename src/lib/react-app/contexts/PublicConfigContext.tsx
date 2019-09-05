import React, { createContext } from "react";

export interface IPublicConfig {
  distbinUrl: string;
  streamPathname: string;
}

export const defaultPublicConfig: IPublicConfig = {
  distbinUrl: process.env.DISTBIN_URL || "https://distbin.com",
  streamPathname: "/api/stream",
};

const PublicConfigContext = createContext<IPublicConfig>(defaultPublicConfig);

export default PublicConfigContext;

const publicConfigSsrDataId = "public-config";

export const PublicConfigSsrData = (props: { value: IPublicConfig }) => {
  return (
    <script
      id={publicConfigSsrDataId}
      type="application/json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(props.value),
      }}
    />
  );
};

export const queryDocumentForPublicConfigSsrData = (
  document: Document,
): IPublicConfig => {
  const script = document.querySelector(`#${publicConfigSsrDataId}`);
  if (!script) {
    throw new Error("Failed to find public config ssr data");
  }
  const parsed = JSON.parse(script.innerHTML);
  return parsed;
};
