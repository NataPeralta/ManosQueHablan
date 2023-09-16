import React from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";
import "../public/css/style.css";
import {ChakraProvider} from "@chakra-ui/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
