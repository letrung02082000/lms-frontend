import React, { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { darkTheme, defaultTheme } from "config/theme.config";
import Loading from "components/Loading";
import router from "routes";
import useMediaQuery from "hooks/useMediaQuery";

const App = () => {
  const [theme, setTheme] = useState(defaultTheme);
  const [selectedTheme] = useState(defaultTheme);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [customColor, setCustomColor] = useState('#0d6efd');

  // Apply CSS variables
  const applyTheme = (themeObj) => {
    document.documentElement.setAttribute('data-bs-theme', themeObj.name);
    Object.entries(themeObj.variables).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  };

  // Load theme from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('app-theme');
    if (stored) {
      const parsed = JSON.parse(stored);
      setTheme(parsed);
      applyTheme(parsed);
    } else {
      applyTheme(defaultTheme);
    }
  }, []);

  // Save to localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('app-theme', JSON.stringify(theme));
  }, [theme]);

  const switchTheme = (type) => {
    const newTheme = type === 'dark' ? darkTheme : defaultTheme;
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const updateCustomPrimary = (color) => {
    const newTheme = {
      ...theme,
      name: 'custom',
      variables: {
        ...theme.variables,
        '--bs-primary': color.hex,
      },
    };
    setCustomColor(color.hex);
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  return (
    <>
      <RouterProvider router={router} fallbackElement={<Loading />} />
      <ToastContainer />
    </>
  );
};

export default App;
