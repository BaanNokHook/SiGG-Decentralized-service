import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import { Layout } from "../components/Layout/Layout";
import { Page } from "../components/Page/Page";
import PrivateRoute from "../components/PrivateRoute/PrivateRoute";
import Auth from "../components/Auth/Auth";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";
import Homepage from "./Homepage/Homepage";
import NoMatch from "./NoMatch/NoMatch";
import Login from "./Login/Login";
import Logout from "./Logout/Logout";
import ApplyMaster from "./ApplyMaster/ApplyMaster";
import GetMaster from "./GetMaster/GetMaster";
import { PUBLIC_URL } from "../env";

// ECL styles
import "@ecl/ec-preset-website/dist/styles/ecl-ec-preset-website.css";

const basename = PUBLIC_URL.startsWith("http")
  ? new URL(PUBLIC_URL).pathname
  : PUBLIC_URL;

function App() {
  return (
    <Auth>
      <BrowserRouter basename={basename}>
        <ScrollToTop />
        <Layout>
          <Page>
            <Switch>
              <Route exact path="/" component={Homepage} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/logout" component={Logout} />
              <PrivateRoute
                exact
                path="/apply-master"
                component={ApplyMaster}
              />
              <PrivateRoute exact path="/get-master" component={GetMaster} />
              <Route path="*">
                <NoMatch />
              </Route>
            </Switch>
          </Page>
        </Layout>
      </BrowserRouter>
    </Auth>
  );
}

export default App;
