import React, { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "styled-components";
import { light } from "config/theme.config";
import Loading from "components/Loading";
import router from "routes";

const App = () => {
  const [selectedTheme, setSelectedTheme] = useState(light);

  useEffect(() => {
  }, []);

  return (
    <ThemeProvider theme={selectedTheme}>
      <RouterProvider router={router} fallbackElement={<Loading />} />
      <ToastContainer />
    </ThemeProvider>
  );
};

export default App;
