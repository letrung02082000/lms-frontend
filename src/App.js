import React, { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "styled-components";
import { light } from "config/theme.config";
import Loading from "components/Loading";
import router from "routes";
import useMediaQuery from "hooks/useMediaQuery";

const App = () => {
  const [selectedTheme, setSelectedTheme] = useState(light);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
  }, []);

  return (
    <ThemeProvider theme={{ ...selectedTheme, isDesktop }}>
      <RouterProvider router={router} fallbackElement={<Loading />} />
      <ToastContainer />
    </ThemeProvider>
  );
};

export default App;
