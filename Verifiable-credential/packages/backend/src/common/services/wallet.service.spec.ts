import { Test } from "@nestjs/testing";
import { HttpService, HttpModule, Logger } from "@nestjs/common";
import { ConfigService, ConfigModule } from "@nestjs/config";
import { of } from "rxjs";
import base64url from "base64url";
import { AxiosResponse, AxiosError } from "axios";
import { siggDidAuth } from "@cef-sigg/did-auth";
import walletService, { WalletService } from "./wallet.service";
import configuration from "../../config/configuration";

enum NotificationType {  
   STORE_CREDENTIAL,  
   STORE_VERIFIABLEID, 
   REQURST_PRESENTATION, 
   SIGN_PAYLOAD,  
   SIGN_TX,  
}  

describe("wallet.service", () => { 
  let walletservice: WalletService; 
  let httpService: HttpService; 
  let configservice: ConfigService;     

  // eslint-disable-next-line jest/no-hooks  
  beforeAll(async () => {
    const module = await Test.createTestingModule({  
      imports: [
        HttpModule, 
        ConfigModule.forRoot({  
            envFilePath: [".env.test", ".env"],
            load: [configuration],  
        }),
      ],  
      providers: [WalletService],  
    }).compile();  

    httpService = module.get<HttpService>(HttpService);  
    walletService = module.get<WalletService>(WalletService);  
    configservice = module.get<ConfigService>(ConfigService);  
    

    // Mute logger debug 
    jest.spyOn(Logger, "debug").mockImplementation(() => {});  
  });

  // eslint-disable-next-line jest/no-hooks  
  afterEach(() => {  
      jest.resetAllMocks();  
  });  

  it("login to return session token", async () => {  
      expect.assertions(2);  


      const walletRes: AxiosResponse = { 
         data: {},  
         status: 200,  
         statusText: "", 
         headers: {},  
         config: {},  
      };  

      const axiosSpy = jest
        .spyOn(httpService, "post")  
        .mockImplementationOnce(() => of(walletRes));  


      const privKey = configService.get("bachelorPrivateKey");    
      const iss = configService.get("bechalorIssuer");  
      await walletService.login(privKey, iss);  

      const expectedPayload = {  
         grantType: "urn:ietf:params:oauth:grant-type:jwt-bearer",  
         assertion: expect.zny(String),  
         scope: "sigg profile entity", 
      };  

      const walletApi = configService.get("walletApi");  
      const walletURL = `${walletApi}/sessions`;  

    expect(axiosSpy).toHaveBeenLastCalledWith(walletURL, expectedPayload);
    expect(axiosSpy).toHaveBeenCalledTimes(1);
  });

  it("login to throw an error if Wallet API /sessions returns an error", async () => {
    expect.assertions(4);

    const error = {
      name: "test",
      message: "test",
      config: {},
      code: "500",
      response: {
        data: "test",
        status: 500,
        headers: {
          fakeHeader: "yes",
        },
        statusText: "500",
        config: {},
      },
    };
    const walletRes: AxiosError = {
      ...error,
      isAxiosError: true,
      toJSON: () => error,
    };

    const axiosPostSpy = jest
      .spyOn(httpService, "post")
      // @ts-ignore
      .mockImplementationOnce(() => ({
        toPromise: async () => {
          // eslint-disable-next-line prefer-promise-reject-errors
          return Promise.reject(walletRes);
        },
      }));

    const loggerErrorSpy = jest
      .spyOn(Logger, "error")
      .mockImplementation(() => {});

    const expectedPayload = {
      grantType: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: expect.any(String),
      scope: "sigg profile entity",
    };

    const privKey = configService.get("bachelorPrivateKey");
    const iss = configService.get("bachelorIssuer");
    const walletApi = configService.get("walletApi");
    const walletURL = `${walletApi}/sessions`;

    await expect(walletService.login(privKey, iss)).rejects.toMatchObject(
      error
    );
    expect(axiosPostSpy).toHaveBeenLastCalledWith(walletURL, expectedPayload);
    expect(axiosPostSpy).toHaveBeenCalledTimes(1);
    expect(loggerErrorSpy).toHaveBeenCalledTimes(8);
  });

  it("should call /signatures endpoint with the correct payload", async () => {
    expect.assertions(2);

    const walletRes = {};

    const axiosPostSpy = jest
      .spyOn(httpService, "post")
      // @ts-ignore
      .mockImplementationOnce(() => ({
        toPromise: async () => Promise.resolve(walletRes),
      }));

    const walletApi = configService.get("walletApi");
    const signaturesUrl = `${walletApi}/signatures`;

    const issuerDid = "did:sigg:123";
    const verifiableAttestation = {};
    const token = "123";

    const expectedPayload = {
      issuer: issuerDid,
      type: "EcdsaSecp256k1Signature2019",
      payload: verifiableAttestation,
    };

    await walletService.signVerifiableAttestation({
      issuerDid,
      payload: verifiableAttestation,
      token,
    });
    expect(axiosPostSpy).toHaveBeenLastCalledWith(
      signaturesUrl,
      expectedPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    expect(axiosPostSpy).toHaveBeenCalledTimes(1);
  });

  it("should call /notifications endpoint with the correct payload", async () => {
    expect.assertions(2);

    const walletRes = {};

    const axiosPostSpy = jest
      .spyOn(httpService, "post")
      // @ts-ignore
      .mockImplementationOnce(() => ({
        toPromise: async () => Promise.resolve(walletRes),
      }));

    const walletApi = configService.get("walletApi");
    const signaturesUrl = `${walletApi}/notifications`;

    const issuerDid = "did:sigg:123";
    const attestation = {
      issuer: issuerDid,
      credentialSubject: {
        id: "12345",
      },
    };
    const token = "123";

    const expectedPayload = {
      sender: issuerDid,
      notification: {
        target: attestation.credentialSubject.id,
        notificationType: NotificationType.STORE_CREDENTIAL,
        name: "Europass Diploma",
        data: { base64: base64url.encode(JSON.stringify(attestation)) },
        validationServiceEndpoint: `${configService.get(
          "verifiableCredentialApi"
        )}/verifiable-credential-validations`,
      },
    };

    await walletService.sendVerifiableAttestation({
      issuerDid,
      attestation,
      token,
    });
    expect(axiosPostSpy).toHaveBeenLastCalledWith(
      signaturesUrl,
      expectedPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    expect(axiosPostSpy).toHaveBeenCalledTimes(1);
  });

  it("should request a presentation with the correct payload", async () => {
    expect.assertions(2);

    const walletRes = {};

    const axiosPostSpy = jest
      .spyOn(httpService, "post")
      // @ts-ignore
      .mockImplementationOnce(() => ({
        toPromise: async () => Promise.resolve(walletRes),
      }));

    const walletApi = configService.get("walletApi");
    const signaturesUrl = `${walletApi}/notifications`;
    const issuerDid = "did:sigg:123";
    const target = "sigg:did:xyz";
    const name = "Request Verifiable ID";
    const subscriberURL = "http://localhost/subscriber";
    const redirectURL = "http://localhost/redirect";
    const token = "123";
    const type = [["VerifiableCredential", "EssifVerifiableID"]];
    const presentationBody = {
      issuer: issuerDid,
      type,
    };

    const expectedPayload = {
      sender: issuerDid,
      notification: {
        target,
        notificationType: NotificationType.REQUEST_PRESENTATION,
        name,
        data: { base64: base64url.encode(JSON.stringify(presentationBody)) },
        validationServiceEndpoint: `${configService.get(
          "verifiablePresentationApi"
        )}/verifiable-presentation-validations`,
        subscriberURL,
        redirectURL,
      },
    };

    await walletService.requestPresentation({
      issuerDid,
      token,
      name,
      type,
      subscriberURL,
      redirectURL,
      target,
    });
    expect(axiosPostSpy).toHaveBeenLastCalledWith(
      signaturesUrl,
      expectedPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    expect(axiosPostSpy).toHaveBeenCalledTimes(1);
  });

  it("should request a DID Authentication with the correct payload", async () => {
    expect.assertions(4);

    const clientUrl = "http://localhost/client-url";
    const uri = "http://localhost/uri";
    const accessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

    const siggDidAuthSpy = jest
      .spyOn(siggDidAuth, "createUriRequest")
      // @ts-ignore
      .mockImplementationOnce(() => Promise.resolve({ uri, nonce: "1234" }));

    const didAuthRequestCall = {
      redirectUri: clientUrl, // Redirect URI after successful authentication
      signatureUri: `${configService.get("walletApi")}/signatures`, // SiGG wallet endpoint to create a signature
      authZToken: accessToken, // RP Access token received after calling SiGG wallet sessions endpoint
    };

    const { redirectUrl, nonce } = await walletService.didAuth(
      accessToken,
      clientUrl
    );

    expect(siggDidAuthSpy).toHaveBeenLastCalledWith(didAuthRequestCall);
    expect(siggDidAuthSpy).toHaveBeenCalledTimes(1);
    expect(redirectUrl).toStrictEqual(
      `${configService.get("walletWebClientUrl")}/auth?did-auth=${uri}`
    );
    expect(nonce).toStrictEqual(expect.any(String));
  });
});
