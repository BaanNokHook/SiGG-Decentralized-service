import { Test, TestingModule } from "@nestjs/testing";
import { ValidationPipe, HttpModule } from "@nestjs/common";
import * as request from "supertest";
import * as hbs from "hbs";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import { utils } from "ethers";
import { of } from "rxjs/internal/observable/of";
import AppModule from "../src/app.module";
import DocumentDto from "../src/types/document.dto";
import VerifyDto from "../src/types/verify.dto";
import WalletService from "../src/services/wallet.service";
import JwtService from "../src/services/jwt.service";
import TimestampService from "../src/services/timestamp.service";
import { TimestampResponse } from "../src/types/timestamp.response";

describe("appController (e2e)", () => {
  let app: NestExpressApplication;
  let ws: WalletService;
  let ts: TimestampService;

  // eslint-disable-next-line jest/no-hooks
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, HttpModule],
      providers: [WalletService, TimestampService, JwtService],
    }).compile();

    app = moduleFixture.createNestApplication<NestExpressApplication>();
    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix(process.env.EUF_PATH_NAME);
    app.useStaticAssets(join(__dirname, "..", "public"));
    app.setBaseViewsDir(join(__dirname, "..", "views"));

    app.setViewEngine("hbs");
    hbs.registerPartials(join(__dirname, "..", "views/partials/"), () => {});

    app.set("view options", { layout: "layouts/layout" });

    await app.init();

    ws = moduleFixture.get<WalletService>(WalletService);
    ts = moduleFixture.get<TimestampService>(TimestampService);
  });

  // eslint-disable-next-line jest/no-hooks
  afterAll(async () => {
    await new Promise((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
    await app.close();
  });

  it(`(GET) ${process.env.EUF_PATH_NAME}/health`, async () => {
    expect.assertions(2);
    const response = await request(app.getHttpServer()).get(
      `${process.env.EUF_PATH_NAME}/health`
    );
    expect(response.status).toBe(200);
    expect(response.text).toStrictEqual("ok");
  });

  it(`(GET) ${process.env.EUF_PATH_NAME}/`, async () => {
    expect.assertions(2);
    const response = await request(app.getHttpServer()).get(
      `${process.env.EUF_PATH_NAME}/`
    );
    expect(response.status).toBe(200);

    expect(response.text).toStrictEqual(expect.stringContaining("<header"));
  });

  it(`(POST) ${process.env.EUF_PATH_NAME}/document redirect to homepage if file is not found`, async () => {
    expect.assertions(2);
    const expected: DocumentDto = {
      did: "did:ben:424242424",
      jwt: "566455454545.566455454545.566455454545",
      hash: "0355a07b257bac3b223bd29b3bd3e24f5a53a84885d8bf36e278be0b45b04555",
    };
    const response = await request(app.getHttpServer())
      .post(`${process.env.EUF_PATH_NAME}/document`)
      .send(expected);
    expect(response.status).toBe(302);
    expect(response.text).toStrictEqual(
      `Found. Redirecting to ${process.env.EUF_PATH_NAME}`
    );
  });

  it(`(POST) ${process.env.EUF_PATH_NAME}/fileupload incorrect should display error`, async () => {
    expect.assertions(2);
    const buf = Buffer.from("");
    const response = await request(app.getHttpServer())
      .post(`${process.env.EUF_PATH_NAME}/fileupload`)
      .attach("sampleFile", buf, "luna.jpeg")
      .field("did", "did:ben:424242424")
      .field("jwt", "566455454545.566455454545.566455454545");
    expect(response.status).toBe(201);

    expect(response.text).toStrictEqual(expect.stringContaining("bad file"));
  });

  it(`(POST) ${process.env.EUF_PATH_NAME}/fileupload no jwt is not allowed`, async () => {
    expect.assertions(1);
    const buf = Buffer.from("dssd");
    const response = await request(app.getHttpServer())
      .post(`${process.env.EUF_PATH_NAME}/fileupload`)
      .attach("sampleFile", buf, "luna.jpeg")
      .field("did", "did:ben:424242424");
    expect(response.text).toContain("Not authenticated");
  });

  it(`(POST) ${process.env.EUF_PATH_NAME}/fileupload should upload`, async () => {
    expect.assertions(2);
    const randomBytes = utils.sha256(utils.randomBytes(256));

    // mock transaction-signatures on wallet api
    jest
      .spyOn(ws, "askForTransactionSignature")
      .mockImplementationOnce(() => of("expectedSessionsResult").toPromise());

    // random file to be sure that it is not anchored yet
    const buf = Buffer.from(randomBytes);
    const response = await request(app.getHttpServer())
      .post(`${process.env.EUF_PATH_NAME}/fileupload`)
      .attach("sampleFile", buf, "luna.jpeg")
      .field("title", "zgorizzo")
      .field("did", "did:ben:424242424")
      .field("jwt", "566455454545.566455454545.566455454545");

    expect(response.status).toBe(201);
    expect(response.text).toStrictEqual(
      expect.stringContaining("file uploaded to ")
    );
  });

  it(`(POST) ${process.env.EUF_PATH_NAME}/fileupload incorrect title should display error`, async () => {
    expect.assertions(2);
    const buf = Buffer.from("randomBytes");
    const response = await request(app.getHttpServer())
      .post(`${process.env.EUF_PATH_NAME}/fileupload`)
      .attach("sampleFile", buf, "luna.jpeg")
      .field("did", "did:ben:424242424")
      .field("jwt", "566455454545.566455454545.566455454545");
    expect(response.status).toBe(201);

    expect(response.text).toStrictEqual(
      expect.stringContaining("Document title missing")
    );
  });

  it(`(POST) ${process.env.EUF_PATH_NAME}/verifyfile incorrect should display error`, async () => {
    expect.assertions(2);
    const buf = Buffer.from("");
    const response = await request(app.getHttpServer())
      .post(`${process.env.EUF_PATH_NAME}/verifyfile`)
      .attach("sampleFile", buf, "luna.jpeg")
      .field("did", "did:ben:424242424")
      .field("jwt", "566455454545.566455454545.566455454545");
    expect(response.status).toBe(201);

    expect(response.text).toStrictEqual(expect.stringContaining("bad file"));
  });

  it(`(POST) ${process.env.EUF_PATH_NAME}/verifyfile should render not found`, async () => {
    expect.assertions(2);
    const buf = Buffer.from("abc");
    const response = await request(app.getHttpServer())
      .post(`${process.env.EUF_PATH_NAME}/verifyfile`)
      .attach("sampleFile", buf, "luna.jpeg")
      .field("did", "did:ben:424242424")
      .field("jwt", "566455454545.566455454545.566455454545");
    expect(response.status).toBe(201);

    expect(response.text).toStrictEqual(
      expect.stringContaining(
        "No registration could be found for this document"
      )
    );
  });

  it(`(POST) ${process.env.EUF_PATH_NAME}/verify should render details when found`, async () => {
    expect.assertions(5);

    // mock get hash on timestamp api
    const res: TimestampResponse = {
      hash: "f41ddf6cc0cd984a81ce3a07b988ad33fbbbcbad388e2c9b753897dcdf795ee0",
      txHash:
        "0x3f482c490263f923c8dbd8e69bd6ec2369d906ef321c5523778f9b6297755ffc",
      timestamp: new Date("2020-03-31T12:23:28.000Z"),
      registeredBy: "0x8e438c5e5467d3f4e8f4ed6d3d0e80c28febec71",
      blockNumber: 389606,
    };
    jest
      .spyOn(ts, "getTimestamp")
      .mockImplementationOnce(() => of(res).toPromise());

    const verif: VerifyDto = {
      docHash:
        "0xf41ddf6cc0cd984a81ce3a07b988ad33fbbbcbad388e2c9b753897dcdf795ee0",
    };
    const response = await request(app.getHttpServer())
      .post(`${process.env.EUF_PATH_NAME}/verify`)
      .send(verif);
    expect(response.status).toBe(201);
    expect(response.text).not.toStrictEqual(
      expect.stringContaining(
        "No registration could be found for this document"
      )
    );
    expect(response.text.toLowerCase()).toStrictEqual(
      expect.stringContaining("0x8e438c5e5467d3f4e8f4ed6d3d0e80c28febec71")
    );
    expect(response.text.toLowerCase()).toStrictEqual(
      expect.stringContaining(
        "0x3f482c490263f923c8dbd8e69bd6ec2369d906ef321c5523778f9b6297755ffc"
      )
    );
    expect(response.text).toStrictEqual(
      expect.stringContaining("File signed, notarised in the ledger")
    );
  });
});
