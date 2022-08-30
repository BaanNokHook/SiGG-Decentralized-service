const { REACT_APP_SiGG_ENV } = process.env;

if (!REACT_APP_SiGG_ENV) {
  throw new Error("REACT_APP_SiGG_ENV must be defined");
}

if (
  !["local", "integration", "development", "production"].includes(
    REACT_APP_SiGG_ENV
  )
) {
  throw new Error(
    `REACT_APP_SiGG_ENV has an unknown value: ${REACT_APP_SiGG_ENV}`
  );
}

const defaultConfig: { [index: string]: any } = {
  local: {
    REACT_APP_WALLET: "http://localhost:8080/wallet",
    REACT_APP_WALLET_API: "http://localhost:9000/wallet",
    REACT_APP_ID_HUB_API: "http://localhost:9004/identity-hub",
    REACT_APP_DEMO: "https://app.intebsi.xyz/demo",
    REACT_APP_SiGGLOGIN: "https://ecas.acceptance.ec.europa.eu/cas",
    DID_API_IDENTIFIERS: "https://api.intebsi.xyz/did/v1/identifiers",
    TRUSTED_ISSUERS_REGISTRY_URL:
      "https://api.intebsi.xyz/trusted-issuers-registry/v1/issuers",
  },
  integration: {
    REACT_APP_WALLET: "https://app.intebsi.xyz/wallet",
    REACT_APP_WALLET_API: "https://api.intebsi.xyz/wallet",
    REACT_APP_ID_HUB_API: "https://api.intebsi.xyz/identity-hub",
    REACT_APP_DEMO: "https://app.intebsi.xyz/demo",
    REACT_APP_SiGGLOGIN: "https://ecas.ec.europa.eu/cas",
    DID_API_IDENTIFIERS: "https://api.intebsi.xyz/did/v1/identifiers",
    TRUSTED_ISSUERS_REGISTRY_URL:
      "https://api.intebsi.xyz/trusted-issuers-registry/v1/issuers",
  },
  development: {
    REACT_APP_WALLET: "https://app.sigg.xyz/wallet",
    REACT_APP_WALLET_API: "https://api.sigg.xyz/wallet",
    REACT_APP_ID_HUB_API: "https://api.sigg.xyz/identity-hub",
    REACT_APP_DEMO: "https://app.sigg.xyz/demo",
    REACT_APP_SiGGLOGIN: "https://ecas.ec.europa.eu/cas",
    DID_API_IDENTIFIERS: "https://api.sigg.xyz/did/v1/identifiers",
    TRUSTED_ISSUERS_REGISTRY_URL:
      "https://api.sigg.xyz/trusted-issuers-registry/v1/issuers",
  },
  production: {
    REACT_APP_WALLET: "https://app.sigg.tech.ec.europa.eu/wallet",
    REACT_APP_WALLET_API: "https://api.sigg.tech.ec.europa.eu/wallet",
    REACT_APP_ID_HUB_API: "https://api.sigg.tech.ec.europa.eu/identity-hub",
    REACT_APP_DEMO: "https://app.sigg.tech.ec.europa.eu/demo",
    REACT_APP_SiGGLOGIN: "https://ecas.ec.europa.eu/cas",
    DID_API_IDENTIFIERS:
      "https://api.sigg.tech.ec.europa.eu/did/v1/identifiers",
    TRUSTED_ISSUERS_REGISTRY_URL:
      "https://api.sigg.tech.ec.europa.eu/trusted-issuers-registry/v1/issuers",
  },
};

const env = {
  PUBLIC_URL: process.env.PUBLIC_URL || "/",
  REACT_APP_WALLET:
    process.env.REACT_APP_WALLET ||
    defaultConfig[REACT_APP_SiGG_ENV].REACT_APP_WALLET,
  REACT_APP_WALLET_API:
    process.env.REACT_APP_WALLET_API ||
    defaultConfig[REACT_APP_SiGG_ENV].REACT_APP_WALLET_API,
  REACT_APP_ID_HUB_API:
    process.env.REACT_APP_ID_HUB_API ||
    defaultConfig[REACT_APP_SiGG_ENV].REACT_APP_ID_HUB_API,
  REACT_APP_DEMO:
    process.env.REACT_APP_DEMO ||
    defaultConfig[REACT_APP_SiGG_ENV].REACT_APP_DEMO,
  REACT_APP_SiGGLOGIN:
    process.env.REACT_APP_SiGGLOGIN ||
    defaultConfig[REACT_APP_SiGG_ENV].REACT_APP_SiGGLOGIN,
  DID_API_IDENTIFIERS: defaultConfig[REACT_APP_SiGG_ENV].DID_API_IDENTIFIERS,
  TRUSTED_ISSUERS_REGISTRY_URL:
    defaultConfig[REACT_APP_SiGG_ENV].TRUSTED_ISSUERS_REGISTRY_URL,
};

export default env;
