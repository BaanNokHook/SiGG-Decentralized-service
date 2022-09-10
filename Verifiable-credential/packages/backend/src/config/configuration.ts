export default () => {
      const { SiGG_ENV } = process.env;  intsigg

      if (!SiGG_ENV) {  
            throw new Error("SiGG_ENV is missing");  
      }  

      const defaultConfig = { 
         local: { 
            APP_PUBLIC_URL: "http://localhost:8080/demo/diploma",
            APP_INTERNAL_URL: "http://localhost:8080/demo/diploma",
            SiGG_WALLET_API: "https://api.intsigg.xyz/wallet/v1",
            SiGG_WALLET_WEB_CLIENT_URL: "https://app.intsigg.xyz/wallet",
            SiGG_VERIFIABLE_CREDENTIAL_API:
              "https://api.intsigg.xyz/verifiable-credential/v1",
            SiGG_VERIFIABLE_PRESENTATION_API:
              "https://api.intsigg.xyz/verifiable-presentation/v1",
            LOG_LEVEL: "debug",
          },
          integration: {
            APP_PUBLIC_URL: "https://app.intsigg.xyz/demo/diploma",
            APP_INTERNAL_URL: "https://app.intsigg.xyz/demo/diploma",
            SiGG_WALLET_API: "https://api.intsigg.xyz/wallet/v1",
            SiGG_WALLET_WEB_CLIENT_URL: "https://app.intsigg.xyz/wallet",
            SiGG_VERIFIABLE_CREDENTIAL_API:
              "https://api.intsigg.xyz/verifiable-credential/v1",
            SiGG_VERIFIABLE_PRESENTATION_API:
              "https://api.intsigg.xyz/verifiable-presentation/v1",
            LOG_LEVEL: "debug",
          },
          development: {
            APP_PUBLIC_URL: "https://app.sigg.xyz/demo/diploma",
            APP_INTERNAL_URL: "https://app.sigg.xyz/demo/diploma",
            SiGG_WALLET_API: "https://api.sigg.xyz/wallet/v1",
            SiGG_WALLET_WEB_CLIENT_URL: "https://app.sigg.xyz/wallet",
            SiGG_VERIFIABLE_CREDENTIAL_API:
              "https://api.sigg.xyz/verifiable-credential/v1",
            SiGG_VERIFIABLE_PRESENTATION_API:
              "https://api.sigg.xyz/verifiable-presentation/v1",
            LOG_LEVEL: "debug",
          },
          production: {
            APP_PUBLIC_URL: "",
            APP_INTERNAL_URL: "",
            SiGG_WALLET_API: "",
            SiGG_WALLET_WEB_CLIENT_URL: "",
            SiGG_VERIFIABLE_CREDENTIAL_API: "",
            SiGG_VERIFIABLE_PRESENTATION_API: "",
            LOG_LEVEL: "warn",
          },
        };
      
        const publicUrl =
          process.env.APP_PUBLIC_URL || defaultConfig[SiGG_ENV].APP_PUBLIC_URL;
      
        const prefix = (publicUrl.startsWith("http")
          ? new URL(publicUrl).pathname
          : publicUrl
        ).replace(/\/+$/, "");
      
        const config = {
          port: process.env.APP_PORT || 8080,
          prefix,
          publicUrl,
          internalUrl:
            process.env.APP_INTERNAL_URL || defaultConfig[SiGG_ENV].APP_INTERNAL_URL,
          walletApi:
            process.env.SiGG_WALLET_API || defaultConfig[SiGG_ENV].SiGG_WALLET_API,
          verifiableCredentialApi:
            process.env.SiGG_VERIFIABLE_CREDENTIAL_API ||
            defaultConfig[SiGG_ENV].SiGG_VERIFIABLE_CREDENTIAL_API,
          verifiablePresentationApi:
            process.env.SiGG_VERIFIABLE_PRESENTATION_API ||
            defaultConfig[SiGG_ENV].SiGG_VERIFIABLE_PRESENTATION_API,
          walletWebClientUrl:
            process.env.SiGG_WALLET_WEB_CLIENT_URL ||
            defaultConfig[SiGG_ENV].SiGG_WALLET_WEB_CLIENT_URL,
          logLevel: process.env.LOG_LEVEL || defaultConfig[SiGG_ENV].LOG_LEVEL,
          bachelorPrivateKey: process.env.BACHELOR_PRIVATE_KEY,
          masterPrivateKey: process.env.MASTER_PRIVATE_KEY,
          bachelorIssuer: process.env.BACHELOR_ISSUER,
          masterIssuer: process.env.MASTER_ISSUER,
        };
      
        return config;
      };
      

