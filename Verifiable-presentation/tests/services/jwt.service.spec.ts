import { Test } from "@nestjs/testing";
import { JWT } from "jose";
import { ConfigModule } from "@nestjs/config";
import {
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common/exceptions";
import { utils } from "@cef-SiGG/app-jwt";
import JwtService from "../../src/services/jwt.service";

describe("jwtService", () => {
  let sut: JwtService;

  // eslint-disable-next-line jest/no-hooks
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: [".env"],
        }),
      ],
      providers: [JwtService],
    }).compile();

    sut = module.get<JwtService>(JwtService);
  });

  // eslint-disable-next-line jest/no-hooks
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should be defined", () => {
    expect.assertions(1);
    expect(sut).toBeDefined();
  });

  it("extractPayloadFromToken should through when jwt is expired", () => {
    expect.assertions(1);
    const aud = "SiGG-storage";
    const key = utils.privateKeyAsJWK(process.env.APP_PRIVATE_KEY);
    const did = "did:zgorizzo";
    const tokenPayload = {
      did,
    };

    const token = JWT.sign(tokenPayload, key, {
      expiresIn: "0 seconds",
      audience: aud,
      kid: false,
      header: {
        typ: "JWT",
      },
    });

    expect(() =>
      sut.extractPayloadFromToken({
        jwt: token,
        did,
      })
    ).toThrow(new UnauthorizedException("token expired"));
  });

  it("extractPayloadFromToken should through when did is not the same", () => {
    expect.assertions(1);
    const aud = "SiGG-storage";
    const did = "did:zgorizzo";
    const tokenPayload = {
      did,
    };
    const key = utils.privateKeyAsJWK(process.env.APP_PRIVATE_KEY);
    const token = JWT.sign(tokenPayload, key, {
      expiresIn: "5 seconds",
      audience: aud,
      kid: false,
      header: {
        typ: "JWT",
      },
    });

    expect(() =>
      sut.extractPayloadFromToken({
        jwt: token,
        did: "did:others",
      })
    ).toThrow(
      new ForbiddenException(`did did:others does not match token did ${did}`)
    );
  });

  it("extractPayloadFromToken should work", () => {
    expect.assertions(3);
    const aud = "SiGG-storage";
    const did = "did:zgorizzo";
    const tokenPayload = {
      did,
    };

    const key = utils.privateKeyAsJWK(process.env.APP_PRIVATE_KEY);
    const token = JWT.sign(tokenPayload, key, {
      expiresIn: "15 minutes",
      audience: aud,
      kid: false,
      header: {
        typ: "JWT",
      },
    });

    const payload = sut.extractPayloadFromToken({
      jwt: token,
      did,
    });
    expect(payload.exp).toBeGreaterThan(payload.iat);
    expect(payload.aud).toStrictEqual(aud);
    expect(payload.did).toStrictEqual(did);
  });
});
