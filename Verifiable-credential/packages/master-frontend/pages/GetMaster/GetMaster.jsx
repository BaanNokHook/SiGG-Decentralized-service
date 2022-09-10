import React, { useState, useContext } from "react";
import icons from "@ecl/ec-preset-website/dist/images/icons/sprites/icons.svg";
import { AuthContext } from "../../components/Auth/Auth";
import { P } from "../../components/Typography/Typography";
import styles from "./GetMaster.module.css";
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

function GetMaster() {
  const [requestStatus, setRequestStatus] = useState(
    localStorage.getItem("Master-VA-issued") === "yes"
      ? REQUEST_STATUS.OK
      : REQUEST_STATUS.NOT_SENT
  );

  const { rawJWT } = useContext(AuthContext);

  const onRequestMaster = () => {
    const requestBody = { did: localStorage.getItem("Master-DID") };

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
      `${REACT_APP_BACKEND_EXTERNAL_URL}/api/masters/verifiable-attestations`,
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

        localStorage.setItem("Master-VA-issued", "yes");
        return setRequestStatus(REQUEST_STATUS.OK);
      })
      .catch(() => {
        setRequestStatus(REQUEST_STATUS.FAILED);
      });
  };

  return (
    <>
      <h1 className="ecl-page-header-harmonised__title ecl-u-mt-xl ecl-u-mb-xl">
        Master&apos;s Degree in Computer Security Engineering and AI
      </h1>
      {(() => {
        if (requestStatus === REQUEST_STATUS.OK) {
          return (
            <>
              <P>
                Your Master&apos;s Degree has been sent. Please check your{" "}
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
                don&apos;t forget to tap on the &quot;SiGG DEMO&quot; link (top
                right corner) to return to the demonstration flow.
              </P>
            </>
          );
        }

        return (
          <>
            <P className={styles.intro}>
              Your Master&apos;s Degree is available.
            </P>
            <button
              type="button"
              className="ecl-button ecl-button--call"
              onClick={onRequestMaster}
              disabled={requestStatus === REQUEST_STATUS.PENDING}
            >
              {requestStatus === REQUEST_STATUS.PENDING ? (
                <>Sending request...</>
              ) : (
                <>Get your Master&apos;s Degree</>
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
                    Please contact the site administrators to find out what
                    happened.
                  </p>
                </div>
              </div>
            )}
          </>
        );
      })()}
    </>
  );
}

export default GetMaster;
