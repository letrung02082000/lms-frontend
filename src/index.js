import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from 'react-dom/client';
import App from "./App";
import { Provider } from "react-redux";
import "react-datetime/css/react-datetime.css";
import "react-toastify/dist/ReactToastify.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "assets/styles/global.scss";
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/bundle';

import { ModalProvider } from "react-modal-hook";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from './store'
import theme from "constants/theme";
import { ThemeProvider } from "styled-components";

const root = createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ModalProvider>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </ModalProvider>
    </PersistGate>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
