import { ForbiddenException } from "@nestjs/common";
import { of } from "rxjs";
import HttpForbiddenExceptionFilter from "../../src/filter/http-forbidden-exception.filter";

const requestMock = jest.fn();

const mockHeader = jest.fn();
const mockJson = jest.fn();
const responseMock = () => {
  const res: any = { status: () => {}, json: "", header: mockHeader };
  jest.spyOn(res, "status").mockImplementation().mockReturnValue(res);
  res.json = mockJson;

  return res;
};

const contextMock = (roles?: string[]) => {
  const ctx: any = { switchToHttp: () => {} };
  jest
    .spyOn(ctx, "switchToHttp")
    .mockImplementation()
    .mockReturnValue({
      getRequest: jest.fn().mockReturnValue(requestMock()),
      getResponse: jest.fn().mockReturnValue(responseMock()),
    });
  ctx.getHandler = jest.fn().mockReturnValue({ roles }) as Function;

  return ctx;
};

const ctxMock = contextMock() as any;

describe("httpForbiddenExceptionFilter", () => {
  const filter: HttpForbiddenExceptionFilter = new HttpForbiddenExceptionFilter();

  it("should catch and log the error", () => {
    expect.assertions(7);
    const mockException: ForbiddenException = new ForbiddenException();

    mockException.name = "ForbiddenException";
    jest
      .spyOn(mockException, "getResponse")
      .mockImplementation()
      .mockReturnValue(of("getResponse"));
    mockException.getStatus = () => 403;

    filter.catch(mockException, ctxMock);
    // The first arg of the first call to the function was 'Location
    expect(mockHeader.mock.calls[0][0]).toBe("Location");
    // The second arg of the first call to the function was '...demo'
    expect(mockHeader.mock.calls[0][1]).toContain(`demo`);

    expect(mockJson.mock.calls[0][0]).toMatchObject({
      statusCode: 302,
      path: expect.stringContaining("demo"),
      timestamp: expect.any(String),
    });
    expect(ctxMock.switchToHttp).toHaveBeenCalledWith();
    expect(ctxMock.switchToHttp().getResponse).toHaveBeenCalledWith();
    expect(ctxMock.switchToHttp().getResponse().status).toHaveBeenCalledWith(
      302
    );
    expect(ctxMock.switchToHttp().getResponse().json).toHaveBeenCalledWith({
      path: expect.stringContaining("demo"),
      statusCode: 302,
      timestamp: expect.any(String),
    });
  });
});
