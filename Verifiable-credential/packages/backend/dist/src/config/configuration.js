"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => {
    const { EBSI_ENV } = process.env;
    if (!EBSI_ENV) {
        throw new Error("EBSI_ENV is missing");
    }
    const defaultConfig = {
        local: {
            APP_PUBLIC_URL: "http://localhost:8080/demo/diploma",
            APP_INTERNAL_URL: "http://localhost:8080/demo/diploma",
            EBSI_WALLET_API: "https://api.intebsi.xyz/wallet/v1",
            EBSI_WALLET_WEB_CLIENT_URL: "https://app.intebsi.xyz/wallet",
            EBSI_VERIFIABLE_CREDENTIAL_API: "https://api.intebsi.xyz/verifiable-credential/v1",
            EBSI_VERIFIABLE_PRESENTATION_API: "https://api.intebsi.xyz/verifiable-presentation/v1",
            LOG_LEVEL: "debug",
        },
        integration: {
            APP_PUBLIC_URL: "https://app.intebsi.xyz/demo/diploma",
            APP_INTERNAL_URL: "https://app.intebsi.xyz/demo/diploma",
            EBSI_WALLET_API: "https://api.intebsi.xyz/wallet/v1",
            EBSI_WALLET_WEB_CLIENT_URL: "https://app.intebsi.xyz/wallet",
            EBSI_VERIFIABLE_CREDENTIAL_API: "https://api.intebsi.xyz/verifiable-credential/v1",
            EBSI_VERIFIABLE_PRESENTATION_API: "https://api.intebsi.xyz/verifiable-presentation/v1",
            LOG_LEVEL: "debug",
        },
        development: {
            APP_PUBLIC_URL: "https://app.ebsi.xyz/demo/diploma",
            APP_INTERNAL_URL: "https://app.ebsi.xyz/demo/diploma",
            EBSI_WALLET_API: "https://api.ebsi.xyz/wallet/v1",
            EBSI_WALLET_WEB_CLIENT_URL: "https://app.ebsi.xyz/wallet",
            EBSI_VERIFIABLE_CREDENTIAL_API: "https://api.ebsi.xyz/verifiable-credential/v1",
            EBSI_VERIFIABLE_PRESENTATION_API: "https://api.ebsi.xyz/verifiable-presentation/v1",
            LOG_LEVEL: "debug",
        },
        production: {
            APP_PUBLIC_URL: "",
            APP_INTERNAL_URL: "",
            EBSI_WALLET_API: "",
            EBSI_WALLET_WEB_CLIENT_URL: "",
            EBSI_VERIFIABLE_CREDENTIAL_API: "",
            EBSI_VERIFIABLE_PRESENTATION_API: "",
            LOG_LEVEL: "warn",
        },
    };
    const publicUrl = process.env.APP_PUBLIC_URL || defaultConfig[EBSI_ENV].APP_PUBLIC_URL;
    const prefix = (publicUrl.startsWith("http")
        ? new URL(publicUrl).pathname
        : publicUrl).replace(/\/+$/, "");
    const config = {
        port: process.env.APP_PORT || 8080,
        prefix,
        publicUrl,
        internalUrl: process.env.APP_INTERNAL_URL || defaultConfig[EBSI_ENV].APP_INTERNAL_URL,
        walletApi: process.env.EBSI_WALLET_API || defaultConfig[EBSI_ENV].EBSI_WALLET_API,
        verifiableCredentialApi: process.env.EBSI_VERIFIABLE_CREDENTIAL_API ||
            defaultConfig[EBSI_ENV].EBSI_VERIFIABLE_CREDENTIAL_API,
        verifiablePresentationApi: process.env.EBSI_VERIFIABLE_PRESENTATION_API ||
            defaultConfig[EBSI_ENV].EBSI_VERIFIABLE_PRESENTATION_API,
        walletWebClientUrl: process.env.EBSI_WALLET_WEB_CLIENT_URL ||
            defaultConfig[EBSI_ENV].EBSI_WALLET_WEB_CLIENT_URL,
        logLevel: process.env.LOG_LEVEL || defaultConfig[EBSI_ENV].LOG_LEVEL,
        bachelorPrivateKey: process.env.BACHELOR_PRIVATE_KEY,
        masterPrivateKey: process.env.MASTER_PRIVATE_KEY,
        bachelorIssuer: process.env.BACHELOR_ISSUER,
        masterIssuer: process.env.MASTER_ISSUER,
    };
    return config;
};
//# sourceMappingURL=configuration.js.map