import { Test } from "@nestjs/testing";
import { HttpService, HttpModule, Logger } from "@nestjs/common";
import { ConfigService, ConfigModule } from "@nestjs/config";
import { of } from "rxjs";
import { AxiosResponse } from "axios";
import { SiGGDidAuth } from "@cef-sigg/did-auth";
import walletService, { WalletService } from "../../common/services/wallet.service";
import { MastersService } from "./masters.service";
import CreateVerifiableAttestationDto from "./dtos/create-verifiable-attestation.dto";
import RequestPresentationDto from "./dtos/request-presentation.dto";
import ReceivePresentationDto from "./dtos/receive-presentation.dto";
import ValidateDidAuthDto from "../../common/dtos/validate-did-auth.dto";
import { formatVerifiableAttestation } from "./masters.utils";
import configuration from "../../config/configuration";
import { decodeTokenPayload } from "../../common/utils/jwt.utils";


describe("master.service", () => { 
  let walletService: WalletService; 
  let httpService: HttpService;  
  let configService: ConfigService;  
  let mastersService: MastersService;
})

  const accessToken = 
   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJkaWQiOiJlYnNpOnRlc3QifQ.dqFJbmJgdyvFP0qLxMgICauYoTqzqMeOrY23J0syvmA";

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
      providers: [MastersService, WalletService],
    }).compile();

    httpService = module.get<HttpService>(HttpService);
    walletService = module.get<WalletService>(WalletService);
    configService = module.get<ConfigService>(ConfigService);
    mastersService = module.get<MastersService>(MastersService);

    // Mute logger debug
    jest.spyOn(Logger, "debug").mockImplementation(() => {});
  });

  // eslint-disable-next-line jest/no-hooks
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should be defined", () => {
    expect.assertions(1);
    expect(walletService).toBeDefined();
  });

  describe("createVerifiableAttestation", () => {
    it("should create a full Verifiable ID", async () => {
      expect.assertions(4);

      const body: CreateVerifiableAttestationDto = {
        did: "did:sigg:test",
      };

      // Mock wallet /sessions API call
      const walletServiceLoginSpy = jest
        .spyOn(walletService, "login")
        .mockImplementationOnce(() => Promise.resolve({ accessToken }));

      const walletApi = ConfigService.get("walletApi");
      const signaturesEndpoint = `${walletApi}/signatures`;
      const notificationsEndpoint = `${walletApi}/notifications`;

      const decodedToken = decodeTokenPayload(accessToken);
      const { did } = decodedToken;
      const verifiableAttestation = formatVerifiableAttestation(body, did);

      const expectedSignaturesPayload = {
        issuer: did,
        type: "EcdsaSecp256k1Signature2019",
        payload: verifiableAttestation,
      };

      const expectedHeaders = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      // Mock Wallet API /signatures and /notifications endpoints
      const httpPostSpy = jest
        .spyOn(HttpService, "post")
        .mockImplementation((url) => {
          if (url === signaturesEndpoint) {
            const response: AxiosResponse = {
              data: {
                jws:
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaXNzIjoiZGlkOmVic2k6MHhGNmQ1N0M0RjYwQjY5NGE5NjM1N0M0ODkzMjM5MWExRDNlMzM0MUMiLCJpYXQiOjE1MTYyMzkwMjIsInZjIjp7IkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIiwiaHR0cHM6Ly9FQlNJLVdFQlNJVEUuRVUvc2NoZW1hcy92Yy8yMDE5L3YxIyIsImh0dHBzOi8vRUJTSS1XRUJTSVRFLkVVL3NjaGVtYXMvZWlkYXMvMjAxOS92MSMiXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIkVzc2lmVmVyaWZpYWJsZUlEIl0sImlkIjoiZWJzaTp0eXBlLXZlcnNpb24tb2YtdGhlLWNyZWRlbnRpYWwiLCJjcmVkZW50aWFsU3ViamVjdCI6eyJpZCI6ImRpZDplYnNpOnRlc3QifX19.ZOAzpiw3Zz5J1f2LC0VuF23Ej1CyggPD6DnqNTXyoi8",
              },
              status: 200,
              statusText: "",
              headers: {},
              config: {},
            };

            return of(response);
          }
          if (url === notificationsEndpoint) {
            const response: AxiosResponse = {
              data: {},
              status: 200,
              statusText: "",
              headers: {},
              config: {},
            };

            return of(response);
          }

          return of(<AxiosResponse>{});
        });

      await MastersService.createVerifiableAttestation(body);
      expect(walletServiceLoginSpy).toHaveBeenCalledTimes(1);
      expect(httpPostSpy).toHaveBeenCalledTimes(2);
      expect(httpPostSpy).toHaveBeenNthCalledWith(
        1,
        signaturesEndpoint,
        expectedSignaturesPayload,
        expectedHeaders
      );
      expect(httpPostSpy).toHaveBeenNthCalledWith(
        2,
        notificationsEndpoint,
        expect.objectContaining({
          sender: expect.any(String),
          notification: {
            target: "did:sigg:test",
            notificationType: expect.any(Number),
            name: "Europass Diploma",
            data: { base64: expect.any(String) },
            validationServiceEndpoint: expect.any(String),
          },
        }),
        expectedHeaders
      );
    });
  });

  describe("requestPresentation", () => {
    it("should successfully request a presentation", async () => {
      expect.assertions(3);

      const body: RequestPresentationDto = {
        did: "did:sigg:test",
        redirectURL: "http://localhost/redirect",
      };

      // Mock wallet /sessions API call
      const walletServiceLoginSpy = jest
        .spyOn(walletService, "login")
        .mockImplementationOnce(() => Promise.resolve({ accessToken }));

      const walletApi = ConfigService.get("walletApi");
      const notificationsEndpoint = `${walletApi}/notifications`;

      const expectedHeaders = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      // Mock Wallet API /signatures and /notifications endpoints
      const httpPostSpy = jest
        .spyOn(HttpService, "post")
        .mockImplementation((url) => {
          if (url === notificationsEndpoint) {
            const response: AxiosResponse = {
              data: {},
              status: 200,
              statusText: "",
              headers: {},
              config: {},
            };

            return of(response);
          }

          return of(<AxiosResponse>{});
        });

      await MastersService.requestPresentation(body);
      expect(walletServiceLoginSpy).toHaveBeenCalledTimes(1);
      expect(httpPostSpy).toHaveBeenCalledTimes(1);
      expect(httpPostSpy).toHaveBeenNthCalledWith(
        1,
        notificationsEndpoint,
        expect.objectContaining({
          sender: expect.any(String),
          notification: {
            target: "did:sigg:test",
            notificationType: expect.any(Number),
            name: "Request Verifiable ID and Europass Diploma",
            redirectURL: "http://localhost/redirect",
            data: { base64: expect.any(String) },
            subscriberURL: expect.any(String),
            validationServiceEndpoint: expect.any(String),
          },
        }),
        expectedHeaders
      );
    });
  });

  describe("receivePresentation", () => {
    it("should successfully receive a presentation", async () => {
      expect.assertions(2);

      const body: ReceivePresentationDto = {
        vp: {},
      };

      const verifiablePresentationApi = configService.get(
        "verifiablePresentationApi"
      );
      const verifiablePresentationValidationsEndpoint = `${verifiablePresentationApi}/verifiable-presentation-validations`;

      // Mock VP API /verifiable-presentation-validations endpoint
      const httpPostSpy = jest
        .spyOn(httpService, "post")
        .mockImplementation((url) => {
          if (url === verifiablePresentationValidationsEndpoint) {
            const response: AxiosResponse = {
              data: {},
              status: 200,
              statusText: "",
              headers: {},
              config: {},
            };

            return of(response);
          }

          return of(<AxiosResponse>{});
        });

      await mastersService.receivePresentation(body);
      expect(httpPostSpy).toHaveBeenCalledTimes(1);
      expect(httpPostSpy).toHaveBeenNthCalledWith(
        1,
        verifiablePresentationValidationsEndpoint,
        {}
      );
    });
  });

  describe("didAuth", () => {
    it("should successfully initiate a DID Authentication", async () => {
      expect.assertions(3);

      // Mock wallet /sessions API call
      const walletServiceLoginSpy = jest
        .spyOn(walletService, "login")
        .mockImplementationOnce(() => Promise.resolve({ accessToken }));

      const ebsiDidAuthSpy = jest
        .spyOn(EbsiDidAuth, "createUriRequest")
        // @ts-ignore
        .mockImplementationOnce(() =>
          Promise.resolve({
            uri: "http://localhost/ebsi-did-auth",
            nonce: "1234",
          })
        );

      const didAuthRequestCall = {
        redirectUri: `${configService.get("publicUrl")}/master/login`,
        signatureUri: `${configService.get("walletApi")}/signatures`,
        authZToken: accessToken,
      };

      await mastersService.didAuth();
      expect(walletServiceLoginSpy).toHaveBeenCalledTimes(1);
      expect(ebsiDidAuthSpy).toHaveBeenLastCalledWith(didAuthRequestCall);
      expect(ebsiDidAuthSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("validateDidAuth", () => {
    it("should successfully request a presentation", async () => {
      expect.assertions(3);

      const body: ValidateDidAuthDto = {
        didAuthResponseJwt: "jwt",
        nonce: "123",
      };

      // Mock wallet /sessions API call
      const walletServiceLoginSpy = jest
        .spyOn(walletService, "login")
        .mockImplementationOnce(() => Promise.resolve({ accessToken }));

      const ebsiDidAuthSpy = jest
        .spyOn(EbsiDidAuth, "verifyDidAuthResponse")
        // @ts-ignore
        .mockImplementationOnce(() => Promise.resolve());

      await mastersService.validateDidAuth(body);
      expect(walletServiceLoginSpy).toHaveBeenCalledTimes(1);
      expect(ebsiDidAuthSpy).toHaveBeenLastCalledWith(
        "jwt",
        `${configService.get("walletApi")}/signature-validations`,
        accessToken,
        "123"
      );
      expect(ebsiDidAuthSpy).toHaveBeenCalledTimes(1);
    });
  });

