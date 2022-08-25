const { REACT_APP_EBSI_ENV } = process.env;

if (!REACT_APP_EBSI_ENV) {
  throw new Error("REACT_APP_EBSI_ENV must be defined");
}

if (
  !["local", "integration", "development", "production"].includes(
    REACT_APP_EBSI_ENV
  )
) {
  throw new Error(
    `REACT_APP_EBSI_ENV has an unknown value: ${REACT_APP_EBSI_ENV}`
  );
}

const defaultConfig = {
  local: {
    REACT_APP_WALLET_WEB_CLIENT_URL: "https://app.intebsi.xyz/wallet",
    REACT_APP_SELF_SOVEREIGN_IDENTITY_URL:
      "https://app.intebsi.xyz/demo/essif/issue-id",
    REACT_APP_DIPLOMA_BACHELOR_URL:
      "https://app.intebsi.xyz/demo/diploma/bachelor",
    REACT_APP_DIPLOMA_MASTER_URL: "https://app.intebsi.xyz/demo/diploma/master",
    REACT_APP_NOTARISATION_URL: "https://app.intebsi.xyz/demo/notarisation",
    REACT_APP_TRUSTED_DATA_SHARING_URL:
      "https://app.intebsi.xyz/demo/trusted-data-sharing",
  },
  integration: {
    REACT_APP_WALLET_WEB_CLIENT_URL: "https://app.intebsi.xyz/wallet",
    REACT_APP_SELF_SOVEREIGN_IDENTITY_URL:
      "https://app.intebsi.xyz/demo/essif/issue-id",
    REACT_APP_DIPLOMA_BACHELOR_URL:
      "https://app.intebsi.xyz/demo/diploma/bachelor",
    REACT_APP_DIPLOMA_MASTER_URL: "https://app.intebsi.xyz/demo/diploma/master",
    REACT_APP_NOTARISATION_URL: "https://app.intebsi.xyz/demo/notarisation",
    REACT_APP_TRUSTED_DATA_SHARING_URL:
      "https://app.intebsi.xyz/demo/trusted-data-sharing",
  },
  development: {
    REACT_APP_WALLET_WEB_CLIENT_URL: "https://app.ebsi.xyz/wallet",
    REACT_APP_SELF_SOVEREIGN_IDENTITY_URL:
      "https://app.ebsi.xyz/demo/essif/issue-id",
    REACT_APP_DIPLOMA_BACHELOR_URL:
      "https://app.ebsi.xyz/demo/diploma/bachelor",
    REACT_APP_DIPLOMA_MASTER_URL: "https://app.ebsi.xyz/demo/diploma/master",
    REACT_APP_NOTARISATION_URL: "https://app.ebsi.xyz/demo/notarisation",
    REACT_APP_TRUSTED_DATA_SHARING_URL:
      "https://app.ebsi.xyz/demo/trusted-data-sharing",
  },
  production: {
    REACT_APP_WALLET_WEB_CLIENT_URL: "",
    REACT_APP_SELF_SOVEREIGN_IDENTITY_URL: "",
    REACT_APP_DIPLOMA_BACHELOR_URL: "",
    REACT_APP_DIPLOMA_MASTER_URL: "",
    REACT_APP_NOTARISATION_URL: "",
    REACT_APP_TRUSTED_DATA_SHARING_URL: "",
  },
};

const config = {
  REACT_APP_EBSI_ENV,
  REACT_APP_WALLET_WEB_CLIENT_URL:
    process.env.REACT_APP_WALLET_WEB_CLIENT_URL ||
    defaultConfig[REACT_APP_EBSI_ENV].REACT_APP_WALLET_WEB_CLIENT_URL,
  REACT_APP_SELF_SOVEREIGN_IDENTITY_URL:
    process.env.REACT_APP_SELF_SOVEREIGN_IDENTITY_URL ||
    defaultConfig[REACT_APP_EBSI_ENV].REACT_APP_SELF_SOVEREIGN_IDENTITY_URL,
  REACT_APP_DIPLOMA_BACHELOR_URL:
    process.env.REACT_APP_DIPLOMA_BACHELOR_URL ||
    defaultConfig[REACT_APP_EBSI_ENV].REACT_APP_DIPLOMA_BACHELOR_URL,
  REACT_APP_DIPLOMA_MASTER_URL:
    process.env.REACT_APP_DIPLOMA_MASTER_URL ||
    defaultConfig[REACT_APP_EBSI_ENV].REACT_APP_DIPLOMA_MASTER_URL,
  REACT_APP_NOTARISATION_URL:
    process.env.REACT_APP_NOTARISATION_URL ||
    defaultConfig[REACT_APP_EBSI_ENV].REACT_APP_NOTARISATION_URL,
  REACT_APP_TRUSTED_DATA_SHARING_URL:
    process.env.REACT_APP_TRUSTED_DATA_SHARING_URL ||
    defaultConfig[REACT_APP_EBSI_ENV].REACT_APP_TRUSTED_DATA_SHARING_URL,
};

module.exports = config;
