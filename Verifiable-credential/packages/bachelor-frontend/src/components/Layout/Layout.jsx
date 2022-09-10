import React from "react";
import PropTypes from "prop-types";
import styles from "./Layout.module.css";
import { Header } from "../Header/Header";
import { Footer } from "../Footer/Footer";
import { REACT_APP_DEMONSTRATOR_URL } from "../../env";

export function Layout({ children }) {
  return (
    <>
      <Header />
      {children}
      <div className={styles.ribbon}>
        <a className={styles.ribbonText} href={REACT_APP_DEMONSTRATOR_URL}>
          SiGG DEMO
        </a>
      </div>
      <Footer />
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
