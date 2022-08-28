import React from 'react';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import checkLogin from 'utils/checkLogin';
import AdminRoutes from "features/admin/AdminRoutes";

import {
  AccountPage,
  AdminBicyclePage,
  AdminDrivingPage,
  AdminGuestHousePage,
  AdminHealthPage,
  BankPage,
  BicyclePage,
  BicyclesPage,
  BusRegistrationPage,
  BusSurveyPage,
  CouponListPage,
  CouponPage,
  CouponScannedPage,
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
  UniformPage,
  SupportPage,
  B2InfoPage
} from 'features';
import PhotocopyRoutes from 'features/photocopy/Routes';

class App extends React.Component {
  render() {
    checkLogin();

    return (
      <Router>
        <ToastContainer />
        <Routes>
          <Route exact path='/' element={<HomePage />} />
          <Route exact path='/explore' element={<ExplorePage />} />
          <Route exact path='/profile' element={<ProfilePage />} />
          <Route exact path='/contact' element={<MaintainPage />} />
          <Route exact path='/account' element={<AccountPage />} />
          <Route exact path='/login' element={<LoginPage />} />
          <Route exact path='/guest-house' element={<GuestHouseInfoPage />} />
          <Route
            exact
            path='/guest-house-user'
            element={<GuestHouseUserPage />}
          />
          <Route
            exact
            path='/guest-house-report'
            element={<GuestHouseReportPage />}
          />
          <Route
            exact
            path='/guest-house-admin'
            element={
              <RequireAdminAuth>
                <AdminGuestHousePage />
              </RequireAdminAuth>
            }
          />
          <Route exact path='/pool-info' element={<PoolInfoPage />} />
          <Route exact path='/pool-ticket' element={<PoolTicketPage />} />
          <Route exact path='/pool-tutor' element={<PoolTutorPage />} />
          <Route exact path='/qrscan' element={<QrScanPage />} />
          <Route
            exact
            path='/guest-house-info'
            element={<GuestHouseInfoPage />}
          />

          <Route exact path='/driving-test' element={<DrivingInfoPage />} />
          <Route
            exact
            path='/driving-registration'
            element={<DrivingRegisterPage />}
          />
          <Route
            exact
            path='/driving-instruction'
            element={<DrivingInstructionPage />}
          />
          <Route path='/driving-license' element={<B2InfoPage />}>
            <Route path='b2' element={<B2InfoPage />} />
          </Route>

          <Route exact path='/jobs' element={<JobPage />} />
          <Route path='/job' element={<JobDetailPage />} />

          <Route exact path='/coupon-list' element={<CouponListPage />} />
          <Route exact path='/coupon' element={<CouponPage />} />
          <Route exact path='/coupon-scanned' element={<CouponScannedPage />} />

          <Route exact path='/bicycles' element={<BicyclesPage />} />
          <Route exact path='/bicycle' element={<BicyclePage />} />

          <Route exact path='/bank' element={<BankPage />} />
          <Route exact path='/bus-survey' element={<BusSurveyPage />} />

          <Route exact path='/uniform' element={<UniformRegistrationPage />} />

          <Route exact path='/guides' element={<GuidePage />} />
          <Route exact path='/guide' element={<GuideDetailPage />} />

          <Route exact path='/health' element={<HealthDetailPage />} />
          <Route exact path='/healths' element={<HealthPage />} />
          <Route exact path='/photocopy/*' element={<PhotocopyRoutes />} />

          <Route
            exact
            path='/bus-registration'
            element={<BusRegistrationPage />}
          />

          <Route exact path='/driving-admin' element={<AdminDrivingPage />} />
          <Route
            exact
            path='/bicycle-admin'
            element={
              <RequireAdminAuth>
                <AdminBicyclePage />
              </RequireAdminAuth>
            }
          />
          <Route
            exact
            path='admin/*'
            element={
              <RequireAdminAuth>
                <AdminRoutes />
              </RequireAdminAuth>
            }
          />

          <Route exact path='/support' element={<SupportPage />} />
          <Route exact path='/maintain' element={<MaintainPage />} />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </Router>
    );
  }
}

export default App;

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem('user-jwt-tk');
  const refreshToken = localStorage.getItem('user-jwt-rftk');

  if (!token || !refreshToken) {
    return <Navigate to='/login' />;
  }
  return children;
};

const RequireAdminAuth = ({ children }) => {
  const token = localStorage.getItem('user-jwt-tk');
  const refreshToken = localStorage.getItem('user-jwt-rftk');
  const role = localStorage.getItem('user-role');

  if (!token || !refreshToken || Number(role) === 0 || !role) {
    return <Navigate to='/login' />;
  }
  return children;
};
