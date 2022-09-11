import { Test, TestingModule } from "@nestjs/testing";
import {
  HttpModule,
  ValidationPipe,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { of } from "rxjs";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import * as hbs from "hbs";
import { StoragePostFilesResponse } from "../src/types/storage.post.files.response";
import { StorageMetadata, FileMetadataStatus } from "../src/types/storage.meta";
import AppModule from "../src/app.module";
import JwtService from "../src/services/jwt.service";
import StorageService from "../src/services/storage.service";
import AppController from "../src/app.controller";
import TimestampService from "../src/services/timestamp.service";
import VerifyDto from "../src/types/verify.dto";
import { TimestampResponse } from "../src/types/timestamp.response";
import WalletService from "../src/services/wallet.service";
import DocumentDto from "../src/types/document.dto";
import CredentialDto from "../src/types/credentials.dto";

jest.mock("../src/services/storage.service");
jest.mock("../src/services/jwt.service");
jest.mock("../src/services/timestamp.service");
jest.mock("../src/services/wallet.service");

describe("app Controller", () => {
  let controller: AppController;
  let timestampService: TimestampService;
  let storageService: StorageService;
  let walletService: WalletService;
  let app: NestExpressApplication;

  // eslint-disable-next-line jest/no-hooks
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, HttpModule],
      controllers: [AppController],
      providers: [StorageService, JwtService, TimestampService, WalletService],
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

    controller = moduleFixture.get(AppController);
    timestampService = moduleFixture.get<TimestampService>(TimestampService);
    storageService = moduleFixture.get<StorageService>(StorageService);
    walletService = moduleFixture.get<WalletService>(WalletService);
  });

  // eslint-disable-next-line jest/no-hooks
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should be defined", () => {
    expect.assertions(1);
    expect(controller).toBeDefined();
  });

  it("get /health returns ok", async () => {
    expect.assertions(1);
    const expected = "ok";
    expect(await controller.health()).toBe(expected);
  });

  it("get / with did and jwt in body returns ok", async () => {
    expect.assertions(1);
    const req = {
      headers: jest.fn(),
    };
    expect(await controller.root(req as any)).toStrictEqual(
      controller.renderOpt
    );
  });

  it("post / with did and jwt in body returns ok", async () => {
    expect.assertions(1);
    const expected = "ok";
    const data: CredentialDto = {
      did: "....????",
      jwt: ".....",
    };

    expect(await controller.home(data)).toBe(expected);
  });

  it("get /fileupload with already stored hash should display already stored", async () => {
    expect.assertions(5);
    const body = {
      did: "did:ben:424242424",
      jwt: "566455454545.566455454545.566455454545",
      title: "an electronic peer to peer electronic cash system",
    };
    const file = {
      name: "sampleFile",
      buffer: Buffer.from("42"),
      lenght: 3,
      originalname: "yolo",
    };

    const expectedMetaResult: StorageMetadata = {
      name: "my_super_duper.file",
      hash:
        "0x0355a07b257bac3b223bd29b3bd3e24f5a53a84885d8bf36e278be0b45b04555",
      description: "interesting file",
      notarizedAt: new Date(),
      registeredBy: "did:ben:424242424",
      status: 0,
    };

    const spyStorageStoreFile = jest.spyOn(storageService, "storeFiles");

    const spyStorageGetMeta = jest
      .spyOn(storageService, "getKeyValue")
      .mockImplementationOnce(() => of(expectedMetaResult).toPromise());
    const spyStorageStoreKeyValueMeta = jest
      .spyOn(storageService, "storeKeyValue")
      .mockImplementationOnce(() => of({}).toPromise());
    const spyWalletTxSign = jest.spyOn(
      walletService,
      "askForTransactionSignature"
    );

    const ctrlRes = {
      message: `Already stored in the ledger`,
      ok: false,
      user: body.did,
      info: expect.objectContaining({
        hash: expectedMetaResult.hash,
        registeredBy: expectedMetaResult.registeredBy,
      }),
    };

    const res = await controller.doDocUpload(file, body);

    expect(res).toStrictEqual(expect.objectContaining(ctrlRes));
    expect(spyStorageGetMeta).toHaveBeenCalledTimes(1);
    expect(spyStorageStoreKeyValueMeta).toHaveBeenCalledTimes(0);
    expect(spyStorageStoreFile).toHaveBeenCalledTimes(0);
    expect(spyWalletTxSign).toHaveBeenCalledTimes(0);
  });

  it("get /fileupload should throw error if stored hash is different from docHash", async () => {
    expect.assertions(5);
    const body = {
      did: "did:ben:424242424",
      jwt: "566455454545.566455454545.566455454545",
      title: "an electronic peer to peer electronic cash system",
    };
    const file = {
      name: "sampleFile",
      buffer: Buffer.from("42"),
      lenght: 3,
      originalname: "yolo",
    };

    const spyStorageStoreFile = jest
      .spyOn(storageService, "storeFiles")
      .mockImplementationOnce(() =>
        of({
          hash: "0x0000000011111111111111100000000000000",
          function: "krickkrack242",
        }).toPromise()
      );

    const spyStorageGetMeta = jest
      .spyOn(storageService, "getKeyValue")
      .mockImplementationOnce(() => of(null).toPromise());
    const spyStorageStoreKeyValueMeta = jest
      .spyOn(storageService, "storeKeyValue")
      .mockImplementationOnce(() => of({}).toPromise());
    const spyWalletTxSign = jest
      .spyOn(walletService, "askForTransactionSignature")
      .mockImplementationOnce(() => of({}).toPromise());
    await expect(controller.doDocUpload(file, body)).rejects.toThrow(
      new HttpException(
        "hash does not match with stored hash",
        HttpStatus.BAD_REQUEST
      )
    );

    expect(spyStorageGetMeta).toHaveBeenCalledTimes(1);
    expect(spyStorageStoreFile).toHaveBeenCalledTimes(1);
    expect(spyStorageStoreKeyValueMeta).toHaveBeenCalledTimes(0);
    expect(spyWalletTxSign).toHaveBeenCalledTimes(0);
  });

  it("get /fileupload should throw error if no body with did and jwt", async () => {
    expect.assertions(7);
    let body = {};
    const file = {
      name: "sampleFile",
      buffer: Buffer.from("42"),
      lenght: 3,
      originalname: "yolo",
    };

    const spyStorageStoreFile = jest
      .spyOn(storageService, "storeFiles")
      .mockImplementationOnce(() =>
        of({
          hash: "0x0000000011111111111111100000000000000",
          function: "krickkrack242",
        }).toPromise()
      );

    const spyStorageGetMeta = jest
      .spyOn(storageService, "getKeyValue")
      .mockImplementationOnce(() => of(null).toPromise());
    const spyStorageStoreKeyValueMeta = jest
      .spyOn(storageService, "storeKeyValue")
      .mockImplementationOnce(() => of({}).toPromise());
    const spyWalletTxSign = jest
      .spyOn(walletService, "askForTransactionSignature")
      .mockImplementationOnce(() => of({}).toPromise());

    expect(await controller.doDocUpload(file, body)).toStrictEqual(
      expect.objectContaining({
        error: true,
        notAuthenticated: true,
      })
    );

    body = { did: "did:fdsokmjkfkdsjkdsj" };
    expect(await controller.doDocUpload(file, body)).toStrictEqual(
      expect.objectContaining({
        error: true,
        notAuthenticated: true,
      })
    );

    body = { jwt: "dsqdqs.dsqdqs.dsqdsq" };
    expect(await controller.doDocUpload(file, body)).toStrictEqual(
      expect.objectContaining({
        error: true,
        notAuthenticated: true,
      })
    );

    expect(spyStorageGetMeta).toHaveBeenCalledTimes(0);
    expect(spyStorageStoreFile).toHaveBeenCalledTimes(0);
    expect(spyStorageStoreKeyValueMeta).toHaveBeenCalledTimes(0);
    expect(spyWalletTxSign).toHaveBeenCalledTimes(0);
  });

  it("get /fileupload should return error message if file is missing or empty", async () => {
    expect.assertions(5);
    const body = {
      did: "did:ben:424242424",
      jwt: "566455454545.566455454545.566455454545",
      title: "an electronic peer to peer electronic cash system",
    };
    const file = {
      name: "sampleFile",
      buffer: Buffer.from(""),
      lenght: 3,
      originalname: "yolo",
    };

    const expectedMetaResult: StorageMetadata = {
      name: "my_super_duper.file",
      hash:
        "0x0355a07b257bac3b223bd29b3bd3e24f5a53a84885d8bf36e278be0b45b04555",
      description: "interesting file",
      notarizedAt: new Date(),
      registeredBy: "did:ben:424242424",
      status: 0,
    };

    const spyStorageStoreFile = jest.spyOn(storageService, "storeFiles");

    const spyStorageGetMeta = jest
      .spyOn(storageService, "getKeyValue")
      .mockImplementationOnce(() => of(expectedMetaResult).toPromise());
    const spyStorageStoreKeyValueMeta = jest
      .spyOn(storageService, "storeKeyValue")
      .mockImplementationOnce(() => of({}).toPromise());
    const spyWalletTxSign = jest.spyOn(
      walletService,
      "askForTransactionSignature"
    );

    const ctrlRes = {
      message: `bad file`,
      ok: false,
      user: body.did,
    };
    const res = await controller.doDocUpload(file, body);
    expect(res).toStrictEqual(expect.objectContaining(ctrlRes));
    expect(spyStorageGetMeta).toHaveBeenCalledTimes(0);
    expect(spyStorageStoreKeyValueMeta).toHaveBeenCalledTimes(0);
    expect(spyStorageStoreFile).toHaveBeenCalledTimes(0);
    expect(spyWalletTxSign).toHaveBeenCalledTimes(0);
  });

  it("get /fileupload  should return OK", async () => {
    expect.assertions(6);
    const body = {
      did: "did:ben:424242424",
      jwt: "566455454545.566455454545.566455454545",
      title: "an electronic peer to peer electronic cash system",
    };
    const file = {
      name: "sampleFile",
      buffer: Buffer.from("42"),
      lenght: 3,
      originalname: "yolo",
    };

    const storeFileRes: StoragePostFilesResponse = {
      hash:
        "0xccb1f717aa77602faf03a594761a36956b1c4cf44c6b336d1db57da799b331b8",
      function: "krickkrack256",
    };
    const spyStorageStoreFile = jest
      .spyOn(storageService, "storeFiles")
      .mockImplementationOnce(() =>
        of({
          hash:
            "0xccb1f717aa77602faf03a594761a36956b1c4cf44c6b336d1db57da799b331b8",
          function: "krickkrack242",
        }).toPromise()
      );

    const spyStorageGetMeta = jest
      .spyOn(storageService, "getKeyValue")
      .mockImplementationOnce(() => of(null).toPromise());

    const payloadStoreKeyValue: StorageMetadata = {
      name: file.originalname,
      hash: storeFileRes.hash,
      description: body.title,
      notarizedAt: expect.any(Date),
      registeredBy: body.did,
      status: FileMetadataStatus.Pending,
    };
    const spyStorageStoreKeyValueMeta = jest
      .spyOn(storageService, "storeKeyValue")
      .mockImplementationOnce(() => of({}).toPromise());

    const spyWalletTxSign = jest
      .spyOn(walletService, "askForTransactionSignature")
      .mockImplementationOnce(() => of({}).toPromise());

    const ctrlRes = {
      message: `file uploaded to ${storeFileRes.hash}`,
      ok: true,
      user: body.did,
      hash: storeFileRes.hash,
    };

    const res = await controller.doDocUpload(file, body);

    expect(res).toStrictEqual(expect.objectContaining(ctrlRes));
    expect(spyStorageGetMeta).toHaveBeenCalledTimes(1);
    expect(spyStorageStoreFile).toHaveBeenCalledTimes(1);
    expect(spyStorageStoreKeyValueMeta).toHaveBeenCalledTimes(1);
    expect(spyStorageStoreKeyValueMeta).toHaveBeenLastCalledWith(
      payloadStoreKeyValue
    );
    expect(spyWalletTxSign).toHaveBeenCalledTimes(1);
  });

  it("get /verify with bad hash should return nok and dont call timestamp api", async () => {
    expect.assertions(3);
    const data: VerifyDto = {
      docHash: "jlkkljkl",
    };

    const res = await controller.verifyHash(data);
    const expectedTsResult: TimestampResponse = {
      txHash:
        "0x0355a07b257bac3b223bd29b3bd3e24f5a53a84885d8bf36e278be0b45b04555",
      hash: "0355a07b257bac3b223bd29b3bd3e24f5a53a84885d8bf36e278be0b45b04555",
      timestamp: new Date(),
      registeredBy: "did:ben:424242424",
      blockNumber: 0,
    };

    const spyTimestamp = jest
      .spyOn(timestampService, "getTimestamp")
      .mockImplementationOnce(() => of(expectedTsResult).toPromise());
    expect(res.ok).toStrictEqual(false);
    expect(res.message).toStrictEqual("Hash is not correct");
    expect(spyTimestamp).toHaveBeenCalledTimes(0);
  });

  it("get /verify should return ok", async () => {
    expect.assertions(4);
    const data: VerifyDto = {
      docHash:
        "0xbe5b5152fcd01b6bf53f149bfd1493a49ec5e8ae94cc4c29a81563eea0e347f4",
    };

    const expectedTsResult: TimestampResponse = {
      txHash:
        "0x0355a07b257bac3b223bd29b3bd3e24f5a53a84885d8bf36e278be0b45b04555",
      hash:
        "0x0355a07b257bac3b223bd29b3bd3e24f5a53a84885d8bf36e278be0b45b04555",
      timestamp: new Date(),
      registeredBy: "did:ben:424242424",
      blockNumber: 0,
    };
    const spyTimestamp = jest
      .spyOn(timestampService, "getTimestamp")
      .mockImplementationOnce(() => of(expectedTsResult).toPromise());
    const res = await controller.verifyHash(data);

    expect(res.ok).toStrictEqual(true);
    expect(res.info).toStrictEqual({
      hash: expectedTsResult.hash,
      timestamp: expectedTsResult.timestamp,
      ledgerHash: expectedTsResult.txHash,
      registeredBy: expectedTsResult.registeredBy,
    });
    expect(spyTimestamp).toHaveBeenCalledTimes(1);
    expect(spyTimestamp).toHaveBeenLastCalledWith(data.docHash);
  });

  it("get /verify should return ok if hash doesn't start with 0x", async () => {
    expect.assertions(4);
    const data: VerifyDto = {
      docHash:
        "be5b5152fcd01b6bf53f149bfd1493a49ec5e8ae94cc4c29a81563eea0e347f4",
    };

    const expectedTsResult: TimestampResponse = {
      txHash:
        "0x0355a07b257bac3b223bd29b3bd3e24f5a53a84885d8bf36e278be0b45b04555",
      hash:
        "0x0355a07b257bac3b223bd29b3bd3e24f5a53a84885d8bf36e278be0b45b04555",
      timestamp: new Date(),
      registeredBy: "did:ben:424242424",
      blockNumber: 0,
    };
    const spyTimestamp = jest
      .spyOn(timestampService, "getTimestamp")
      .mockImplementationOnce(() => of(expectedTsResult).toPromise());
    const res = await controller.verifyHash(data);

    expect(res.ok).toStrictEqual(true);
    expect(res.info).toStrictEqual({
      hash: expectedTsResult.hash,
      timestamp: expectedTsResult.timestamp,
      ledgerHash: expectedTsResult.txHash,
      registeredBy: expectedTsResult.registeredBy,
    });
    expect(spyTimestamp).toHaveBeenCalledTimes(1);
    expect(spyTimestamp).toHaveBeenLastCalledWith(`0x${data.docHash}`);
  });

  it("get /verify should return ok:false  if it doesn't exist in timestamp api", async () => {
    expect.assertions(4);
    const data: VerifyDto = {
      docHash:
        "0xbe5b5152fcd01b6bf53f149bfd1493a49ec5e8ae94cc4c29a81563eea0e347f4",
    };

    const spyTimestamp = jest
      .spyOn(timestampService, "getTimestamp")
      .mockImplementationOnce(() => of(null).toPromise());

    const res = await controller.verifyHash(data);

    expect(res.ok).toStrictEqual(false);
    expect(res.signed).toStrictEqual(false);
    expect(spyTimestamp).toHaveBeenCalledTimes(1);
    expect(spyTimestamp).toHaveBeenLastCalledWith(data.docHash);
  });

  it("get /verifyfile should return ok", async () => {
    expect.assertions(4);
    const expectedTsResult: TimestampResponse = {
      txHash:
        "0x0355a07b257bac3b223bd29b3bd3e24f5a53a84885d8bf36e278be0b45b04555",
      hash:
        "0x0355a07b257bac3b223bd29b3bd3e24f5a53a84885d8bf36e278be0b45b04555",
      timestamp: new Date(),
      registeredBy: "did:ben:424242424",
      blockNumber: 0,
    };

    const body = {
      did: "did:ben:424242424",
      jwt: "566455454545.566455454545.566455454545",
      title: "an electronic peer to peer electronic cash system",
    };
    const file = {
      name: "sampleFile",
      buffer: Buffer.from("42"),
      lenght: 3,
      originalname: "yolo",
    };

    const spyTimestamp = jest
      .spyOn(timestampService, "getTimestamp")
      .mockImplementationOnce(() => of(expectedTsResult).toPromise());

    const res = await controller.doVerifyFile(file, body);

    expect(res.ok).toStrictEqual(true);
    expect(res.info).toStrictEqual({
      hash: expectedTsResult.hash,
      timestamp: expectedTsResult.timestamp,
      ledgerHash: expectedTsResult.txHash,
      registeredBy: expectedTsResult.registeredBy,
    });
    expect(spyTimestamp).toHaveBeenCalledTimes(1);
    expect(spyTimestamp).toHaveBeenLastCalledWith(
      "0xccb1f717aa77602faf03a594761a36956b1c4cf44c6b336d1db57da799b331b8"
    );
  });

  it("get /verifyfile should throw if credential is missing", async () => {
    expect.assertions(1);
    const body = {
      title: "an electronic peer to peer electronic cash system",
    };
    const file = {
      name: "sampleFile",
      buffer: Buffer.from("42"),
      lenght: 3,
      originalname: "yolo",
    };
    const res = await controller.doVerifyFile(file, body);
    expect(res).toStrictEqual(
      expect.objectContaining({
        ok: false,
      })
    );
  });

  it("get /document should return ok", async () => {
    expect.assertions(4);
    const data: DocumentDto = {
      hash:
        "0xbe5b5152fcd01b6bf53f149bfd1493a49ec5e8ae94cc4c29a81563eea0e347f4",
      did: "did:ben:566455454545",
      jwt: "566455454545.566455454545.566455454545",
    };

    const storageRes = {
      headers: {
        "content-type": "binary",
        "content-disposition": "",
        "content-length": 30,
      },
      data: "data",
    };
    const spyStorageGetMeta = jest
      .spyOn(storageService, "getFile")
      .mockImplementationOnce(() => of(storageRes).toPromise());
    const resp = {
      set: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
      redirect: jest.fn(),
    };

    await controller.document(data, resp as any);

    expect(spyStorageGetMeta).toHaveBeenCalledTimes(1);
    expect(resp.write).toHaveBeenCalledTimes(1);
    expect(resp.end).toHaveBeenCalledTimes(1);
    expect(resp.redirect).toHaveBeenCalledTimes(0);
  });

  it("get /document should redirect if document is not found", async () => {
    expect.assertions(4);
    const data: DocumentDto = {
      hash:
        "0xbe5b5152fcd01b6bf53f149bfd1493a49ec5e8ae94cc4c29a81563eea0e347f4",
      did: "did:ben:566455454545",
      jwt: "566455454545.566455454545.566455454545",
    };

    const spyStorageGetMeta = jest
      .spyOn(storageService, "getFile")
      .mockImplementationOnce(() => of(null).toPromise());
    const resp = {
      set: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
      redirect: jest.fn(),
    };

    await controller.document(data, resp as any);

    expect(spyStorageGetMeta).toHaveBeenCalledTimes(1);
    expect(resp.write).toHaveBeenCalledTimes(0);
    expect(resp.end).toHaveBeenCalledTimes(0);
    expect(resp.redirect).toHaveBeenCalledTimes(1);
  });
});
