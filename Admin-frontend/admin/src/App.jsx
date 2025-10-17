  import { HashRouter} from "react-router-dom";
  import Router from "./routes";
  import React from "react";

  export default function App() {
    return (
      <HashRouter>
        <Router />
      </HashRouter>
    );
  }
