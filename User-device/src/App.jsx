import React from "react";
import Auth from "./components/Auth/Auth";
import Main from "./pages/Main/Main";

function App() {
  return (
    <Auth>
      <Main />
    </Auth>
  );
}

export default App;
