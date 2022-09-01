import React, { useState, useContext } from "react";
import icons from "@ecl/ec-preset-website/dist/images/icons/sprites/icons.svg";
import { AuthContext } from "../../components/Auth/Auth";
import { H2, P } from "../../components/Typography/Typography";
import {
  REACT_APP_WALLET_WEB_CLIENT_URL,
  REACT_APP_BACKEND_EXTERNAL_URL,
  PUBLIC_URL,
} from "../../env";

const REQUEST_STATUS = {
  NOT_SENT: "",
  PENDING: "pending",
  OK: "ok",
  FAILED: "failed",
};

function RequestVA() {
  const [requestStatus, setRequestStatus] = useState(
    localStorage.getItem("Bachelor-VA-requested") === "yes"
      ? REQUEST_STATUS.OK
      : REQUEST_STATUS.NOT_SENT
  );

  const { rawJWT } = useContext(AuthContext);

  if (requestStatus === REQUEST_STATUS.OK) {
    return (
      <>
        <h1 className="ecl-page-header-harmonised__title ecl-u-mt-xl ecl-u-mb-xl">
          Bachelor&apos;s Diploma
        </h1>
        <P>
          A request to present your eID Verifiable Credential has been sent.
          Please check your{" "}
          <a
            href={`${REACT_APP_WALLET_WEB_CLIENT_URL}/notifications`}
            className="ecl-link"
          >
            wallet&apos;s notifications
          </a>{" "}
          and approve the request, so that the Sample University -
          Bachelor&apos;s Programme can verify your identity and send you your
          Bachelor&apos;s Diploma Verifiable Attestation.
        </P>
      </>
    );
  }

  const onRequestVA = () => {
    let origin = PUBLIC_URL;

    // When PUBLIC_URL doesn't start with the origin
    if (!origin.startsWith("http")) {
      origin = window.location.origin + origin;
    }

    const requestBody = {
      redirectURL: `${origin}/issue-va`,
      did: localStorage.getItem("Bachelor-DID"),
    };

    const requestHeaders = new Headers();
    requestHeaders.append("Content-Type", "application/json");
    requestHeaders.append("Authorization", `Bearer ${rawJWT}`);

    const requestOptions = {
      method: "POST",
      headers: requestHeaders,
      body: JSON.stringify(requestBody),
    };

    setRequestStatus(REQUEST_STATUS.PENDING);

    fetch(
      `${REACT_APP_BACKEND_EXTERNAL_URL}/api/bachelors/presentation-requests`,
      requestOptions
    )
      .then((response) => {
        if (response.status !== 201) {
          return Promise.reject(
            new Error(
              `Looks like there was a problem. Status Code: ${response.status}`
            )
          );
        }

        localStorage.setItem("Bachelor-VA-requested", "yes");
        return setRequestStatus(REQUEST_STATUS.OK);
      })
      .catch(() => {
        setRequestStatus(REQUEST_STATUS.FAILED);
      });
  };

  return (
    <>
      <h1 className="ecl-page-header-harmonised__title ecl-u-mt-xl ecl-u-mb-xl">
        Bachelor&apos;s Diploma
      </h1>
      <P>Congratulations, your Bachelor&apos;s Diploma is now available!</P>
      <H2>Present your eID Verifiable Credential</H2>
      <P>
        When you click on the button below, the Sample University -
        Bachelor&apos;s Programme generates a request for your eID Verifiable
        Credential. You will be redirected to your wallet where you will be
        asked to share your eID Verifiable Credential with the Sample University
        - Bachelor&apos;s Programme.
      </P>
      <button
        type="button"
        className="ecl-button ecl-button--call"
        variant="primary"
        onClick={onRequestVA}
        disabled={requestStatus === REQUEST_STATUS.PENDING}
      >
        {requestStatus === REQUEST_STATUS.PENDING ? (
          <>Sending request...</>
        ) : (
          <>Present eID VC</>
        )}
      </button>
      {requestStatus === REQUEST_STATUS.FAILED && (
        <div
          role="alert"
          className="ecl-message ecl-message--error ecl-u-mt-xl"
          data-ecl-message="true"
        >
          <svg
            focusable="false"
            aria-hidden="true"
            className="ecl-message__icon ecl-icon ecl-icon--l"
          >
            <use xlinkHref={`${icons}#notifications--error`} />
          </svg>
          <div className="ecl-message__content">
            <div className="ecl-message__title">
              Ouch! Something went wrong...
            </div>
            <p className="ecl-message__description">
              Please contact the site administrators to find out what happened.
            </p>
          </div>
        </div>
      )}
      <P>
        If you agree to share your eID VC and if it passes the validation
        process, the Sample University - Bachelor&apos;s Programme will create
        your Bachelor&apos;s Diploma Verifiable Attestation. It uses the eIDAS
        Bridge to eSeal it. When it&apos;s ready, you will receive a
        notification in your wallet.
      </P>
    </>
  );
}

export default RequestVA;
