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
      {/* <Router>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick={true}
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={true}
          pauseOnHover={true}
          theme="light"
        />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/contact" element={<MaintainPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/guest-house"
            element={
              <ServiceLayout pageTitle="Nhà khách" navigationTo="/guest-house">
              <GuestHouseInfoPage/>
            </ServiceLayout>
            }
          />
          <Route path="/guest-house-user" element={<GuestHouseUserPage />} />
          <Route path="/guest-house-report" element={<GuestHouseReportPage />} />
          <Route
            path="/guest-house-admin"
            element={
              <RequireAdminAuth>
                <AdminGuestHousePage />
              </RequireAdminAuth>
            }
          />

          <Route
            path="/pool-info"
            element={
              <ServiceLayout pageTitle="Hồ bơi" navigationTo="/pool-info">
              <PoolInfoPage/>
            </ServiceLayout>
            }
          />
          <Route
            path="/pool-ticket"
            element={
              <ServiceLayout pageTitle="Mua vé tháng" navigationTo="/pool-ticket">
                <PoolTicketPage />
              </ServiceLayout>
            }
          />
          <Route
            path="/pool-tutor"
            element={
              <ServiceLayout
                pageTitle="Đăng ký học bơi"
                navigationTo="/pool-tutor"
              >
                <PoolTutorPage />
              </ServiceLayout>
            }
          />

          <Route
            path="/qrscan"
            element={
              <ServiceLayout pageTitle="Mã QR" navigationTo="/qrscan">
                <QrScanPage />
              </ServiceLayout>
            }
          />
          <Route
            path="/guest-house-info"
            element={
              <ServiceLayout
                pageTitle="Thông tin nhà khách"
                navigationTo="/guest-house-info"
              >
                <GuestHouseInfoPage />
              </ServiceLayout>
            }
          />

          <Route
            path="/driving-test"
            element={
              <ServiceLayout
                pageTitle="Sát hạch lái xe"
                navigationTo="/driving-test"
              >
                <DrivingInfoPage />
              </ServiceLayout>
            }
          />
          <Route
            path="/driving-registration"
            element={
              <ServiceLayout
                pageTitle="Đăng ký dự thi"
                navigationTo="/driving-registration"
              >
                <DrivingRegisterPage />
              </ServiceLayout>
            }
          />
          <Route
            path="/driving-instruction"
            element={
              <ServiceLayout
                pageTitle="Hướng dẫn dự thi"
                navigationTo="/driving-instruction"
              >
                <DrivingInstructionPage />
              </ServiceLayout>
            }
          />

          <Route path="/driving-license/*" element={<DrivingRoutes />} />
          <Route
            path="/jobs"
            element={
              <RedirectURL url={JOB_URL}/>
            }
          />
          <Route
            path="/job"
            element={
              <ServiceLayout pageTitle="Thông tin việc làm" navigationTo="/jobs">
                <JobDetailPage />
              </ServiceLayout>
            }
          />
          <Route
            path="/bicycles"
            element={
              <ServiceLayout
                pageTitle="Xe đạp công cộng"
                navigationTo="/bicycles"
              >
                <MaintainPage />
              </ServiceLayout>
            }
          />
          <Route
            path="/bicycle"
            element={
              <ServiceLayout pageTitle="Thuê xe" navigationTo="/bicycles">
                <MaintainPage />
              </ServiceLayout>
            }
          />

          <Route
            path="/yenshare"
            element={
              <ServiceLayout pageTitle="YÊN SHARE - Chia sẻ yên sau" navigationTo="/yenshare">
                <YenSharePage />
              </ServiceLayout>
            }
          />

          <Route
            path="/bank"
            element={
              <ServiceLayout pageTitle="Mở thẻ MB Bank" navigationTo="/bank">
                <BankPage />
              </ServiceLayout>
            }
          />
          <Route path="/bus-survey" element={<BusSurveyPage />} />
          <Route
            path="/uniform"
            element={
              <RedirectURL url={UNIFORM_URL}/>
            }
          />
          <Route
            path="/guides"
            element={
              <RedirectURL url={GUIDE_URL}/>
            }
          />

          <Route
            path="/health"
            element={
              <ServiceLayout pageTitle="Bài viết" navigationTo="/health">
                <HealthDetailPage />
              </ServiceLayout>
            }
          />
          <Route
            path="/healths"
            element={
              <ServiceLayout
                pageTitle="Sức khỏe sinh viên"
                navigationTo="/healths"
              >
                <HealthPage />
              </ServiceLayout>
            }
          />
          <Route
            path="/photocopy"
            element={<RedirectURL url={PRINT_NOW_URL} />}
          />

          <Route
            path="/bus-registration"
            element={
              <ServiceLayout
                pageTitle="Đặt xe đưa rước"
                navigationTo="/bus-registration"
              >
                <BusRegistrationPage />
              </ServiceLayout>
            }
          />

          <Route path="/coupon-admin" element={<CouponAdminPage />} />
          <Route path="/demo-navigate" element={<CouponDemoNavigate />} />

          <Route path="/driving-admin" element={<AdminDrivingPage />} />
          <Route
            path="/bicycle-admin"
            element={
              <RequireAdminAuth>
                <AdminBicyclePage />
              </RequireAdminAuth>
            }
          />
          <Route
            path="admin/*"
            element={
              <RequireAdminAuth>
                <AdminRoutes />
              </RequireAdminAuth>
            }
          />

          <Route
            path="/support"
            element={
              <ServiceLayout pageTitle="Hỗ trợ" navigationTo="/support">
                <SupportPage />
              </ServiceLayout>
            }
          />

          <Route
            path="/maintain"
            element={
              <ServiceLayout pageTitle="Đang phát triển" navigationTo="/maintain">
                <MaintainPage />
              </ServiceLayout>
            }
          />

          <Route
            path="*"
            element={
              <ServiceLayout pageTitle="Lỗi" navigationTo="/maintain">
                <NotFoundPage />
              </ServiceLayout>
            }
          />
        </Routes>
      </Router> */}
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
