import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { H2, P, UL, LI } from "../../components/Typography/Typography";
import { AuthContext } from "../../components/Auth/Auth";
import { REACT_APP_WALLET_WEB_CLIENT_URL } from "../../env";

function Homepage() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <>
      <h1 className="ecl-page-header-harmonised__title ecl-u-mt-xl">
        Landing page
      </h1>
      <p className="ecl-page-header-harmonised__description ecl-u-mb-xl">
        Disclaimer: this is a demo website to show the technical capabilities of
        the SiGG project.
      </p>
      <P>Prerequisites:</P>
      <UL>
        <LI>The user must have created a wallet.</LI>
        <LI>The user must be logged in the SiGG Wallet using EU Login.</LI>
        <LI>
          The user must have requested her eID Verifiable Credential from the
          Sample Verifiable ID Issuer.
        </LI>
      </UL>
      {(() => {
        if (localStorage.getItem("Bachelor-VA-issued") === "yes") {
          return (
            <>
              <H2>Well done!</H2>
              <P>
                Your Bachelor&apos;s Diploma Verifiable Attestation is on the
                way. Please check your{" "}
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

        if (localStorage.getItem("Bachelor-VA-requested") === "yes") {
          return (
            <>
              <H2>
                Step 3: issue Bachelor&apos;s Diploma Verifiable Attestation
              </H2>
              <P>
                The eID Verifiable Credential presentation request has been sent
                to your wallet.
              </P>
              <P>
                If you have agreed to present it, please continue to the{" "}
                <Link to="/issue-va" className="ecl-link">
                  Bachelor&apos;s Diploma Issuance page
                </Link>
                .
              </P>
            </>
          );
        }

        if (isAuthenticated) {
          return (
            <>
              <H2>Step 2: present your eID VC</H2>
              <P>
                You are now logged in. The Sample University - Bachelor&apos;s
                Programme can now issue your Bachelor&apos;s Diploma Verifiable
                Attestation after verifying your eID VC.
              </P>
              <P>
                Now go to the{" "}
                <Link to="/request-va" className="ecl-link">
                  Bachelor&apos;s Diploma page
                </Link>
                .
              </P>
            </>
          );
        }

        return (
          <>
            <H2>Step 1: log in</H2>
            <P>
              To get started, please{" "}
              <Link to="/login" className="ecl-link">
                log in
              </Link>
              .
            </P>
          </>
        );
      })()}
    </>
  );
}

export default Homepage;
