import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { AuthContext } from "../../components/Auth/Auth";
import { P } from "../../components/Typography/Typography";

function Logout() {
  const { isAuthenticated, logout } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <h1 className="ecl-page-header-harmonised__title ecl-u-mt-xl ecl-u-mb-xl">
        Log out
      </h1>
      <P>
        You are about to log out from the simulated authentication system of the
        Sample University - Master&apos;s Programme.
      </P>
      <button
        type="button"
        className="ecl-button ecl-button--call"
        onClick={logout}
      >
        Log out
      </button>
    </>
  );
}

export default Logout;
