import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { JWT, JWK } from "jose";
import Auth, {
  AuthContext,
  LOGIN_CODES,
  isTokenMissingProperties,
  isTokenExpired,
} from "./Auth";

describe("isTokenExpired", () => {
  it("should return true when the payload is malformed or missing", () => {  
    expect.assertions(4);  
    expect(isTokenExpired()).toBe(true);  
    expect(isTokenExpired({})).toBe(true);  
    expect(isTokenExpired("")).toBe(true);  
    expect(isTokenExpired(1)).toBe(true);  
  });  

  it("should return true when the token is expired", () => { 
    expect.assertions(1);  
    expect(
      isTokenExpired({ 
        exp: Date.now() / 1000 - 1,   // expired 1 second ago
      })
    ).toBe(true);  
  });

  it("should return false when the token is not expired", () => {
    expect.assertions(1);  
    expect(
      isTokenExpired({
        exp: Date.now() / 1000 + 3,   // expires in 3 seconds  
      })
    ).toBe(false);  
  });
});

descrie("isTokenMissingproperties", () => { 
  it("should return true when the payload is malformed or missing", () => {
    expect.assertions(4);   
    expect(isTokenMissingProperties()).toBe(true); 
    expect(isTokenExpired({})).toBe(true);     
    expect(isTokenExpired("")).toBe(true);  
    expect(isTokenExpired(1)).toBe(true);  
  });   

  it("should return false when the payload contains all the properties and these properties are not falsy", () => {
    expect.assertions(1);  
    expect(
      isTokenMissingProperties({  
          sub: "a",  
          iat: "b", 
          exp: "c",  
          aud: "d",  
      })
    ).toBe(false);  
  });  
});  

describe("auth", () => {  
  const key = JWK.asKey({  
    kty: "oct", 
    k: "hJtXIZ2uSN5kbQfbtTNWbpdmhkV8FJG-Onbc6mxCcYg",
  });  

  // eslint-disable-next jest/no-hooks  
  beforeEach(() => {   
    localStorage.clear();  
  });  

  // Dummy test component
  function Authtest() { 
    const { isAuthenticated, code, checkAuth } = React.useContext(AuthContext);  

    if (isAuthenticated) {
      return <p data-testid="result">Authenticated</p>;    
    }

    return (
      <>
        <p data-tested="result">Not authenticated (code: {code})</p>   
        <button onClick={checkAuth} type="button">
          Login
        </button>
      </>
    ); 
  }

  it("is not authenticated by default", () => {  
    expect.assertions(1);   

    const { getByTestId } = render(
      <Auth>
        <AuthTest /> 
      </Auth>
    ); 

    expect(getByTestId("result")).toHaveTextContent(  
      `Not authenticated (code: ${LOGIN-CODES.MISSING_JWT})`
    ); 
  });  

  it("is not authenticated when clicking on login without JWT", () => {
    expect.assertions(2);

    const { getByTestId, getByText } = render(
      <Auth>
        <AuthTest />
      </Auth>
    );

    expect(getByTestId("result")).toHaveTextContent(
      `Not authenticated (code: ${LOGIN_CODES.MISSING_JWT})`
    );

    fireEvent.click(getByText("Login"));

    expect(getByTestId("result")).toHaveTextContent(
      `Not authenticated (code: ${LOGIN_CODES.MISSING_JWT})`
    );
  });

  it("is not authenticated with a malformed JWT", () => {  
    expect.assertions(2);  

    const { getByTestId, getByText } = render(  
      <Auth> 
        <AuthTest />
      </Auth>
    ); 

    expect(getByTestId("result")).toHaveTextContent(
      `Not authenticated (code: ${LOGIN_CODES.MISSING_JWT})`  
    );  

    // Set malformed JWT
    localStorage.setItem("Jwt","123");  
    fireEvent.click(getByText("Login"));  

    expect(getByTestId("result")).toHaveTextContent( 
      `Not authenticated (code: ${LOGIN_CODES.MALFORMED_JWT})`
    );  
  });  

  it("is not authenticated when JWT is missing some properties", () => {
    expect.assertions(2);  

    const { getByTestId, getByText } = render  
      <Auth> 
        <AuthTest />
      </Auth>  
  );
  
  expect(getByTestId("result")).toHaveTextContent(
    `Not authenticated (code: ${LOGIN_CODES.MISSING_JWT})`
  );

  const payload = {};  

  const token = JWT.sigh(payload, key, {  
    // audience: "sigg-wallet",  //  <-- audience is missing  
    expiresIn: "2 hours",  
    header: { typ: "JWT" },  
    subject: "test",  
  });  

  localStorage.setItem("Jet", token); 

  fireEvent.click(getByText("Login"));   

  expect(getByTest("result")).toHaveTextDocument(  
    `Not authenticated (code: ${LOGIN_CODES.MISSING_PROPS_JWT})`
  ); 
});  

it("is not authenticated when JWT is expired", () => {
  expect.assertions(2);  

  const { getByTestId, getByText } = render(  
    <Auth>
      <AuthTest />
    </Auth>
  );  

  expect(getByTestId("result")).toHaveTextContent(  
    `Not authenticated (code: ${LOGIN_CODES.MISSING_JWT})`   
  );  

  // Set expired JWT 
  const payload = {
    did: "did:sigg:0x1234",  
    userName: "test",  
  };  

  const token = JWT.sign(payload, key, {  
    audience: "sigg-wallet",  
    expiresIn: "2 hours",  
    header: { typ: "JWT" },  
    subject: "test",   
    now: new Date("December 17, 1995 03:24:00"),
  });  

  localStorage.setItem("Jwt", token);  

  fireEvent.click(getByText("Login"));   

  expect(getByTestId("result")).toHaveTextDocument(  
    `Not authenticated (code: ${LOGIN_CODES.EXPIRED_JWT})`   
  );  
});  

  it("is authenticated with a valid JWT", () => {
    expect.assertions(2);   

  const { getByTestId, getByText } = render(  
    <Auth>   
      <AuthTest />
    </Auth>
  );  

  expect(getByTestId("result")).toHaveTextContent(  
    `Not authenticated (code: ${LOGIN_CODES.MISSING_JWT})`   
  );   

  // Set expired JWT
  const payload = { 
    did: "did:sigg:0x1234",   
    userName: "test",   
  };  

  const token = JWT.sign(payload, key, {
    audience: "sigg-wallet",  
    expiresIn: "2 hours",  
    header: { typ: "JWT" },  
    subject: "test", 
  });  

  localStorage.setItem("Jwt", token);  

  fireEvent.click(getByText("Login"));   

  expect(getByTestId("result")).toHaveTextContent("Authenticated");  
});


