import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  RouterProvider,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ReactGA from "react-ga";
import { checkLogin } from "utils";
import RedirectURL from "components/RedirectURL";
import AdminRoutes from "features/admin/AdminRoutes";
import DrivingRoutes from "features/driving-license-v2/Routes";
import ServiceLayout from "components/layouts/ServiceLayout";
import {
  AccountPage,
  AdminBicyclePage,
  AdminDrivingPage,
  AdminGuestHousePage,
  BankPage,
  BusRegistrationPage,
  BusSurveyPage,
  DrivingInstructionPage,
  DrivingRegisterPage,
  DrivingInfoPage,
  ExplorePage,
  GuestHouseInfoPage,
  GuestHouseReportPage,
  GuestHouseUserPage,
  GuideDetailPage,
  GuidePage,
  HealthDetailPage,
  HealthPage,
  HomePage,
  JobDetailPage,
  JobPage,
  LoginPage,
  MaintainPage,
  NotFoundPage,
  PoolInfoPage,
  PoolTicketPage,
  PoolTutorPage,
  ProfilePage,
  QrScanPage,
  UniformRegistrationPage,
  SupportPage,
} from "features";

import YenSharePage from "features/yenshare/pages/YenSharePage";

import CouponAdminPage from "features/coupon/pages/CouponAdmin";
import CouponDemoNavigate from "features/coupon/pages/CouponDemoNavigate";
import { ThemeProvider } from "styled-components";
import { light } from "config/theme.config";
import { GUEST_HOUSE_URL, GUIDE_URL, JOB_URL, PRINT_NOW_URL, SWIMMING_POOL_URL, UNIFORM_URL } from "constants/routes";
import Loading from "components/Loading";
import router from "routes";

const GA_TRACKING_ID = process.env.REACT_APP_GA_TRACKING_ID;
ReactGA.initialize(GA_TRACKING_ID);

const App = () => {
  const [selectedTheme, setSelectedTheme] = useState(light);

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  return (
    <ThemeProvider theme={selectedTheme}>
      <RouterProvider router={router} fallbackElement={<Loading />} />
      <ToastContainer />
    </ThemeProvider>
  );
};

export default App;

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem("user-jwt-tk");
  const refreshToken = localStorage.getItem("user-jwt-rftk");

  if (!token || !refreshToken) {
    return <Navigate to="/login" />;
  }
  return children;
};

const RequireAdminAuth = ({ children }) => {
  const token = localStorage.getItem("user-jwt-tk");
  const refreshToken = localStorage.getItem("user-jwt-rftk");
  const role = localStorage.getItem("user-role");

  if (!token || !refreshToken || Number(role) === 0 || !role) {
    return <Navigate to="/login" />;
  }
  return children;
};
