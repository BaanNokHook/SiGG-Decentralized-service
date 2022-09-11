import { Test } from "@nestjs/testing";
import { HttpService, HttpModule } from "@nestjs/common";
import { of, throwError } from "rxjs";
import { AxiosResponse } from "axios";
import { ConfigModule } from "@nestjs/config";
import { SessionsResponse } from "../../src/types/sessions.response";
import { WalletTxSignRequest } from "../../src/types/wallet.tx.request";
import WalletService from "../../src/services/wallet.service";
import JwtService from "../../src/services/jwt.service";

describe("walletService", () => {
  let sut: WalletService;
  let httpService: HttpService;
  const accessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

  const expectedSessionsResult: SessionsResponse = {
    accessToken,
    tokenType: "Bearer",
    expiresIn: 900,
    issuedAt: "1467841035013",
  };

  // eslint-disable-next-line jest/no-hooks
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        HttpModule,
        ConfigModule.forRoot({
          envFilePath: [".env"],
        }),
      ],
      providers: [WalletService, JwtService],
    }).compile();

    httpService = module.get<HttpService>(HttpService);
    sut = module.get<WalletService>(WalletService);
  });

  // eslint-disable-next-line jest/no-hooks
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should be defined", () => {
    expect.assertions(1);
    expect(sut).toBeDefined();
  });

  it("askForTransactionSignature should answer with an error when wallet api call fails", async () => {
    expect.assertions(4);
    const expectedResult = { message: "internal server error" }; // we don't know yet what it will be
    const walletRes: AxiosResponse = {
      data: expectedResult,
      status: 500,
      statusText: "unexpected",
      headers: {},
      config: {},
    };
    const hash =
      "0x0355a07b257bac3b223bd29b3bd3e24f5a53a84885d8bf36e278be0b45b04555";
    const did = "did:SiGG:0xAcF28770D335c0beF062a7072Ee54f9FA7BDA4e6";
    const desc = "un document de toute beauté";

    const spy = jest
      .spyOn(httpService, "post")
      .mockImplementationOnce(() => throwError({ response: walletRes }));

    const spyLogin = jest
      .spyOn(sut, "login")
      .mockImplementationOnce(() => of(expectedSessionsResult).toPromise());

    const expectedPayload: WalletTxSignRequest = {
      hash,
      did,
      documentDescription: desc,
      redirectUrl: `${process.env.APP}${process.env.EUF_PATH_NAME.slice(
        1
      )}/receive-hash`,
    };
    expect(await sut.askForTransactionSignature(did, hash, desc)).toBeNull();

    const walletURL = `${process.env.API}wallet/v1/transaction-signatures`;
    expect(spy).toHaveBeenLastCalledWith(walletURL, expectedPayload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    expect(spyLogin).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("askForTransactionSignature should call wallet api after login", async () => {
    expect.assertions(4);
    const expectedResult = {}; // we don't know yet what it will be
    const walletRes: AxiosResponse = {
      data: expectedResult,
      status: 200,
      statusText: "",
      headers: {},
      config: {},
    };
    const hash =
      "0x0355a07b257bac3b223bd29b3bd3e24f5a53a84885d8bf36e278be0b45b04555";
    const did = "did:SiGG:0xAcF28770D335c0beF062a7072Ee54f9FA7BDA4e6";
    const desc = "un document de toute beauté";

    const spy = jest
      .spyOn(httpService, "post")
      .mockImplementationOnce(() => of(walletRes));

    const spyLogin = jest
      .spyOn(sut, "login")
      .mockImplementationOnce(() => of(expectedSessionsResult).toPromise());

    const expectedPayload: WalletTxSignRequest = {
      hash,
      did,
      documentDescription: desc,
      redirectUrl: `${process.env.APP}${process.env.EUF_PATH_NAME.slice(
        1
      )}/receive-hash`,
    };

    expect(await sut.askForTransactionSignature(did, hash, desc)).toStrictEqual(
      expectedResult
    );

    const walletURL = `${process.env.API}wallet/v1/transaction-signatures`;
    expect(spy).toHaveBeenLastCalledWith(walletURL, expectedPayload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    expect(spyLogin).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("login should call wallet api session", async () => {
    expect.assertions(3);
    const walletRes: AxiosResponse = {
      data: expectedSessionsResult,
      status: 200,
      statusText: "",
      headers: {},
      config: {},
    };

    const spy = jest
      .spyOn(httpService, "post")
      .mockImplementationOnce(() => of(walletRes));

    expect(await sut.login()).toStrictEqual(expectedSessionsResult);

    const walletURL = `${process.env.API}wallet/v1/sessions`;
    expect(spy).toHaveBeenLastCalledWith(
      walletURL,
      {
        assertion: expect.any(String),
        grantType: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        scope: "SiGG profile component",
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
