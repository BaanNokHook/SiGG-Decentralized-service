import React, { useState, useContext } from "react";
import icons from "@ecl/ec-preset-website/dist/images/icons/sprites/icons.svg";
import { AuthContext } from "../../components/Auth/Auth";
import { H2, P } from "../../components/Typography/Typography";
import {
  REACT_APP_WALLET_WEB_CLIENT_URL,
  REACT_APP_BACKEND_EXTERNAL_URL,
} from "../../env";

const REQUEST_STATUS = {
  NOT_SENT: "",
  PENDING: "pending",
  OK: "ok",
  FAILED: "failed",
};

function IssueVA() {
  const [requestStatus, setRequestStatus] = useState(
    localStorage.getItem("Bachelor-VA-issued") === "yes"
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
          Your Bachelor&apos;s Diploma Verifiable Attestation is on the way.
          Please check your{" "}
          <a
            href={`${REACT_APP_WALLET_WEB_CLIENT_URL}/notifications`}
            className="ecl-link"
          >
            wallet&apos;s notifications
          </a>
          .
        </P>
        <P>
          When you are on the wallet and have completed your tasks there,
          don&apos;t forget to tap on the &quot;SiGG DEMO&quot; link (top right
          corner) to return to the demonstration flow.
        </P>
      </>
    );
  }

  const onIssueVA = () => {
    const requestBody = { did: localStorage.getItem("Bachelor-DID") };

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
      `${REACT_APP_BACKEND_EXTERNAL_URL}/api/bachelors/verifiable-attestations`,
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

        localStorage.setItem("Bachelor-VA-issued", "yes");
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
      <H2>Issue Bachelor&apos;s Diploma Verifiable Attestation</H2>
      <P>
        Your eID Verifiable Credential has been verified. Click on the button
        below to get your Bachelor&apos;s Diploma Verifiable Attestation.
      </P>
      <button
        className="ecl-button ecl-button--call"
        onClick={onIssueVA}
        disabled={requestStatus === REQUEST_STATUS.PENDING}
        type="button"
      >
        {requestStatus === REQUEST_STATUS.PENDING ? (
          <>Sending request...</>
        ) : (
          <>Issue Bachelor&apos;s Diploma Verifiable Attestation</>
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
    </>
  );
}

export default IssueVA;
