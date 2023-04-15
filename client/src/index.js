import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

// Material Dashboard 2 React Context Provider
// import { MaterialUIControllerProvider } from "./context";
import Upload from "./adminLayouts/fileUpload/uploadFunctionality"

ReactDOM.render(
    <BrowserRouter>
      {/* <MaterialUIControllerProvider> */}
        <Upload />
      {/* </MaterialUIControllerProvider> */}
    </BrowserRouter>,
  document.getElementById("root")
);
