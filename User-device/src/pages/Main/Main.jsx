/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../components/Auth/Auth";
import styles from "./Main.module.css";
import {
  REACT_APP_WALLET_WEB_CLIENT_URL,
  REACT_APP_SELF_SOVEREIGN_IDENTITY_URL,
  REACT_APP_DIPLOMA_BACHELOR_URL,
  REACT_APP_DIPLOMA_MASTER_URL,
  REACT_APP_NOTARISATION_URL,
  REACT_APP_TRUSTED_DATA_SHARING_URL,
} from "../../env";
import { Panel, PanelTitle, PanelBody } from "../../components/Panel/Panel";
import step1SVG from "../../assets/step1.svg";
import step2SVG from "../../assets/step2.svg";
import step3SVG from "../../assets/step3.svg";
import step4SVG from "../../assets/step4.svg";
import step5SVG from "../../assets/step5.svg";

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }

    return () => {};
  }, [delay]);
}

function checkEIDVC() {
  return localStorage.getItem("ESSIF-VC-issued") === "yes";
}

function checkBachelorVA() {
  return localStorage.getItem("Bachelor-VA-issued") === "yes";
}

function checkMasterVA() {
  return localStorage.getItem("Master-VA-issued") === "yes";
}

function Main() {
  const { isAuthenticated, checkAuth } = useContext(AuthContext);
  const [hasEIDVC, setHasEIDVC] = useState(checkEIDVC());
  const [hasBachelorVA, setHasBachelorVA] = useState(checkBachelorVA());
  const [hasMaster, setHasMaster] = useState(checkMasterVA());

  function updateState() {
    checkAuth();
    setHasEIDVC(checkEIDVC());
    setHasBachelorVA(checkBachelorVA);
    setHasMaster(checkMasterVA());
  }

  function restart() {
    localStorage.clear();
    updateState();
  }

  // Check status every 3 seconds
  useInterval(updateState, 3000);

  return (
    <div className={styles.app}>
      <main className={styles.main}>
        <p className={`${styles.p} ${styles.disclaimer}`}>
          Disclaimer: this is a demo website to show the technical capabilities
          of the SiGG project.
          <br />
          We are using dummy data.
          <br />
          All the public entities are simulated, there is no real interaction
          with any of them.
        </p>
        <h1 className={styles.h1}>
          Test SiGG User Journey Demo by taking the following steps in order.
        </h1>
        <ol className={styles.ol}>
          <li
            className={styles.li}
            {...(isAuthenticated && {
              className: `${styles.li} ${styles.done}`,
            })}
          >
            <Panel>
              <PanelTitle>European Self-Sovereign Identity (SSID)</PanelTitle>
              <PanelBody
                icon={step1SVG}
                title="Create your SiGG Wallet account"
                link={REACT_APP_WALLET_WEB_CLIENT_URL}
                linkLabel="Wallet"
              >
                Open the SiGG Wallet and authenticate via your EU Login, then
                setup your SiGG account to follow the user journey. In your
                wallet, you will create your own Decentralised ID and a set of
                public-private keys.
              </PanelBody>
            </Panel>
          </li>
          <li
            className={styles.li}
            {...(!isAuthenticated && {
              className: `${styles.li} ${styles.disabled}`,
            })}
            {...(hasEIDVC && { className: `${styles.li} ${styles.done}` })}
          >
            <Panel>
              <PanelTitle>
                ESSIF Sample App: Issue eID Verifiable Credential
              </PanelTitle>
              <PanelBody
                icon={step2SVG}
                title="Get your eID Verifiable Credential"
                link={REACT_APP_SELF_SOVEREIGN_IDENTITY_URL}
                linkLabel="eID Verifiable Credential"
              >
                Open a request on the Sample Verifiable ID Issuer website to
                receive your verifiable ID. The Sample Verifiable ID Issuer
                verifies the request and issues the ID Verifiable Credential,
                which will be stored in your wallet. With your digital ID, you
                will have access to other services on the SiGG platform.
              </PanelBody>
            </Panel>
          </li>
          <li
            className={styles.li}
            {...(!(isAuthenticated && hasEIDVC) && {
              className: `${styles.li} ${styles.disabled}`,
            })}
            {...(hasBachelorVA && { className: `${styles.li} ${styles.done}` })}
          >
            <Panel>
              <PanelTitle>
                Diploma Sample App: Issue Bachelor&apos;s Diploma
              </PanelTitle>
              <PanelBody
                icon={step3SVG}
                title="Get your Bachelor's Diploma"
                link={REACT_APP_DIPLOMA_BACHELOR_URL}
                linkLabel="Bachelor's Diploma"
              >
                Open the Sample University - Bachelor&apos;s Programme website
                and make a request to get your Bachelor&apos;s Diploma. The
                Sample University - Bachelor&apos;s Programme verifies your
                request and your Verifiable eID and then issues the
                Bachelor&apos;s Diploma Verifiable Attestation, which will be
                stored in your wallet.
              </PanelBody>
            </Panel>
          </li>
          <li
            className={styles.li}
            {...(!(isAuthenticated && hasEIDVC && hasBachelorVA) && {
              className: `${styles.li} ${styles.disabled}`,
            })}
            {...(hasMaster && {
              className: `${styles.li} ${styles.done}`,
            })}
          >
            <Panel>
              <PanelTitle>
                Diploma Sample App: Issue Master&apos;s Diploma
              </PanelTitle>
              <PanelBody
                icon={step4SVG}
                title="Get your Master's Diploma"
                link={REACT_APP_DIPLOMA_MASTER_URL}
                linkLabel="Master's Diploma"
              >
                You can apply to a Master&apos;s programme at the Sample
                University - Master&apos;s Programme. The university checks your
                Verifiable eID and your Bachelor&apos;s Diploma Verfiable
                Credential and then accepts you as a registered student. After
                graduation, you can request your master&apos;s diploma. The
                Sample University - Master&apos;s Programme issues the
                Master&apos;s Diploma Verifiable Attestation, which will be
                stored in your wallet.
              </PanelBody>
            </Panel>
          </li>
          <li
            className={styles.li}
            {...(!(
              isAuthenticated &&
              hasEIDVC &&
              hasBachelorVA &&
              hasMaster
            ) && {
              className: `${styles.li} ${styles.disabled}`,
            })}
          >
            <Panel>
              <PanelTitle>Notarisation Sample App</PanelTitle>
              <PanelBody
                icon={step5SVG}
                title="Notarise your documents"
                link={REACT_APP_NOTARISATION_URL}
                linkLabel="Notarisation"
              >
                You can participate in a call for proposals, to gain EU funding
                for your start-up. You can notarise documents and justifying the
                spending of the grant you received, which can be verified by EU
                auditors.
              </PanelBody>
            </Panel>
          </li>
        </ol>
        <p>
          {isAuthenticated && (
            <>
              <button type="button" onClick={restart} className={styles.button}>
                Restart user journey
              </button>
              <a
                href={`${REACT_APP_WALLET_WEB_CLIENT_URL}/credentials`}
                className={styles.button}
              >
                Your Wallet Credentials
              </a>
            </>
          )}
          <a
            href={REACT_APP_TRUSTED_DATA_SHARING_URL}
            className={styles.button}
          >
            Trusted Data Sharing Sample App
          </a>
          <a
            href={`${REACT_APP_WALLET_WEB_CLIENT_URL}/termsAndConditions`}
            className={styles.button}
          >
            Terms And Conditions
          </a>
        </p>
      </main>
    </div>
  );
}

export default Main;
