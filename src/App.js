import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import checkLogin from 'utils/checkLogin';

import {
  AccountPage,
  AdminBicyclePage,
  AdminDrivingPage,
  AdminGuestHousePage,
  AdminGuidePage,
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
  DrivingTestPage,
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
  UniformDetailPage,
  UniformPage,
} from 'features';

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
          <Route exact path='/contact' component={MaintainPage} />
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
            component={AdminGuestHousePage}
          />
          <Route exact path='/pool-info' component={PoolInfoPage} />
          <Route exact path='/pool-ticket' component={PoolTicketPage} />
          <Route exact path='/pool-tutor' component={PoolTutorPage} />
          <Route exact path='/qrscan' component={QrScanPage} />
          <Route
            exact
            path='/guest-house-info'
            component={GuestHouseInfoPage}
          />

          <Route exact path='/photocopies' component={MaintainPage} />
          <Route exact path='/photocopy' component={MaintainPage} />

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
          <Route exact path='/driving-admin' component={AdminDrivingPage} />
          <Route exact path='/bicycle-admin' component={AdminBicyclePage} />
          <Route exact path='/guide-admin' component={AdminGuidePage} />
          <Route exact path='/health-admin' component={AdminHealthPage} />

          <Route exact path='/support' component={MaintainPage} />
          <Route exact path='/maintain' component={MaintainPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </Router>
    );
  }
}

export default App;
