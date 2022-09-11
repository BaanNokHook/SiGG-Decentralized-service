import { Test } from "@nestjs/testing";
import { HttpService, HttpModule } from "@nestjs/common";
import { of, throwError } from "rxjs";
import { AxiosResponse } from "axios";
import { ConfigModule } from "@nestjs/config";
import * as jsonpatch from "fast-json-patch";
import { SessionsResponse } from "../../src/types/sessions.response";
import { StorageMetadata } from "../../src/types/storage.meta";
import StorageService from "../../src/services/storage.service";
import JwtService from "../../src/services/jwt.service";
import { StoragePostFilesResponse } from "../../src/types/storage.post.files.response";

jest.mock("../../src/services/jwt.service");

describe("storageService", () => {
  let sut: StorageService;
  let httpService: HttpService;
  const accessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
  const expectedStorageSessionsResult: SessionsResponse = {
    accessToken,
    tokenType: "Bearer",
    expiresIn: 900,
    issuedAt: "1467841035013",
  };
  const expectedMetaResult: StorageMetadata = {
    name: "my_super_duper.file",
    hash: "0x0355a07b257bac3b223bd29b3bd3e24f5a53a84885d8bf36e278be0b45b04555",
    description: "interesting file",
    notarizedAt: new Date(),
    registeredBy: "did:ben:424242424",
    status: 0,
  };

  const successStorageMetaResult: AxiosResponse = {
    data: expectedMetaResult,
    status: 200,
    statusText: "",
    headers: {},
    config: {},
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
      providers: [StorageService, JwtService],
    }).compile();

    httpService = module.get<HttpService>(HttpService);
    sut = module.get<StorageService>(StorageService);
  });

  // eslint-disable-next-line jest/no-hooks
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should be defined", () => {
    expect.assertions(1);
    expect(sut).toBeDefined();
  });

  it("login should return null when call POST on sessions/ storage api fails", async () => {
    expect.assertions(3);
    const spy = jest
      .spyOn(httpService, "post")
      .mockImplementationOnce(() =>
        throwError({ response: { status: 500, statusText: "unexpected" } })
      );

    const res: SessionsResponse = await sut.login();
    expect(res).toBeNull();
    expect(spy).toHaveBeenLastCalledWith(
      `${process.env.API}storage/v1/sessions`,
      {
        assertion: expect.any(String),
        grantType: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        scope: "SiGG profile component",
      },
      { headers: { "Content-Type": "application/json" } }
    );
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("get KeyValue should succeed and call storage api and return metadata", async () => {
    expect.assertions(4);
    const spyStorageGet = jest
      .spyOn(httpService, "get")
      .mockImplementationOnce(() => of(successStorageMetaResult));

    const spyLogin = jest
      .spyOn(sut, "login")
      .mockImplementationOnce(() =>
        of(expectedStorageSessionsResult).toPromise()
      );
    const storeFilePath = `${process.env.API}storage/v1/stores/distributed/key-values/notarisation_${expectedMetaResult.hash}`;
    const res: StorageMetadata = await sut.getKeyValue(expectedMetaResult.hash);
    expect(spyLogin).toHaveBeenCalledTimes(1);
    expect(res).toStrictEqual(expectedMetaResult);
    expect(spyStorageGet).toHaveBeenLastCalledWith(storeFilePath, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    expect(spyStorageGet).toHaveBeenCalledTimes(1);
  });

  it("get KeyValue should return null when call storage api fails", async () => {
    expect.assertions(4);
    const spyStorageGet = jest
      .spyOn(httpService, "get")
      .mockImplementationOnce(() =>
        throwError({ response: { status: 500, statusText: "unexpected" } })
      );

    const spyLogin = jest
      .spyOn(sut, "login")
      .mockImplementationOnce(() =>
        of(expectedStorageSessionsResult).toPromise()
      );
    const storeFilePath = `${process.env.API}storage/v1/stores/distributed/key-values/notarisation_${expectedMetaResult.hash}`;
    const res: StorageMetadata = await sut.getKeyValue(expectedMetaResult.hash);
    expect(spyLogin).toHaveBeenCalledTimes(1);
    expect(res).toBeNull();
    expect(spyStorageGet).toHaveBeenLastCalledWith(storeFilePath, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    expect(spyStorageGet).toHaveBeenCalledTimes(1);
  });

  it("store files should succeed and call POST on sessions/ files/ storage api", async () => {
    expect.assertions(4);
    const expectedResult: StoragePostFilesResponse = {
      hash:
        "0x0355a07b257bac3b223bd29b3bd3e24f5a53a84885d8bf36e278be0b45b04555",
      function: "omae wa mou shindeiru",
    };

    const result: AxiosResponse = {
      data: expectedResult,
      status: 200,
      statusText: "",
      headers: {},
      config: {},
    };

    const spy = jest
      .spyOn(httpService, "post")
      .mockImplementationOnce(() => of(result));

    const spyLogin = jest
      .spyOn(sut, "login")
      .mockImplementationOnce(() =>
        of(expectedStorageSessionsResult).toPromise()
      );

    const storeFilePath = `${process.env.API}storage/v1/stores/distributed/files`;
    const file = {
      buffer: Buffer.from("100"),
      lenght: 3,
      originalname: "yolo",
    };
    const res: StoragePostFilesResponse = await sut.storeFiles(file);
    const expectedResponse = expect.objectContaining({
      _boundary: expect.anything(),
      _streams: expect.arrayContaining([
        expect.stringContaining("yolo"),
        expect.objectContaining({}),
      ]),
      _valueLength: expect.any(Number),
    });
    const expectedHeaderResponse = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "content-type": expect.stringContaining(
          "multipart/form-data; boundary"
        ),
      },
    };
    expect(spyLogin).toHaveBeenCalledTimes(1);
    expect(res).toStrictEqual(expectedResult);
    expect(spy).toHaveBeenLastCalledWith(
      storeFilePath,
      expectedResponse,
      expectedHeaderResponse
    );
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("store files should return null when call POST on sessions/ storage api fails", async () => {
    expect.assertions(3);

    const spy = jest
      .spyOn(httpService, "post")
      .mockImplementationOnce(() =>
        throwError({ response: { status: 500, statusText: "unexpected" } })
      );

    const storeSessionPath = `${process.env.API}storage/v1/sessions`;
    const file = {
      buffer: Buffer.from("100"),
      lenght: 3,
      originalname: "yolo",
    };
    const res: StoragePostFilesResponse = await sut.storeFiles(file);

    expect(res).toBeNull();
    expect(spy).toHaveBeenLastCalledWith(
      storeSessionPath,
      expect.objectContaining({
        assertion: expect.any(String),
        grantType: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        scope: "SiGG profile component",
      }),
      { headers: { "Content-Type": "application/json" } }
    );
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("store files should return null when call POST on files/ storage api fails", async () => {
    expect.assertions(4);

    const spy = jest
      .spyOn(httpService, "post")
      .mockImplementationOnce(() =>
        throwError({ response: { status: 500, statusText: "unexpected" } })
      );

    const spyLogin = jest
      .spyOn(sut, "login")
      .mockImplementationOnce(() =>
        of(expectedStorageSessionsResult).toPromise()
      );

    const storeFilePath = `${process.env.API}storage/v1/stores/distributed/files`;
    const file = {
      buffer: Buffer.from("100"),
      lenght: 3,
      originalname: "yolo",
    };
    const res: StoragePostFilesResponse = await sut.storeFiles(file);
    const expectedResponse = expect.objectContaining({
      _boundary: expect.anything(),
      _streams: expect.arrayContaining([
        expect.stringContaining("yolo"),
        expect.objectContaining({}),
      ]),
      _valueLength: expect.any(Number),
    });
    const expectedHeaderResponse = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "content-type": expect.stringContaining(
          "multipart/form-data; boundary"
        ),
      },
    };
    expect(spyLogin).toHaveBeenCalledTimes(1);
    expect(res).toBeNull();
    expect(spy).toHaveBeenLastCalledWith(
      storeFilePath,
      expectedResponse,
      expectedHeaderResponse
    );
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("put KeyValue should succeed and call storage api, return metadata and return a modifed value", async () => {
    expect.assertions(4);
    const expectedResult: StorageMetadata = {
      name: "my_super_duper.file",
      hash:
        "0x0355a07b257bac3b223bd29b3bd3e24f5a53a84885d8bf36e278be0b45b04555",
      description: "interesting file",
      notarizedAt: new Date(),
      registeredBy: "did:ben:424242424",
      status: 0,
    };

    const result: AxiosResponse = {
      data: { notarisation_docHash: expectedResult },
      status: 200,
      statusText: "",
      headers: {},
      config: {},
    };

    const spy = jest
      .spyOn(httpService, "put")
      .mockImplementationOnce(() => of(result));

    const spyLogin = jest
      .spyOn(sut, "login")
      .mockImplementationOnce(() =>
        of(expectedStorageSessionsResult).toPromise()
      );

    const storeFilePath = `${process.env.API}storage/v1/stores/distributed/key-values/notarisation_${expectedMetaResult.hash}`;
    const res: any = await sut.storeKeyValue(expectedResult);
    expect(spyLogin).toHaveBeenCalledTimes(1);
    expect(res).toStrictEqual({
      notarisation_docHash: expectedResult,
    });
    expect(spy).toHaveBeenLastCalledWith(storeFilePath, expectedResult, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("patch KeyValue should succeed and call storage api with a Json Patch", async () => {
    expect.assertions(5);
    const expectedMetaPatchResult: StorageMetadata = {
      name: "my_super_duper.file",
      hash:
        "0x0355a07b257bac3b223bd29b3bd3e24f5a53a84885d8bf36e278be0b45b04555",
      description: "interesting file",
      notarizedAt: expectedMetaResult.notarizedAt,
      registeredBy: "did:ben:424242424",
      status: 0,
      txHash:
        "0xb5c8bd9430b6cc87a0e2fe110ece6bf527fa4f170a4bc8cd032f768fc5219838",
      blockNumber: 9484688,
    };

    const result: AxiosResponse = {
      data: { notarisation_docHash: expectedMetaPatchResult },
      status: 200,
      statusText: "",
      headers: {},
      config: {},
    };

    const spy = jest
      .spyOn(httpService, "patch")
      .mockImplementationOnce(() => of(result));

    const spyLogin = jest
      .spyOn(sut, "login")
      .mockImplementationOnce(() =>
        of(expectedStorageSessionsResult).toPromise()
      );

    const spyGetKeyValue = jest
      .spyOn(sut, "getKeyValue")
      .mockImplementationOnce(() => of(expectedMetaResult).toPromise());

    const diff = jsonpatch.compare(expectedMetaResult, expectedMetaPatchResult);

    const storeFilePath = `${process.env.API}storage/v1/stores/distributed/key-values/notarisation_${expectedMetaResult.hash}`;
    const res: any = await sut.patchKeyValue(expectedMetaPatchResult);
    expect(spyLogin).toHaveBeenCalledTimes(1);
    expect(spyGetKeyValue).toHaveBeenCalledTimes(1);
    expect(res).toStrictEqual({
      notarisation_docHash: expectedMetaPatchResult,
    });
    expect(spy).toHaveBeenLastCalledWith(storeFilePath, diff, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("patch KeyValue should return null when storage login fails", async () => {
    expect.assertions(2);
    const expectedMetaPatchResult: StorageMetadata = {
      name: "my_super_duper.file",
      hash:
        "0x0355a07b257bac3b223bd29b3bd3e24f5a53a84885d8bf36e278be0b45b04555",
      description: "interesting file",
      notarizedAt: expectedMetaResult.notarizedAt,
      registeredBy: "did:ben:424242424",
      status: 0,
      txHash:
        "0xb5c8bd9430b6cc87a0e2fe110ece6bf527fa4f170a4bc8cd032f768fc5219838",
      blockNumber: 9484688,
    };

    const spyLogin = jest
      .spyOn(sut, "login")
      .mockImplementationOnce(() => of(null).toPromise());

    const res: any = await sut.patchKeyValue(expectedMetaPatchResult);
    expect(spyLogin).toHaveBeenCalledTimes(1);

    expect(res).toBeNull();
  });

  it("patch KeyValue should return null when patch on storage api fails", async () => {
    expect.assertions(5);
    const expectedMetaPatchResult: StorageMetadata = {
      name: "my_super_duper.file",
      hash:
        "0x0355a07b257bac3b223bd29b3bd3e24f5a53a84885d8bf36e278be0b45b04555",
      description: "interesting file",
      notarizedAt: expectedMetaResult.notarizedAt,
      registeredBy: "did:ben:424242424",
      status: 0,
      txHash:
        "0xb5c8bd9430b6cc87a0e2fe110ece6bf527fa4f170a4bc8cd032f768fc5219838",
      blockNumber: 9484688,
    };

    const spy = jest
      .spyOn(httpService, "patch")
      .mockImplementationOnce(() =>
        throwError({ response: { status: 500, statusText: "unexpected" } })
      );

    const spyLogin = jest
      .spyOn(sut, "login")
      .mockImplementationOnce(() =>
        of(expectedStorageSessionsResult).toPromise()
      );

    const spyGetKeyValue = jest
      .spyOn(sut, "getKeyValue")
      .mockImplementationOnce(() => of(expectedMetaResult).toPromise());

    const diff = jsonpatch.compare(expectedMetaResult, expectedMetaPatchResult);

    const storeFilePath = `${process.env.API}storage/v1/stores/distributed/key-values/notarisation_${expectedMetaResult.hash}`;
    const res: any = await sut.patchKeyValue(expectedMetaPatchResult);
    expect(spyLogin).toHaveBeenCalledTimes(1);
    expect(spyGetKeyValue).toHaveBeenCalledTimes(1);
    expect(res).toBeNull();
    expect(spy).toHaveBeenLastCalledWith(storeFilePath, diff, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("get file should succeed and call storage api", async () => {
    expect.assertions(4);
    const fileHash =
      "0xdf7e70e5021544f4834bbee64a9e3789febc4be81470df629cad6ddb03320a5c";

    const result: AxiosResponse = {
      data: {},
      status: 200,
      statusText: "",
      headers: {},
      config: {},
    };

    const spy = jest
      .spyOn(httpService, "get")
      .mockImplementationOnce(() => of(result));

    const spyLogin = jest
      .spyOn(sut, "login")
      .mockImplementationOnce(() =>
        of(expectedStorageSessionsResult).toPromise()
      );

    const storeAPIURL = `${process.env.API}storage/v1/stores/distributed/files/${fileHash}`;
    const res: any = await sut.getFile(fileHash);
    expect(spyLogin).toHaveBeenCalledTimes(1);
    expect(res).toStrictEqual({
      config: expect.any(Object),
      data: expect.any(Object),
      headers: expect.any(Object),
      status: 200,
      statusText: "",
    });
    expect(spy).toHaveBeenLastCalledWith(storeAPIURL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      responseType: "blob",
    });
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
