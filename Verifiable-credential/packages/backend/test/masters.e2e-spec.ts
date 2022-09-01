import request from "supertest";
import {
  INestApplication,
  ValidationPipe,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { JWT, JWK } from "jose";
import { AppModule } from "../src/app.module";

const verifiableAttestationsEndpoint = "/api/masters/verifiable-attestations";
const didAuthEndpoint = "/api/masters/did-auth";
const didAuthValidationsEndpoint = "/api/masters/did-auth-validations";

const payload = {
  sub_jwk: {
    kid: "did:sigg:0x1234",
  },
};

const token = JWT.sign(payload, JWK.asKey("test"), {
  audience: "sigg-wallet",
  expiresIn: "2 hours",
  header: { typ: "JWT" },
  subject: "test",
});

describe("masters", () => {
  let app: INestApplication;

  // eslint-disable-next-line jest/no-hooks
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    // Mute logger debug
    jest.spyOn(Logger, "debug").mockImplementation(() => {});

    await app.init();
  });

  // eslint-disable-next-line jest/no-hooks
  afterAll(async () => {
    await app.close();
  });

  describe(`request POST ${verifiableAttestationsEndpoint}`, () => {
    it("should fail if no JWT is sent", async () => {
      expect.assertions(2);

      const response = await request(app.getHttpServer()).post(
        verifiableAttestationsEndpoint
      );

      expect(response.body).toStrictEqual({
        error: "Forbidden",
        message: "Missing JWT",
        status: HttpStatus.FORBIDDEN,
      });
      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });

    it("should fail if no did is sent", async () => {
      expect.assertions(2);

      const response = await request(app.getHttpServer())
        .post(verifiableAttestationsEndpoint)
        .set("Authorization", `Bearer ${token}`);

      expect(response.body).toStrictEqual({
        error: "Bad Request",
        message: [
          "did should not be null or undefined",
          "did should not be empty",
          "did must be a string",
        ],
        statusCode: HttpStatus.BAD_REQUEST,
      });
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe(`request GET ${didAuthEndpoint}`, () => {
    it("should return a redirectUrl and nonce", async () => {
      expect.assertions(2);

      const response = await request(app.getHttpServer()).get(didAuthEndpoint);

      expect(response.body).toStrictEqual(
        expect.objectContaining({
          redirectUrl: expect.any(String),
          nonce: expect.any(String),
        })
      );
      expect(response.status).toBe(HttpStatus.OK);
    });
  });

  describe(`request POST ${didAuthValidationsEndpoint}`, () => {
    it("should fail when didAuthResponseJwt and/or nonce are missing", async () => {
      expect.assertions(2);

      const response = await request(app.getHttpServer())
        .post(didAuthValidationsEndpoint)
        .send({});

      expect(response.body).toStrictEqual({
        error: "Bad Request",
        message: [
          "didAuthResponseJwt should not be null or undefined",
          "didAuthResponseJwt should not be empty",
          "nonce should not be null or undefined",
          "nonce should not be empty",
        ],
        statusCode: HttpStatus.BAD_REQUEST,
      });
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });
});
