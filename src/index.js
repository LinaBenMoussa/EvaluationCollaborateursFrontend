/* eslint-disable prettier/prettier */
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "App";
// Material Dashboard 2 React Context Provider
import { MaterialUIControllerProvider } from "context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./store/store";
const container = document.getElementById("app");
const root = createRoot(container);

root.render(
  <Provider store={store}>
  <BrowserRouter>
    <MaterialUIControllerProvider>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
    </MaterialUIControllerProvider>
  </BrowserRouter>
   </Provider>
);
