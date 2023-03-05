import polyfill from "./polyfills";
import React from "react";
import ReactDOM, { hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Store from "./Store";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement); // createRoot(container!) if you use TypeScript
//
// const rootElement = document.getElementById("root");
if (rootElement) {
  //   hydrateRoot(<Store data={<App />}></Store>, root);
  // } else {
  root.render(
    <BrowserRouter>
      <Store data={<App />}></Store>
    </BrowserRouter>
  );
}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
