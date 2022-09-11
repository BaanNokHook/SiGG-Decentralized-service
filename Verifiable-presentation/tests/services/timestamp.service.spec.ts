import { Test } from "@nestjs/testing";
import { HttpService, HttpModule } from "@nestjs/common";
import { of, throwError } from "rxjs";
import { AxiosResponse } from "axios";
import { ConfigModule } from "@nestjs/config";
import { TimestampResponse } from "../../src/types/timestamp.response";
import TimestampService from "../../src/services/timestamp.service";

describe("timestampService", () => {
  let sut: TimestampService;
  let httpService: HttpService;

  // eslint-disable-next-line jest/no-hooks
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        HttpModule,
        ConfigModule.forRoot({
          envFilePath: [".env"],
        }),
      ],
      providers: [TimestampService],
    }).compile();

    httpService = module.get<HttpService>(HttpService);
    sut = module.get<TimestampService>(TimestampService);
  });
  // eslint-disable-next-line jest/no-hooks
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should be defined", () => {
    expect.assertions(1);
    expect(sut).toBeDefined();
  });

  it("getTimestamp should call timestamp api", async () => {
    expect.assertions(3);
    const expectedResult: TimestampResponse = {
      hash: "string",
      txHash: "string",
      timestamp: new Date(),
      registeredBy: "string",
      blockNumber: 8,
    };
    const result: AxiosResponse = {
      data: expectedResult,
      status: 200,
      statusText: "",
      headers: {},
      config: {},
    };
    const hash = "0x56464sf654d6f4s654";
    const spy = jest
      .spyOn(httpService, "get")
      .mockImplementationOnce(() => of(result));
    expect(await sut.getTimestamp(hash)).toStrictEqual(expectedResult);
    expect(spy).toHaveBeenLastCalledWith(
      `${process.env.API}timestamp/v1/hashes/${hash}`
    );
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("getTimestamp should  return null when call timestamp api is on error", async () => {
    expect.assertions(3);
    const hash = "0x56464sf654d6f4s654";
    const spy = jest.spyOn(httpService, "get").mockImplementationOnce(() => {
      return throwError(new Error("oops!"));
    });
    expect(await sut.getTimestamp(hash)).toBeNull();
    expect(spy).toHaveBeenLastCalledWith(
      `${process.env.API}timestamp/v1/hashes/${hash}`
    );
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
