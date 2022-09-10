import React from "react";
import ReactDOM from "react-dom";
import TestRenderer from "react-test-renderer"; // ES6
import { JWT, JWK } from "jose";
import Auth from "../../components/Auth/Auth";
import Main from "./Main";

describe("main", () => {
  const key = JWK.asKey({
    kty: "oct",
    k: "hJtXIZ2uSN5kbQfbtTNWbpdmhkV8FJG-Onbc6mxCcYg",
  });

  const payload = {
    did: "did:sigg:0x1234",
    userName: "test",
  };

  const token = JWT.sign(payload, key, {
    audience: "sigg-wallet",
    expiresIn: "2 hours",
    header: {
      typ: "JWT",
    },
    subject: "test",
  });

  // eslint-disable-next-line jest/no-hooks
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders without crashing", () => {
    expect.assertions(0);

    const div = document.createElement("div");
    ReactDOM.render(
      <Auth>
        <Main />
      </Auth>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders correctly without JWT", () => {
    expect.assertions(1);

    const component = TestRenderer.create(
      <Auth>
        <Main />
      </Auth>
    );
    const json = component.toJSON();

    expect(json).toMatchInlineSnapshot(`
      <div
        className="app"
      >
        <main
          className="main"
        >
          <p
            className="p disclaimer"
          >
            Disclaimer: this is a demo website to show the technical capabilities of the SiGG project.
            <br />
            We are using dummy data.
            <br />
            All the public entities are simulated, there is no real interaction with any of them.
          </p>
          <h1
            className="h1"
          >
            Test SiGG User Journey Demo by taking the following steps in order.
          </h1>
          <ol
            className="ol"
          >
            <li
              className="li"
            >
              <div>
                <div
                  className="panelTitle"
                >
                  European Self-Sovereign Identity (SSID)
                </div>
                <div
                  className="panelBody"
                >
                  <div
                    className="panelImageContainer"
                  >
                    <img
                      alt=""
                      className="panelImage"
                      role="presentation"
                      src="step1.svg"
                    />
                  </div>
                  <div
                    className="panelMainContent"
                  >
                    <h3
                      className="panelBodyTitle"
                    >
                      Create your SiGG Wallet account
                    </h3>
                    <p
                      className="panelBodyText"
                    >
                      Open the SiGG Wallet and authenticate via your EU Login, then setup your SiGG account to follow the user journey. In your wallet, you will create your own Decentralised ID and a set of public-private keys.
                    </p>
                  </div>
                  <div
                    className="panelButtonContainer"
                  >
                    <a
                      className="panelLink"
                      href="https://app.intebsi.xyz/wallet"
                    >
                      Wallet
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li
              className="li disabled"
            >
              <div>
                <div
                  className="panelTitle"
                >
                  ESSIF Sample App: Issue eID Verifiable Credential
                </div>
                <div
                  className="panelBody"
                >
                  <div
                    className="panelImageContainer"
                  >
                    <img
                      alt=""
                      className="panelImage"
                      role="presentation"
                      src="step2.svg"
                    />
                  </div>
                  <div
                    className="panelMainContent"
                  >
                    <h3
                      className="panelBodyTitle"
                    >
                      Get your eID Verifiable Credential
                    </h3>
                    <p
                      className="panelBodyText"
                    >
                      Open a request on the Sample Verifiable ID Issuer website to receive your verifiable ID. The Sample Verifiable ID Issuer verifies the request and issues the ID Verifiable Credential, which will be stored in your wallet. With your digital ID, you will have access to other services on the SiGG platform.
                    </p>
                  </div>
                  <div
                    className="panelButtonContainer"
                  >
                    <a
                      className="panelLink"
                      href="https://app.intebsi.xyz/demo/essif/issue-id"
                    >
                      eID Verifiable Credential
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li
              className="li disabled"
            >
              <div>
                <div
                  className="panelTitle"
                >
                  Diploma Sample App: Issue Bachelor's Diploma
                </div>
                <div
                  className="panelBody"
                >
                  <div
                    className="panelImageContainer"
                  >
                    <img
                      alt=""
                      className="panelImage"
                      role="presentation"
                      src="step3.svg"
                    />
                  </div>
                  <div
                    className="panelMainContent"
                  >
                    <h3
                      className="panelBodyTitle"
                    >
                      Get your Bachelor's Diploma
                    </h3>
                    <p
                      className="panelBodyText"
                    >
                      Open the Sample University - Bachelor's Programme website and make a request to get your Bachelor's Diploma. The Sample University - Bachelor's Programme verifies your request and your Verifiable eID and then issues the Bachelor's Diploma Verifiable Attestation, which will be stored in your wallet.
                    </p>
                  </div>
                  <div
                    className="panelButtonContainer"
                  >
                    <a
                      className="panelLink"
                      href="https://app.intebsi.xyz/demo/diploma/bachelor"
                    >
                      Bachelor's Diploma
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li
              className="li disabled"
            >
              <div>
                <div
                  className="panelTitle"
                >
                  Diploma Sample App: Issue Master's Diploma
                </div>
                <div
                  className="panelBody"
                >
                  <div
                    className="panelImageContainer"
                  >
                    <img
                      alt=""
                      className="panelImage"
                      role="presentation"
                      src="step4.svg"
                    />
                  </div>
                  <div
                    className="panelMainContent"
                  >
                    <h3
                      className="panelBodyTitle"
                    >
                      Get your Master's Diploma
                    </h3>
                    <p
                      className="panelBodyText"
                    >
                      You can apply to a Master's programme at the Sample University - Master's Programme. The university checks your Verifiable eID and your Bachelor's Diploma Verfiable Credential and then accepts you as a registered student. After graduation, you can request your master's diploma. The Sample University - Master's Programme issues the Master's Diploma Verifiable Attestation, which will be stored in your wallet.
                    </p>
                  </div>
                  <div
                    className="panelButtonContainer"
                  >
                    <a
                      className="panelLink"
                      href="https://app.intebsi.xyz/demo/diploma/master"
                    >
                      Master's Diploma
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li
              className="li disabled"
            >
              <div>
                <div
                  className="panelTitle"
                >
                  Notarisation Sample App
                </div>
                <div
                  className="panelBody"
                >
                  <div
                    className="panelImageContainer"
                  >
                    <img
                      alt=""
                      className="panelImage"
                      role="presentation"
                      src="step5.svg"
                    />
                  </div>
                  <div
                    className="panelMainContent"
                  >
                    <h3
                      className="panelBodyTitle"
                    >
                      Notarise your documents
                    </h3>
                    <p
                      className="panelBodyText"
                    >
                      You can participate in a call for proposals, to gain EU funding for your start-up. You can notarise documents and justifying the spending of the grant you received, which can be verified by EU auditors.
                    </p>
                  </div>
                  <div
                    className="panelButtonContainer"
                  >
                    <a
                      className="panelLink"
                      href="https://app.intebsi.xyz/demo/notarisation"
                    >
                      Notarisation
                    </a>
                  </div>
                </div>
              </div>
            </li>
          </ol>
          <p>
            <a
              className="button"
              href="https://app.intebsi.xyz/demo/trusted-data-sharing"
            >
              Trusted Data Sharing Sample App
            </a>
            <a
              className="button"
              href="https://app.intebsi.xyz/wallet/termsAndConditions"
            >
              Terms And Conditions
            </a>
          </p>
        </main>
      </div>
    `);
  });

  it("renders correctly with JWT", () => {
    expect.assertions(1);

    localStorage.setItem("Jwt", token);
    const component = TestRenderer.create(
      <Auth>
        <Main />
      </Auth>
    );
    const json = component.toJSON();

    expect(json).toMatchInlineSnapshot(`
      <div
        className="app"
      >
        <main
          className="main"
        >
          <p
            className="p disclaimer"
          >
            Disclaimer: this is a demo website to show the technical capabilities of the SiGG project.
            <br />
            We are using dummy data.
            <br />
            All the public entities are simulated, there is no real interaction with any of them.
          </p>
          <h1
            className="h1"
          >
            Test SiGG User Journey Demo by taking the following steps in order.
          </h1>
          <ol
            className="ol"
          >
            <li
              className="li done"
            >
              <div>
                <div
                  className="panelTitle"
                >
                  European Self-Sovereign Identity (SSID)
                </div>
                <div
                  className="panelBody"
                >
                  <div
                    className="panelImageContainer"
                  >
                    <img
                      alt=""
                      className="panelImage"
                      role="presentation"
                      src="step1.svg"
                    />
                  </div>
                  <div
                    className="panelMainContent"
                  >
                    <h3
                      className="panelBodyTitle"
                    >
                      Create your SiGG Wallet account
                    </h3>
                    <p
                      className="panelBodyText"
                    >
                      Open the SiGG Wallet and authenticate via your EU Login, then setup your SiGG account to follow the user journey. In your wallet, you will create your own Decentralised ID and a set of public-private keys.
                    </p>
                  </div>
                  <div
                    className="panelButtonContainer"
                  >
                    <a
                      className="panelLink"
                      href="https://app.intebsi.xyz/wallet"
                    >
                      Wallet
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li
              className="li"
            >
              <div>
                <div
                  className="panelTitle"
                >
                  ESSIF Sample App: Issue eID Verifiable Credential
                </div>
                <div
                  className="panelBody"
                >
                  <div
                    className="panelImageContainer"
                  >
                    <img
                      alt=""
                      className="panelImage"
                      role="presentation"
                      src="step2.svg"
                    />
                  </div>
                  <div
                    className="panelMainContent"
                  >
                    <h3
                      className="panelBodyTitle"
                    >
                      Get your eID Verifiable Credential
                    </h3>
                    <p
                      className="panelBodyText"
                    >
                      Open a request on the Sample Verifiable ID Issuer website to receive your verifiable ID. The Sample Verifiable ID Issuer verifies the request and issues the ID Verifiable Credential, which will be stored in your wallet. With your digital ID, you will have access to other services on the SiGG platform.
                    </p>
                  </div>
                  <div
                    className="panelButtonContainer"
                  >
                    <a
                      className="panelLink"
                      href="https://app.intebsi.xyz/demo/essif/issue-id"
                    >
                      eID Verifiable Credential
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li
              className="li disabled"
            >
              <div>
                <div
                  className="panelTitle"
                >
                  Diploma Sample App: Issue Bachelor's Diploma
                </div>
                <div
                  className="panelBody"
                >
                  <div
                    className="panelImageContainer"
                  >
                    <img
                      alt=""
                      className="panelImage"
                      role="presentation"
                      src="step3.svg"
                    />
                  </div>
                  <div
                    className="panelMainContent"
                  >
                    <h3
                      className="panelBodyTitle"
                    >
                      Get your Bachelor's Diploma
                    </h3>
                    <p
                      className="panelBodyText"
                    >
                      Open the Sample University - Bachelor's Programme website and make a request to get your Bachelor's Diploma. The Sample University - Bachelor's Programme verifies your request and your Verifiable eID and then issues the Bachelor's Diploma Verifiable Attestation, which will be stored in your wallet.
                    </p>
                  </div>
                  <div
                    className="panelButtonContainer"
                  >
                    <a
                      className="panelLink"
                      href="https://app.intebsi.xyz/demo/diploma/bachelor"
                    >
                      Bachelor's Diploma
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li
              className="li disabled"
            >
              <div>
                <div
                  className="panelTitle"
                >
                  Diploma Sample App: Issue Master's Diploma
                </div>
                <div
                  className="panelBody"
                >
                  <div
                    className="panelImageContainer"
                  >
                    <img
                      alt=""
                      className="panelImage"
                      role="presentation"
                      src="step4.svg"
                    />
                  </div>
                  <div
                    className="panelMainContent"
                  >
                    <h3
                      className="panelBodyTitle"
                    >
                      Get your Master's Diploma
                    </h3>
                    <p
                      className="panelBodyText"
                    >
                      You can apply to a Master's programme at the Sample University - Master's Programme. The university checks your Verifiable eID and your Bachelor's Diploma Verfiable Credential and then accepts you as a registered student. After graduation, you can request your master's diploma. The Sample University - Master's Programme issues the Master's Diploma Verifiable Attestation, which will be stored in your wallet.
                    </p>
                  </div>
                  <div
                    className="panelButtonContainer"
                  >
                    <a
                      className="panelLink"
                      href="https://app.intebsi.xyz/demo/diploma/master"
                    >
                      Master's Diploma
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li
              className="li disabled"
            >
              <div>
                <div
                  className="panelTitle"
                >
                  Notarisation Sample App
                </div>
                <div
                  className="panelBody"
                >
                  <div
                    className="panelImageContainer"
                  >
                    <img
                      alt=""
                      className="panelImage"
                      role="presentation"
                      src="step5.svg"
                    />
                  </div>
                  <div
                    className="panelMainContent"
                  >
                    <h3
                      className="panelBodyTitle"
                    >
                      Notarise your documents
                    </h3>
                    <p
                      className="panelBodyText"
                    >
                      You can participate in a call for proposals, to gain EU funding for your start-up. You can notarise documents and justifying the spending of the grant you received, which can be verified by EU auditors.
                    </p>
                  </div>
                  <div
                    className="panelButtonContainer"
                  >
                    <a
                      className="panelLink"
                      href="https://app.intebsi.xyz/demo/notarisation"
                    >
                      Notarisation
                    </a>
                  </div>
                </div>
              </div>
            </li>
          </ol>
          <p>
            <button
              className="button"
              onClick={[Function]}
              type="button"
            >
              Restart user journey
            </button>
            <a
              className="button"
              href="https://app.intebsi.xyz/wallet/credentials"
            >
              Your Wallet Credentials
            </a>
            <a
              className="button"
              href="https://app.intebsi.xyz/demo/trusted-data-sharing"
            >
              Trusted Data Sharing Sample App
            </a>
            <a
              className="button"
              href="https://app.intebsi.xyz/wallet/termsAndConditions"
            >
              Terms And Conditions
            </a>
          </p>
        </main>
      </div>
    `);
  });

  it("renders correctly with JWT and eID VC issued", () => {
    expect.assertions(1);

    localStorage.setItem("Jwt", token);
    localStorage.setItem("ESSIF-VC-issued", "yes");
    const component = TestRenderer.create(
      <Auth>
        <Main />
      </Auth>
    );
    const json = component.toJSON();

    expect(json).toMatchInlineSnapshot(`
      <div
        className="app"
      >
        <main
          className="main"
        >
          <p
            className="p disclaimer"
          >
            Disclaimer: this is a demo website to show the technical capabilities of the SiGG project.
            <br />
            We are using dummy data.
            <br />
            All the public entities are simulated, there is no real interaction with any of them.
          </p>
          <h1
            className="h1"
          >
            Test SiGG User Journey Demo by taking the following steps in order.
          </h1>
          <ol
            className="ol"
          >
            <li
              className="li done"
            >
              <div>
                <div
                  className="panelTitle"
                >
                  European Self-Sovereign Identity (SSID)
                </div>
                <div
                  className="panelBody"
                >
                  <div
                    className="panelImageContainer"
                  >
                    <img
                      alt=""
                      className="panelImage"
                      role="presentation"
                      src="step1.svg"
                    />
                  </div>
                  <div
                    className="panelMainContent"
                  >
                    <h3
                      className="panelBodyTitle"
                    >
                      Create your SiGG Wallet account
                    </h3>
                    <p
                      className="panelBodyText"
                    >
                      Open the SiGG Wallet and authenticate via your EU Login, then setup your SiGG account to follow the user journey. In your wallet, you will create your own Decentralised ID and a set of public-private keys.
                    </p>
                  </div>
                  <div
                    className="panelButtonContainer"
                  >
                    <a
                      className="panelLink"
                      href="https://app.intebsi.xyz/wallet"
                    >
                      Wallet
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li
              className="li done"
            >
              <div>
                <div
                  className="panelTitle"
                >
                  ESSIF Sample App: Issue eID Verifiable Credential
                </div>
                <div
                  className="panelBody"
                >
                  <div
                    className="panelImageContainer"
                  >
                    <img
                      alt=""
                      className="panelImage"
                      role="presentation"
                      src="step2.svg"
                    />
                  </div>
                  <div
                    className="panelMainContent"
                  >
                    <h3
                      className="panelBodyTitle"
                    >
                      Get your eID Verifiable Credential
                    </h3>
                    <p
                      className="panelBodyText"
                    >
                      Open a request on the Sample Verifiable ID Issuer website to receive your verifiable ID. The Sample Verifiable ID Issuer verifies the request and issues the ID Verifiable Credential, which will be stored in your wallet. With your digital ID, you will have access to other services on the EBSI platform.
                    </p>
                  </div>
                  <div
                    className="panelButtonContainer"
                  >
                    <a
                      className="panelLink"
                      href="https://app.intebsi.xyz/demo/essif/issue-id"
                    >
                      eID Verifiable Credential
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li
              className="li"
            >
              <div>
                <div
                  className="panelTitle"
                >
                  Diploma Sample App: Issue Bachelor's Diploma
                </div>
                <div
                  className="panelBody"
                >
                  <div
                    className="panelImageContainer"
                  >
                    <img
                      alt=""
                      className="panelImage"
                      role="presentation"
                      src="step3.svg"
                    />
                  </div>
                  <div
                    className="panelMainContent"
                  >
                    <h3
                      className="panelBodyTitle"
                    >
                      Get your Bachelor's Diploma
                    </h3>
                    <p
                      className="panelBodyText"
                    >
                      Open the Sample University - Bachelor's Programme website and make a request to get your Bachelor's Diploma. The Sample University - Bachelor's Programme verifies your request and your Verifiable eID and then issues the Bachelor's Diploma Verifiable Attestation, which will be stored in your wallet.
                    </p>
                  </div>
                  <div
                    className="panelButtonContainer"
                  >
                    <a
                      className="panelLink"
                      href="https://app.intebsi.xyz/demo/diploma/bachelor"
                    >
                      Bachelor's Diploma
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li
              className="li disabled"
            >
              <div>
                <div
                  className="panelTitle"
                >
                  Diploma Sample App: Issue Master's Diploma
                </div>
                <div
                  className="panelBody"
                >
                  <div
                    className="panelImageContainer"
                  >
                    <img
                      alt=""
                      className="panelImage"
                      role="presentation"
                      src="step4.svg"
                    />
                  </div>
                  <div
                    className="panelMainContent"
                  >
                    <h3
                      className="panelBodyTitle"
                    >
                      Get your Master's Diploma
                    </h3>
                    <p
                      className="panelBodyText"
                    >
                      You can apply to a Master's programme at the Sample University - Master's Programme. The university checks your Verifiable eID and your Bachelor's Diploma Verfiable Credential and then accepts you as a registered student. After graduation, you can request your master's diploma. The Sample University - Master's Programme issues the Master's Diploma Verifiable Attestation, which will be stored in your wallet.
                    </p>
                  </div>
                  <div
                    className="panelButtonContainer"
                  >
                    <a
                      className="panelLink"
                      href="https://app.intebsi.xyz/demo/diploma/master"
                    >
                      Master's Diploma
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li
              className="li disabled"
            >
              <div>
                <div
                  className="panelTitle"
                >
                  Notarisation Sample App
                </div>
                <div
                  className="panelBody"
                >
                  <div
                    className="panelImageContainer"
                  >
                    <img
                      alt=""
                      className="panelImage"
                      role="presentation"
                      src="step5.svg"
                    />
                  </div>
                  <div
                    className="panelMainContent"
                  >
                    <h3
                      className="panelBodyTitle"
                    >
                      Notarise your documents
                    </h3>
                    <p
                      className="panelBodyText"
                    >
                      You can participate in a call for proposals, to gain EU funding for your start-up. You can notarise documents and justifying the spending of the grant you received, which can be verified by EU auditors.
                    </p>
                  </div>
                  <div
                    className="panelButtonContainer"
                  >
                    <a
                      className="panelLink"
                      href="https://app.intebsi.xyz/demo/notarisation"
                    >
                      Notarisation
                    </a>
                  </div>
                </div>
              </div>
            </li>
          </ol>
          <p>
            <button
              className="button"
              onClick={[Function]}
              type="button"
            >
              Restart user journey
            </button>
            <a
              className="button"
              href="https://app.intebsi.xyz/wallet/credentials"
            >
              Your Wallet Credentials
            </a>
            <a
              className="button"
              href="https://app.intebsi.xyz/demo/trusted-data-sharing"
            >
              Trusted Data Sharing Sample App
            </a>
            <a
              className="button"
              href="https://app.intebsi.xyz/wallet/termsAndConditions"
            >
              Terms And Conditions
            </a>
          </p>
        </main>
      </div>
    `);
  });

  it("renders correctly with JWT, eID VC and bachelor VA", () => {
    expect.assertions(1);

    localStorage.setItem("Jwt", token);
    localStorage.setItem("ESSIF-VC-issued", "yes");
    localStorage.setItem("Bachelor-VA-issued", "yes");
    const component = TestRenderer.create(
      <Auth>
        <Main />
      </Auth>
    );
    const json = component.toJSON();

    expect(json).toMatchInlineSnapshot(`
      <div
        className="app"
      >
        <main
          className="main"
        >
          <p
            className="p disclaimer"
          >
            Disclaimer: this is a demo website to show the technical capabilities of the SiGG project.
            <br />
            We are using dummy data.
            <br />
            All the public entities are simulated, there is no real interaction with any of them.
          </p>
          <h1
            className="h1"
          >
            Test SiGG User Journey Demo by taking the following steps in order.
          </h1>
          <ol
            className="ol"
          >
            <li
              className="li done"
            >
              <div>
                <div
                  className="panelTitle"
                >
                  European Self-Sovereign Identity (SSID)
                </div>
                <div
                  className="panelBody"
                >
                  <div
                    className="panelImageContainer"
                  >
                    <img
                      alt=""
                      className="panelImage"
                      role="presentation"
                      src="step1.svg"
                    />
                  </div>
                  <div
                    className="panelMainContent"
                  >
                    <h3
                      className="panelBodyTitle"
                    >
                      Create your SiGG Wallet account
                    </h3>
                    <p
                      className="panelBodyText"
                    >
                      Open the SiGG Wallet and authenticate via your EU Login, then setup your SiGG account to follow the user journey. In your wallet, you will create your own Decentralised ID and a set of public-private keys.
                    </p>
                  </div>
                  <div
                    className="panelButtonContainer"
                  >
                    <a
                      className="panelLink"
                      href="https://app.intebsi.xyz/wallet"
                    >
                      Wallet
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li
              className="li done"
            >
              <div>
                <div
                  className="panelTitle"
                >
                  ESSIF Sample App: Issue eID Verifiable Credential
                </div>
                <div
                  className="panelBody"
                >
                  <div
                    className="panelImageContainer"
                  >
                    <img
                      alt=""
                      className="panelImage"
                      role="presentation"
                      src="step2.svg"
                    />
                  </div>
                  <div
                    className="panelMainContent"
                  >
                    <h3
                      className="panelBodyTitle"
                    >
                      Get your eID Verifiable Credential
                    </h3>
                    <p
                      className="panelBodyText"
                    >
                      Open a request on the Sample Verifiable ID Issuer website to receive your verifiable ID. The Sample Verifiable ID Issuer verifies the request and issues the ID Verifiable Credential, which will be stored in your wallet. With your digital ID, you will have access to other services on the EBSI platform.
                    </p>
                  </div>
                  <div
                    className="panelButtonContainer"
                  >
                    <a
                      className="panelLink"
                      href="https://app.intebsi.xyz/demo/essif/issue-id"
                    >
                      eID Verifiable Credential
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li
              className="li done"
            >
              <div>
                <div
                  className="panelTitle"
                >
                  Diploma Sample App: Issue Bachelor's Diploma
                </div>
                <div
                  className="panelBody"
                >
                  <div
                    className="panelImageContainer"
                  >
                    <img
                      alt=""
                      className="panelImage"
                      role="presentation"
                      src="step3.svg"
                    />
                  </div>
                  <div
                    className="panelMainContent"
                  >
                    <h3
                      className="panelBodyTitle"
                    >
                      Get your Bachelor's Diploma
                    </h3>
                    <p
                      className="panelBodyText"
                    >
                      Open the Sample University - Bachelor's Programme website and make a request to get your Bachelor's Diploma. The Sample University - Bachelor's Programme verifies your request and your Verifiable eID and then issues the Bachelor's Diploma Verifiable Attestation, which will be stored in your wallet.
                    </p>
                  </div>
                  <div
                    className="panelButtonContainer"
                  >
                    <a
                      className="panelLink"
                      href="https://app.intebsi.xyz/demo/diploma/bachelor"
                    >
                      Bachelor's Diploma
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li
              className="li"
            >
              <div>
                <div
                  className="panelTitle"
                >
                  Diploma Sample App: Issue Master's Diploma
                </div>
                <div
                  className="panelBody"
                >
                  <div
                    className="panelImageContainer"
                  >
                    <img
                      alt=""
                      className="panelImage"
                      role="presentation"
                      src="step4.svg"
                    />
                  </div>
                  <div
                    className="panelMainContent"
                  >
                    <h3
                      className="panelBodyTitle"
                    >
                      Get your Master's Diploma
                    </h3>
                    <p
                      className="panelBodyText"
                    >
                      You can apply to a Master's programme at the Sample University - Master's Programme. The university checks your Verifiable eID and your Bachelor's Diploma Verfiable Credential and then accepts you as a registered student. After graduation, you can request your master's diploma. The Sample University - Master's Programme issues the Master's Diploma Verifiable Attestation, which will be stored in your wallet.
                    </p>
                  </div>
                  <div
                    className="panelButtonContainer"
                  >
                    <a
                      className="panelLink"
                      href="https://app.intebsi.xyz/demo/diploma/master"
                    >
                      Master's Diploma
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li
              className="li disabled"
            >
              <div>
                <div
                  className="panelTitle"
                >
                  Notarisation Sample App
                </div>
                <div
                  className="panelBody"
                >
                  <div
                    className="panelImageContainer"
                  >
                    <img
                      alt=""
                      className="panelImage"
                      role="presentation"
                      src="step5.svg"
                    />
                  </div>
                  <div
                    className="panelMainContent"
                  >
                    <h3
                      className="panelBodyTitle"
                    >
                      Notarise your documents
                    </h3>
                    <p
                      className="panelBodyText"
                    >
                      You can participate in a call for proposals, to gain EU funding for your start-up. You can notarise documents and justifying the spending of the grant you received, which can be verified by EU auditors.
                    </p>
                  </div>
                  <div
                    className="panelButtonContainer"
                  >
                    <a
                      className="panelLink"
                      href="https://app.intebsi.xyz/demo/notarisation"
                    >
                      Notarisation
                    </a>
                  </div>
                </div>
              </div>
            </li>
          </ol>
          <p>
            <button
              className="button"
              onClick={[Function]}
              type="button"
            >
              Restart user journey
            </button>
            <a
              className="button"
              href="https://app.intebsi.xyz/wallet/credentials"
            >
              Your Wallet Credentials
            </a>
            <a
              className="button"
              href="https://app.intebsi.xyz/demo/trusted-data-sharing"
            >
              Trusted Data Sharing Sample App
            </a>
            <a
              className="button"
              href="https://app.intebsi.xyz/wallet/termsAndConditions"
            >
              Terms And Conditions
            </a>
          </p>
        </main>
      </div>
    `);
  });

  it("renders correctly with JWT, eID VC, bachelor VA and Master VA", () => {
    expect.assertions(2);

    localStorage.setItem("Jwt", token);
    localStorage.setItem("ESSIF-VC-issued", "yes");
    localStorage.setItem("Bachelor-VA-issued", "yes");
    localStorage.setItem("Master-VA-issued", "yes");
    const component = TestRenderer.create(
      <Auth>
        <Main />
      </Auth>
    );
    const json = component.toJSON();

    expect(json).toMatchInlineSnapshot(`
      <div
        className="app"
      >
        <main
          className="main"
        >
          <p
            className="p disclaimer"
          >
            Disclaimer: this is a demo website to show the technical capabilities of the SiGG project.
            <br />
            We are using dummy data.
            <br />
            All the public entities are simulated, there is no real interaction with any of them.
          </p>
          <h1
            className="h1"
          >
            Test SiGG User Journey Demo by taking the following steps in order.
          </h1>
          <ol
            className="ol"
          >
            <li
              className="li done"
            >
              <div>
                <div
                  className="panelTitle"
                >
                  European Self-Sovereign Identity (SSID)
                </div>
                <div
                  className="panelBody"
                >
                  <div
                    className="panelImageContainer"
                  >
                    <img
                      alt=""
                      className="panelImage"
                      role="presentation"
                      src="step1.svg"
                    />
                  </div>
                  <div
                    className="panelMainContent"
                  >
                    <h3
                      className="panelBodyTitle"
                    >
                      Create your SiGG Wallet account
                    </h3>
                    <p
                      className="panelBodyText"
                    >
                      Open the SiGG Wallet and authenticate via your EU Login, then setup your SiGG account to follow the user journey. In your wallet, you will create your own Decentralised ID and a set of public-private keys.
                    </p>
                  </div>
                  <div
                    className="panelButtonContainer"
                  >
                    <a
                      className="panelLink"
                      href="https://app.intebsi.xyz/wallet"
                    >
                      Wallet
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li
              className="li done"
            >
              <div>
                <div
                  className="panelTitle"
                >
                  ESSIF Sample App: Issue eID Verifiable Credential
                </div>
                <div
                  className="panelBody"
                >
                  <div
                    className="panelImageContainer"
                  >
                    <img
                      alt=""
                      className="panelImage"
                      role="presentation"
                      src="step2.svg"
                    />
                  </div>
                  <div
                    className="panelMainContent"
                  >
                    <h3
                      className="panelBodyTitle"
                    >
                      Get your eID Verifiable Credential
                    </h3>
                    <p
                      className="panelBodyText"
                    >
                      Open a request on the Sample Verifiable ID Issuer website to receive your verifiable ID. The Sample Verifiable ID Issuer verifies the request and issues the ID Verifiable Credential, which will be stored in your wallet. With your digital ID, you will have access to other services on the EBSI platform.
                    </p>
                  </div>
                  <div
                    className="panelButtonContainer"
                  >
                    <a
                      className="panelLink"
                      href="https://app.intebsi.xyz/demo/essif/issue-id"
                    >
                      eID Verifiable Credential
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li
              className="li done"
            >
              <div>
                <div
                  className="panelTitle"
                >
                  Diploma Sample App: Issue Bachelor's Diploma
                </div>
                <div
                  className="panelBody"
                >
                  <div
                    className="panelImageContainer"
                  >
                    <img
                      alt=""
                      className="panelImage"
                      role="presentation"
                      src="step3.svg"
                    />
                  </div>
                  <div
                    className="panelMainContent"
                  >
                    <h3
                      className="panelBodyTitle"
                    >
                      Get your Bachelor's Diploma
                    </h3>
                    <p
                      className="panelBodyText"
                    >
                      Open the Sample University - Bachelor's Programme website and make a request to get your Bachelor's Diploma. The Sample University - Bachelor's Programme verifies your request and your Verifiable eID and then issues the Bachelor's Diploma Verifiable Attestation, which will be stored in your wallet.
                    </p>
                  </div>
                  <div
                    className="panelButtonContainer"
                  >
                    <a
                      className="panelLink"
                      href="https://app.intebsi.xyz/demo/diploma/bachelor"
                    >
                      Bachelor's Diploma
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li
              className="li done"
            >
              <div>
                <div
                  className="panelTitle"
                >
                  Diploma Sample App: Issue Master's Diploma
                </div>
                <div
                  className="panelBody"
                >
                  <div
                    className="panelImageContainer"
                  >
                    <img
                      alt=""
                      className="panelImage"
                      role="presentation"
                      src="step4.svg"
                    />
                  </div>
                  <div
                    className="panelMainContent"
                  >
                    <h3
                      className="panelBodyTitle"
                    >
                      Get your Master's Diploma
                    </h3>
                    <p
                      className="panelBodyText"
                    >
                      You can apply to a Master's programme at the Sample University - Master's Programme. The university checks your Verifiable eID and your Bachelor's Diploma Verfiable Credential and then accepts you as a registered student. After graduation, you can request your master's diploma. The Sample University - Master's Programme issues the Master's Diploma Verifiable Attestation, which will be stored in your wallet.
                    </p>
                  </div>
                  <div
                    className="panelButtonContainer"
                  >
                    <a
                      className="panelLink"
                      href="https://app.intebsi.xyz/demo/diploma/master"
                    >
                      Master's Diploma
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li
              className="li"
            >
              <div>
                <div
                  className="panelTitle"
                >
                  Notarisation Sample App
                </div>
                <div
                  className="panelBody"
                >
                  <div
                    className="panelImageContainer"
                  >
                    <img
                      alt=""
                      className="panelImage"
                      role="presentation"
                      src="step5.svg"
                    />
                  </div>
                  <div
                    className="panelMainContent"
                  >
                    <h3
                      className="panelBodyTitle"
                    >
                      Notarise your documents
                    </h3>
                    <p
                      className="panelBodyText"
                    >
                      You can participate in a call for proposals, to gain EU funding for your start-up. You can notarise documents and justifying the spending of the grant you received, which can be verified by EU auditors.
                    </p>
                  </div>
                  <div
                    className="panelButtonContainer"
                  >
                    <a
                      className="panelLink"
                      href="https://app.intebsi.xyz/demo/notarisation"
                    >
                      Notarisation
                    </a>
                  </div>
                </div>
              </div>
            </li>
          </ol>
          <p>
            <button
              className="button"
              onClick={[Function]}
              type="button"
            >
              Restart user journey
            </button>
            <a
              className="button"
              href="https://app.intebsi.xyz/wallet/credentials"
            >
              Your Wallet Credentials
            </a>
            <a
              className="button"
              href="https://app.intebsi.xyz/demo/trusted-data-sharing"
            >
              Trusted Data Sharing Sample App
            </a>
            <a
              className="button"
              href="https://app.intebsi.xyz/wallet/termsAndConditions"
            >
              Terms And Conditions
            </a>
          </p>
        </main>
      </div>
    `);

    // Test click on "Restart user journey"
    const button = component.root.findAllByType("button")[0];
    TestRenderer.act(button.props.onClick);

    expect(component.toJSON()).toMatchInlineSnapshot(`
      <div
        className="app"
      >
        <main
          className="main"
        >
          <p
            className="p disclaimer"
          >
            Disclaimer: this is a demo website to show the technical capabilities of the EBSI project.
            <br />
            We are using dummy data.
            <br />
            All the public entities are simulated, there is no real interaction with any of them.
          </p>
          <h1
            className="h1"
          >
            Test SiGG User Journey Demo by taking the following steps in order.
          </h1>
          <ol
            className="ol"
          >
            <li
              className="li"
            >
              <div>
                <div
                  className="panelTitle"
                >
                  European Self-Sovereign Identity (SSID)
                </div>
                <div
                  className="panelBody"
                >
                  <div
                    className="panelImageContainer"
                  >
                    <img
                      alt=""
                      className="panelImage"
                      role="presentation"
                      src="step1.svg"
                    />
                  </div>
                  <div
                    className="panelMainContent"
                  >
                    <h3
                      className="panelBodyTitle"
                    >
                      Create your SiGG Wallet account
                    </h3>
                    <p
                      className="panelBodyText"
                    >
                      Open the SiGG Wallet and authenticate via your EU Login, then setup your SiGG account to follow the user journey. In your wallet, you will create your own Decentralised ID and a set of public-private keys.
                    </p>
                  </div>
                  <div
                    className="panelButtonContainer"
                  >
                    <a
                      className="panelLink"
                      href="https://app.intebsi.xyz/wallet"
                    >
                      Wallet
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li
              className="li disabled"
            >
              <div>
                <div
                  className="panelTitle"
                >
                  ESSIF Sample App: Issue eID Verifiable Credential
                </div>
                <div
                  className="panelBody"
                >
                  <div
                    className="panelImageContainer"
                  >
                    <img
                      alt=""
                      className="panelImage"
                      role="presentation"
                      src="step2.svg"
                    />
                  </div>
                  <div
                    className="panelMainContent"
                  >
                    <h3
                      className="panelBodyTitle"
                    >
                      Get your eID Verifiable Credential
                    </h3>
                    <p
                      className="panelBodyText"
                    >
                      Open a request on the Sample Verifiable ID Issuer website to receive your verifiable ID. The Sample Verifiable ID Issuer verifies the request and issues the ID Verifiable Credential, which will be stored in your wallet. With your digital ID, you will have access to other services on the EBSI platform.
                    </p>
                  </div>
                  <div
                    className="panelButtonContainer"
                  >
                    <a
                      className="panelLink"
                      href="https://app.intebsi.xyz/demo/essif/issue-id"
                    >
                      eID Verifiable Credential
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li
              className="li disabled"
            >
              <div>
                <div
                  className="panelTitle"
                >
                  Diploma Sample App: Issue Bachelor's Diploma
                </div>
                <div
                  className="panelBody"
                >
                  <div
                    className="panelImageContainer"
                  >
                    <img
                      alt=""
                      className="panelImage"
                      role="presentation"
                      src="step3.svg"
                    />
                  </div>
                  <div
                    className="panelMainContent"
                  >
                    <h3
                      className="panelBodyTitle"
                    >
                      Get your Bachelor's Diploma
                    </h3>
                    <p
                      className="panelBodyText"
                    >
                      Open the Sample University - Bachelor's Programme website and make a request to get your Bachelor's Diploma. The Sample University - Bachelor's Programme verifies your request and your Verifiable eID and then issues the Bachelor's Diploma Verifiable Attestation, which will be stored in your wallet.
                    </p>
                  </div>
                  <div
                    className="panelButtonContainer"
                  >
                    <a
                      className="panelLink"
                      href="https://app.intebsi.xyz/demo/diploma/bachelor"
                    >
                      Bachelor's Diploma
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li
              className="li disabled"
            >
              <div>
                <div
                  className="panelTitle"
                >
                  Diploma Sample App: Issue Master's Diploma
                </div>
                <div
                  className="panelBody"
                >
                  <div
                    className="panelImageContainer"
                  >
                    <img
                      alt=""
                      className="panelImage"
                      role="presentation"
                      src="step4.svg"
                    />
                  </div>
                  <div
                    className="panelMainContent"
                  >
                    <h3
                      className="panelBodyTitle"
                    >
                      Get your Master's Diploma
                    </h3>
                    <p
                      className="panelBodyText"
                    >
                      You can apply to a Master's programme at the Sample University - Master's Programme. The university checks your Verifiable eID and your Bachelor's Diploma Verfiable Credential and then accepts you as a registered student. After graduation, you can request your master's diploma. The Sample University - Master's Programme issues the Master's Diploma Verifiable Attestation, which will be stored in your wallet.
                    </p>
                  </div>
                  <div
                    className="panelButtonContainer"
                  >
                    <a
                      className="panelLink"
                      href="https://app.intebsi.xyz/demo/diploma/master"
                    >
                      Master's Diploma
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li
              className="li disabled"
            >
              <div>
                <div
                  className="panelTitle"
                >
                  Notarisation Sample App
                </div>
                <div
                  className="panelBody"
                >
                  <div
                    className="panelImageContainer"
                  >
                    <img
                      alt=""
                      className="panelImage"
                      role="presentation"
                      src="step5.svg"
                    />
                  </div>
                  <div
                    className="panelMainContent"
                  >
                    <h3
                      className="panelBodyTitle"
                    >
                      Notarise your documents
                    </h3>
                    <p
                      className="panelBodyText"
                    >
                      You can participate in a call for proposals, to gain EU funding for your start-up. You can notarise documents and justifying the spending of the grant you received, which can be verified by EU auditors.
                    </p>
                  </div>
                  <div
                    className="panelButtonContainer"
                  >
                    <a
                      className="panelLink"
                      href="https://app.intebsi.xyz/demo/notarisation"
                    >
                      Notarisation
                    </a>
                  </div>
                </div>
              </div>
            </li>
          </ol>
          <p>
            <a
              className="button"
              href="https://app.intebsi.xyz/demo/trusted-data-sharing"
            >
              Trusted Data Sharing Sample App
            </a>
            <a
              className="button"
              href="https://app.intebsi.xyz/wallet/termsAndConditions"
            >
              Terms And Conditions
            </a>
          </p>
        </main>
      </div>
    `);
  });
});
