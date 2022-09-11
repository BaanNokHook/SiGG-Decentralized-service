import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import JwtGuard from "../../src/guards/jwt.guard";
import JwtService from "../../src/services/jwt.service";
import { JwtPayload } from "../../src/types/jwt.payload";

jest.mock("../../src/services/jwt.service"); // SoundPlayer is now a mock constructor

describe("jwt guard", () => {
  let jwtService: JwtService;
  // eslint-disable-next-line jest/no-hooks
  beforeEach(async () => {
    const extractPayloadFromTokenMock = jest.fn(() => {
      const res: JwtPayload = { did: "did:ff" };
      return res;
    });
    const jwtServiceFactory = jest.fn<Partial<JwtService>, []>(() => ({
      extractPayloadFromToken: extractPayloadFromTokenMock,
    }));
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [{ provide: JwtService, useClass: jwtServiceFactory }],
    }).compile();

    jwtService = moduleFixture.get<JwtService>(JwtService);
  });

  // eslint-disable-next-line jest/no-hooks
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should throw when body is missing credentials run can activate", () => {
    expect.assertions(6);
    const assertGuardThrow = (body: any) => {
      const getRequest = jest.fn().mockReturnValueOnce({ body });
      const switchToHttp = jest.fn(() => {
        return {
          getRequest,
          getResponse: jest.fn(),
          getNext: jest.fn(),
        };
      });
      const executionContextMock: ExecutionContext = {
        switchToHttp,
        switchToWs: jest.fn(),
        switchToRpc: jest.fn(),
        getClass: jest.fn(),
        getArgByIndex: jest.fn(),
        getArgs: jest.fn(),
        getType: jest.fn(),
        getHandler: jest.fn(),
      };

      const jGuard = new JwtGuard(jwtService as any);
      expect(() => jGuard.canActivate(executionContextMock)).toThrow(
        new UnauthorizedException("invalid user credentials")
      );
      expect(getRequest).toHaveBeenCalledTimes(1);
    };
    assertGuardThrow({});
    assertGuardThrow({
      did: "did:SiGG:0x9eb7D9A8Efce895774c7dE37Ee651f1aFC6A33D6",
    });
    assertGuardThrow({
      jwt:
        "eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QiLCJraWQiOiJlYnNpLXdhbGxldCJ9.eyJzdWIiOiJtYXRlb2JlIiwiZGlkIjoiZGlkOmVic2k6MHg5ZWI3RDlBOEVmY2U4OTU3NzRjN2RFMzdFZTY1MWYxYUZDNkEzM0Q2IiwidXNlck5hbWUiOiJCZW5qYW1pbiZNQVRFTyIsImlhdCI6MTU4OTk4NDU0NCwiZXhwIjoxNTg5OTg1NDQ0LCJhdWQiOiJlYnNpLXdhbGxldCJ9.9-7gSXd-jIHftXJwM10vUADWXR55BiEtfCyZetE0TLGVMVi2GsPRTmKMVG1ZR-EX1hwIWntGMNdTk7wT1GvERQ",
    });
  });

  it("should pass if body contains jwt and did", () => {
    expect.assertions(2);
    const body = {
      did: "did:SiGG:0x9eb7D9A8Efce895774c7dE37Ee651f1aFC6A33D6",
      jwt:
        "eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QiLCJraWQiOiJlYnNpLXdhbGxldCJ9.eyJzdWIiOiJtYXRlb2JlIiwiZGlkIjoiZGlkOmVic2k6MHg5ZWI3RDlBOEVmY2U4OTU3NzRjN2RFMzdFZTY1MWYxYUZDNkEzM0Q2IiwidXNlck5hbWUiOiJCZW5qYW1pbiZNQVRFTyIsImlhdCI6MTU4OTk4NDU0NCwiZXhwIjoxNTg5OTg1NDQ0LCJhdWQiOiJlYnNpLXdhbGxldCJ9.9-7gSXd-jIHftXJwM10vUADWXR55BiEtfCyZetE0TLGVMVi2GsPRTmKMVG1ZR-EX1hwIWntGMNdTk7wT1GvERQ",
    };
    const getRequest = jest.fn().mockReturnValueOnce({ body });
    const switchToHttp = jest.fn(() => {
      return {
        getRequest,
        getResponse: jest.fn(),
        getNext: jest.fn(),
      };
    });
    const executionContextMock: ExecutionContext = {
      switchToHttp,
      switchToWs: jest.fn(),
      switchToRpc: jest.fn(),
      getClass: jest.fn(),
      getArgByIndex: jest.fn(),
      getArgs: jest.fn(),
      getType: jest.fn(),
      getHandler: jest.fn(),
    };

    const jGuard = new JwtGuard(jwtService);
    jGuard.canActivate(executionContextMock);
    expect(jwtService.extractPayloadFromToken).toHaveBeenCalledTimes(1);
    expect(getRequest).toHaveBeenCalledTimes(1);
  });
});
