import React, { useEffect, useRef, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { darkTheme, defaultTheme } from "config/theme.config";
import Loading from "components/Loading";
import router from "routes";
import useMediaQuery from "hooks/useMediaQuery";
import useDetectDevTools from "hooks/useDetectDevTools";

const App = () => {
  const [theme, setTheme] = useState(defaultTheme);
  const countdownRef = useRef(null);
  const isProduction = process.env.REACT_APP_ENV === "production";

  useDetectDevTools(() => {
    if (isProduction) {
      console.log(
        '%c⛔ CẢNH BÁO BẢO MẬT!',
        'color: red; font-size: 30px; font-weight: bold; text-shadow: 1px 1px black;'
      );
      console.log(
        '%cBạn đang cố truy cập DevTools.',
        'color: orange; font-size: 18px; font-weight: bold;'
      );
      console.log(
        '%cHệ thống ghi nhận hoạt động bất thường. Nếu tiếp tục, tài khoản của bạn sẽ bị khóa vĩnh viễn và dữ liệu có thể bị xóa.',
        'color: black; font-size: 16px; background-color: yellow; padding: 4px;'
      );
      console.log(
        '%c📌 Hành vi này vi phạm điều khoản sử dụng hệ thống.',
        'color: darkred; font-size: 14px; font-style: italic;'
      );

      let secondsLeft = 5;
      countdownRef.current = setInterval(() => {
        console.log(`%c⏳ Đăng xuất sau: ${secondsLeft--} giây`, 'color: red; font-size: 16px;');
        if (secondsLeft < 0) {
          clearInterval(countdownRef.current);
          if (typeof onLogout === 'function') {
            // onLogout();
          } else {
            // Mặc định là xóa token và reload lại trang
            localStorage.clear();
            window.location.reload();
          }
        }
      }, 1000);
    } else {
      console.log('dev mode');
    }
  });

  useEffect(() => {
    if (isProduction) {
      const handleContextMenu = (e) => e.preventDefault();
      const handleKeyDown = (e) => {
        if (e.key === "F12" || (e.ctrlKey && e.shiftKey && e.key === "I")) {
          e.preventDefault();
        }
      };

      document.addEventListener("contextmenu", handleContextMenu);
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("contextmenu", handleContextMenu);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, []);

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
