import React, { useState, useContext } from "react";
import icons from "@ecl/ec-preset-website/dist/images/icons/sprites/icons.svg";
import { AuthContext } from "../../components/Auth/Auth";
import { H2, P } from "../../components/Typography/Typography";
import styles from "./ApplyMaster.module.css";
import mastersIllustration from "../../assets/images/masters.jpg";
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

function ApplyMaster() {
  const [requestStatus, setRequestStatus] = useState(
    localStorage.getItem("Master-VA-requested") === "yes"
      ? REQUEST_STATUS.OK
      : REQUEST_STATUS.NOT_SENT
  );

  const { rawJWT } = useContext(AuthContext);

  const onApplyToMaster = () => {
    let origin = PUBLIC_URL;

    // When PUBLIC_URL doesn't start with the origin
    if (!origin.startsWith("http")) {
      origin = window.location.origin + origin;
    }

    const requestBody = {
      redirectURL: `${origin}/get-master`,
      did: localStorage.getItem("Master-DID"),
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
      `${REACT_APP_BACKEND_EXTERNAL_URL}/api/masters/presentation-requests`,
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

        localStorage.setItem("Master-VA-requested", "yes");
        return setRequestStatus(REQUEST_STATUS.OK);
      })
      .catch(() => {
        setRequestStatus(REQUEST_STATUS.FAILED);
      });
  };

  return (
    <>
      <div className="ecl-row ecl-u-mt-xl">
        <div className="ecl-col-md-6">
          <h1 className="ecl-page-header-harmonised__title">
            Master&apos;s Degree in Computer Security Engineering and AI
          </h1>
        </div>
        <div className="ecl-col-md-6 ecl-u-d-none ecl-u-d-md-block">
          <img
            src={mastersIllustration}
            role="presentation"
            alt=""
            className={styles.illustration}
          />
        </div>
      </div>
      <div className="ecl-row ecl-u-mt-xl">
        <div className="ecl-col-md-6">
          <dl className="ecl-description-list ecl-description-list--horizontal">
            <dt className="ecl-description-list__term">Duration</dt>
            <dd className="ecl-description-list__definition">90 ECTS</dd>
            <dt className="ecl-description-list__term">Places available</dt>
            <dd className="ecl-description-list__definition">50</dd>
            <dt className="ecl-description-list__term">Type</dt>
            <dd className="ecl-description-list__definition">Face-to-face</dd>
            <dt className="ecl-description-list__term">
              Language of instruction
            </dt>
            <dd className="ecl-description-list__definition">English</dd>
            <dt className="ecl-description-list__term">Course date</dt>
            <dd className="ecl-description-list__definition">
              First semester: September-January
              <br /> Second semester: February-June
            </dd>
          </dl>
        </div>
        <div className="ecl-col-md-6 ecl-u-order-md-first ecl-u-mt-xl ecl-u-mt-md-none">
          {(() => {
            if (requestStatus === REQUEST_STATUS.OK) {
              return (
                <>
                  <P>
                    Your application has been sent. Please check your{" "}
                    <a
                      href={`${REACT_APP_WALLET_WEB_CLIENT_URL}/notifications`}
                      className="ecl-link"
                    >
                      wallet&apos;s notifications
                    </a>
                    .
                  </P>
                </>
              );
            }

            return (
              <>
                <P className="ecl-u-mt-none">
                  This Master&apos;s Degree prepares students to undertake tasks
                  of responsibility in industries, the administration, or the
                  national and international academic world. The programme
                  covers many research issues regarding the design, analysis and
                  use of artificial intelligence systems. The main aim is to
                  train computer specialists in the field of intelligent
                  systems. Students will also be able to provide solutions to
                  highly technical problems that require a certain amount of
                  innovation or research.
                </P>
                <H2>Admission</H2>
                <P>
                  Your application and documentation will be reviewed to
                  determine whether you should be admitted to the Master&apos;s
                  programme.
                </P>
                <button
                  type="button"
                  className="ecl-button ecl-button--call"
                  onClick={onApplyToMaster}
                  disabled={requestStatus === REQUEST_STATUS.PENDING}
                >
                  {requestStatus === REQUEST_STATUS.PENDING ? (
                    <>Sending request...</>
                  ) : (
                    <>Apply to Master&apos;s Degree</>
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
        </div>
      </div>
    </>
  );
}

export default ApplyMaster;
