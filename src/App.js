import React from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import checkLogin from './utils/checkLogin';

import {
  UniformDetailPage,
  UniformPage,
  GuestHouseAdminPage,
  AdminGuidePage,
  AdminHealthPage,
} from './pages';
import {
  NotFoundPage,
  LoginPage,
  ProfilePage,
  DrivingInstructionPage,
  DrivingRegisterPage,
  BicyclesPage,
  BicyclePage,
  BusSurveyPage,
  BusRegistrationPage,
  CouponPage,
  CouponListPage,
  CouponScannedPage,
  HealthDetailPage,
  HealthPage,
  GuidePage,
  GuideDetailPage,
  GuestHouseUserPage,
  GuestHouseReportPage,
} from 'features';

import HomePage from './features/home/HomePage';
import ExplorePage from './features/coupon/ExplorePage';
import ContactPage from './pages/ContactPage';
import AccountPage from './features/account/AccountPage';
import BookGuestHousePage from './features/guest-house/BookGuestHousePage';
import GuestHouseBillPage from './features/guest-house/GuestHouseBillPage';
import BookGuestHouseStatusPage from './pages/BookGuestHouseStatusPage';
import SwimmingPoolInfoPage from './pages/SwimmingPoolInfoPage';
import SwimmingPoolTicketPage from './pages/SwimmingPoolTicketPage';
import GuestHouseInfoPage from './pages/GuestHouseInfoPage';
import QrScanPage from './features/qr-scan/QrScanPage';
import PhotocopyPage from './pages/PhotocopyPage';
import PhotocopyDetailPage from './features/photocopy/PhotocopyDetailPage';
import JobPage from './pages/JobPage';
import DrivingTestPage from './features/driving-license/DrivingTestPage';
import SupportPage from './features/support/SupportPage';
import MaintainPage from './features/maintainance/MaintainPage';
import drivingAdminPage from './admin/DrivingAdminPage';
import SwimmingPoolTutorPage from './pages/SwimmingPoolTutorPage';
import JobDetailPage from './features/job/JobDetailPage';
import BicycleAdminPage from './features/admin/BicycleAdminPage';
import BankPage from './features/mbbank/BankPage';

class App extends React.Component {
  render() {
    checkLogin();

    return (
      <Router>
        <ToastContainer />
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route exact path='/explore' component={ExplorePage} />
          <Route exact path='/profile' component={ProfilePage} />
          <Route exact path='/contact' component={ContactPage} />
          <Route exact path='/account' component={AccountPage} />
          <Route exact path='/login' component={LoginPage} />
          <Route exact path='/guest-house' component={GuestHouseInfoPage} />
          <Route
            exact
            path='/guest-house-user'
            component={GuestHouseUserPage}
          />
          <Route
            exact
            path='/guest-house-report'
            component={GuestHouseReportPage}
          />
          <Route
            exact
            path='/guest-house-admin'
            component={GuestHouseAdminPage}
          />
          <Route
            exact
            path='/guest-house-bill'
            component={GuestHouseBillPage}
          />
          <Route
            exact
            path='/book-guest-house-room'
            component={BookGuestHousePage}
          />
          <Route
            exact
            path='/book-guest-house-status'
            component={BookGuestHouseStatusPage}
          />
          <Route exact path='/pool-info' component={SwimmingPoolInfoPage} />
          <Route exact path='/pool-ticket' component={SwimmingPoolTicketPage} />
          <Route exact path='/pool-tutor' component={SwimmingPoolTutorPage} />
          <Route exact path='/qrscan' component={QrScanPage} />
          <Route
            exact
            path='/guest-house-info'
            component={GuestHouseInfoPage}
          />

          <Route exact path='/photocopies' component={PhotocopyPage} />
          <Route exact path='/photocopy' component={PhotocopyDetailPage} />

          <Route exact path='/driving-test' component={DrivingTestPage} />
          <Route
            exact
            path='/driving-registration'
            component={DrivingRegisterPage}
          />
          <Route
            exact
            path='/driving-instruction'
            component={DrivingInstructionPage}
          />

          <Route exact path='/jobs' component={JobPage} />
          <Route path='/job' component={JobDetailPage} />

          <Route exact path='/coupon-list' component={CouponListPage} />
          <Route exact path='/coupon' component={CouponPage} />
          <Route exact path='/coupon-scanned' component={CouponScannedPage} />

          <Route exact path='/bicycles' component={BicyclesPage} />
          <Route exact path='/bicycle' component={BicyclePage} />

          <Route exact path='/bank' component={BankPage} />
          <Route exact path='/bus-survey' component={BusSurveyPage} />

          <Route exact path='/uniforms' component={UniformPage} />
          <Route exact path='/uniform' component={UniformDetailPage} />

          <Route exact path='/guides' component={GuidePage} />
          <Route exact path='/guide' component={GuideDetailPage} />

          <Route exact path='/health' component={HealthDetailPage} />
          <Route exact path='/healths' component={HealthPage} />

          <Route
            exact
            path='/bus-registration'
            component={BusRegistrationPage}
          />

          {/* admin */}
          <Route exact path='/driving-admin' component={drivingAdminPage} />
          <Route exact path='/bicycle-admin' component={BicycleAdminPage} />
          <Route exact path='/guide-admin' component={AdminGuidePage} />
          <Route exact path='/health-admin' component={AdminHealthPage} />

          <Route exact path='/support' component={SupportPage} />
          <Route exact path='/maintain' component={MaintainPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </Router>
    );
  }
}

export default App;
