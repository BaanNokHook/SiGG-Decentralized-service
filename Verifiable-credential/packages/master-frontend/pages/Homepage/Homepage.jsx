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
        <LI>
          The user must have request a Verifiable Attestation of her
          Bachelor&apos;s Diploma from the Sample University - Bachelor&apos;s
          Programme.
        </LI>
      </UL>
      {(() => {
        if (localStorage.getItem("Master-VA-issued") === "yes") {
          return (
            <>
              <H2>Well done!</H2>
              <P>
                Your Master&apos;s Degree Verifiable Attestation is on the way.
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
                don&apos;t forget to tap on the &quot;SiGG DEMO&quot; link (top
                right corner) to return to the demonstration flow.
              </P>
            </>
          );
        }

        if (localStorage.getItem("Master-VA-issued") === "yes") {
          return (
            <>
              <H2>Step 3: Get your Master</H2>
              <P>
                If you have shared your eID Verifiable Credential and
                Bachelor&apos;s Diploma, go to{" "}
                <Link to="/get-master" className="ecl-link">
                  Master&apos;s Degree page
                </Link>
                .
              </P>
            </>
          );
        }

        if (isAuthenticated) {
          return (
            <>
              <H2>Step 2: Apply to Master&apos;s Degree</H2>
              <P>You are now logged in.</P>
              <P>
                Now go to the{" "}
                <Link to="/apply-master" className="ecl-link">
                  Master&apos;s Degree page
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
