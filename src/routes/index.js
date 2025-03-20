import { createBrowserRouter } from 'react-router-dom';
import { PATH } from 'constants/path';
import { AccountPage, DrivingInfoPage, DrivingInstructionPage, DrivingRegisterPage, LoginPage, MaintainPage, NotFoundPage, PoolInfoPage, QrScanPage, SupportPage, PhotocopyPage, DrivingTestPage, DrivingHealthPage } from 'features';
import { AppStorePage, CheckoutPage, OrderPage, ProductDetailPage, StoreDetailPage } from 'features/app';
import MainGuard from 'components/guard/MainGuard';
import MainLayout from 'components/layout/MainLayout';
import UserGuard from 'components/guard/UserGuard';
import ServiceLayout from 'components/layout/ServiceLayout';
import AdminLayout from 'components/layout/AdminLayout';
import AdminGuard from 'components/guard/AdminGuard';
import AdminPage from 'features/admin/pages/AdminPage';
import AdminDrivingClassPage from 'features/admin/driving-license/pages/AdminDrivingClassPage';
import AdminDrivingListPage from 'features/admin/driving-license/pages/AdminDrivingListPage';
import SuccessPage from 'features/app/pages/SuccessPage';
import AllStorePage from 'features/app/pages/AllStorePage';
import StoreByCategory from 'features/app/pages/StoreByCategory';
import AdminDrivingGuard from 'components/guard/AdminDrivingGuard';
import OrderHistoryPage from 'features/app/pages/OrderHistoryPage';
import StoreByLocation from 'features/app/pages/StoreByLocation';
import ShortLinkPage from 'features/short-link/pages/ShortLinkPage';
import OtpPage from 'features/login/OtpPage';
import GcnPage from 'features/gcn/pages/GcnPage';
import UsshGcnPage from 'features/gcn/pages/GcnPage2';
import CouponPage from 'features/app/pages/CouponPage';
import PaymentPage from 'features/app/pages/PaymentPage';
import MyStorePage from 'features/app/pages/MyStorePage';
import StoreLayout from 'components/layout/StoreLayout';
import MyOrderPage from 'features/app/pages/MyOrderPage';
import MyStoreSettingPage from 'features/app/pages/MyStoreSettingPage';
import MyStatisticsPage from 'features/app/pages/MyStatisticsPage';
import AdminDrivingCenterPage from 'features/admin/driving-license/pages/AdminDrivingCenterPage';
import CenterInstructionPage from 'features/driving-license/pages/CenterInstructionPage';
import AdminDrivingLayout from 'components/layout/AdminDrivingLayout';
import AdminDrivingPage from 'features/admin/driving-license/pages/AdminDrivingPage';
import AdminElearningGuard from 'components/guard/AdminElearningGuard';
import AdminElearningLayout from 'components/layout/AdminElearningLayout';
import AdminElearningPage from 'features/admin/elearning/pages/AdminElearningPage';
import AdminElearningStudentPage from 'features/admin/elearning/pages/AdminElearningStudentPage';
import StudentElearningGuard from 'components/guard/StudentElearningGuard';
import StudentElearningLayout from 'components/layout/StudentElearningLayout';
import ElearningStudentPage from 'features/elearning/pages/ElearningStudentPage';
import ElearningStudentCoursePage from 'features/elearning/pages/ElearningStudentCoursePage';
import ElearningStudentCourseDetailPage from 'features/elearning/pages/ElearningStudentCourseDetailPage';
import ElearningStudentResultPage from 'features/elearning/pages/ElearningStudentResultPage';
import AdminDrivingTypePage from 'features/admin/driving-license/pages/AdminDrivingTypePage';
import AdminDrivingTeacherPage from 'features/admin/driving-license/pages/AdminDrivingTeacherPage';
import AdminDrivingDatePage from 'features/admin/driving-license/pages/AdminDrivingDatePage';
import AdminDrivingVehiclePage from 'features/admin/driving-license/pages/AdminDrivingVehiclePage';

const router = createBrowserRouter([
  {
    path: PATH.HOME,
    element: <MainGuard />,
    errorElement: <NotFoundPage />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: PATH.APP.ROOT,
            element: <AppStorePage />,
          },
          {
            path: PATH.EXPLORE.ROOT,
            element: <CouponPage />,
          },
          {
            path: PATH.ACCOUNT,
            element: <AccountPage />
          },
          {
            path: PATH.USER.ROOT,
            element: <UserGuard />,
            errorElement: <NotFoundPage />,
            children: [
              {
                path: PATH.USER.PROFILE,
                element: <AccountPage />,
              },
            ],
          },
        ],
      },
      {
        element: <StoreLayout />,
        children: [
          {
            path: PATH.APP.MY_STORE.ROOT,
            element: <MyStorePage />
          },
          {
            path: PATH.APP.MY_STORE.ORDER,
            element: <MyOrderPage />
          },
          {
            path: PATH.APP.MY_STORE.STATISTICS,
            element: <MyStatisticsPage />
          },
          {
            path: PATH.APP.MY_STORE.SETTING,
            element: <MyStoreSettingPage />
          },
        ],
      },
      {
        path: PATH.APP.STORE_DETAIL,
        element: <StoreDetailPage />
      },
      {
        path: PATH.APP.CHECKOUT,
        element: <ServiceLayout pageTitle="Đặt hàng">
          <CheckoutPage />
        </ServiceLayout>
      },
      {
        path: PATH.APP.ORDER_SUCCESS,
        element: <ServiceLayout pageTitle="Thông tin đơn hàng">
          <SuccessPage />
        </ServiceLayout>
      },
      {
        path: PATH.APP.STORE,
        element: <ServiceLayout pageTitle="Cửa hàng">
          <AllStorePage />
        </ServiceLayout>
      },
      {
        path: PATH.APP.STORE_BY_CATEGORY,
        element: <ServiceLayout pageTitle="Cửa hàng">
          <StoreByCategory />
        </ServiceLayout>
      },
      {
        path: PATH.APP.STORE_BY_LOCATION,
        element: <ServiceLayout pageTitle="Cửa hàng">
          <StoreByLocation />
        </ServiceLayout>
      },
      {
        path: PATH.APP.ORDER_DETAIL,
        element: <ServiceLayout pageTitle="Thông tin đơn hàng" backTo={PATH.APP.ROOT}>
          <OrderPage />
        </ServiceLayout>
      },
      {
        path: PATH.APP.PAYMENT,
        element: <ServiceLayout pageTitle="Thanh toán">
          <PaymentPage />
        </ServiceLayout>
      },
      {
        path: PATH.APP.MY_ORDER,
        element: <ServiceLayout pageTitle="Đơn hàng của tôi">
          <OrderHistoryPage />
        </ServiceLayout>
      },
      {
        path: PATH.APP.PRODUCT_DETAIL,
        element: <ProductDetailPage />
      },
      {
        path: PATH.SHORT_LINK,
        element: <ShortLinkPage />
      },
      {
        path: PATH.DRIVING.HEALTH_CHECK,
        element: <ServiceLayout pageTitle="Đăng ký thông tin" backTo={PATH.HOME}>
          <DrivingHealthPage />
        </ServiceLayout>
      },
      {
        path: PATH.DRIVING.ROOT,
        element: <ServiceLayout pageTitle="Sát hạch lái xe" backTo={PATH.HOME}>
          <DrivingInfoPage />
        </ServiceLayout>
      },
      {
        path: PATH.DRIVING.HOC_LAI_XE,
        element: <ServiceLayout pageTitle="Sát hạch lái xe" backTo={PATH.HOME}>
          <DrivingRegisterPage />
        </ServiceLayout>
      },
      {
        path: PATH.DRIVING.INSTRUCTION,
        element: <ServiceLayout pageTitle="Hướng dẫn dự thi" backTo={PATH.DRIVING.ROOT}>
          <DrivingInstructionPage />
        </ServiceLayout>
      },
      {
        path: PATH.DRIVING.REGISTRATION,
        element: <ServiceLayout pageTitle="Đăng ký dự thi" backTo={PATH.DRIVING.ROOT}>
          <DrivingRegisterPage />
        </ServiceLayout>
      },
      {
        path: PATH.DRIVING.CENTER.INSTRUCTION,
        element: <ServiceLayout pageTitle="Hướng dẫn dự thi" backTo={PATH.DRIVING.ROOT}>
          <CenterInstructionPage />
        </ServiceLayout>
      },
      {
        path: PATH.DRIVING.CENTER.REGISTRATION,
        element: <ServiceLayout pageTitle="Đăng ký dự thi" backTo={PATH.DRIVING.ROOT}>
          <DrivingRegisterPage />
        </ServiceLayout>
      },
      {
        path: PATH.DRIVING.CENTER.HUONG_DAN,
        element: <ServiceLayout pageTitle="Hướng dẫn dự thi" backTo={PATH.DRIVING.ROOT}>
          <CenterInstructionPage />
        </ServiceLayout>
      },
      {
        path: PATH.DRIVING.CENTER.DANG_KY,
        element: <ServiceLayout pageTitle="Đăng ký dự thi" backTo={PATH.DRIVING.ROOT}>
          <DrivingRegisterPage />
        </ServiceLayout>
      },
      
      {
        path: PATH.GCN.ROOT,
        element: <GcnPage />
      },
      {
        path: PATH.GCN.USSH,
        element: <UsshGcnPage />
      },
    ],
  },
  {
    path: PATH.ADMIN.ROOT,
    element: <AdminGuard />,
    errorElement: <NotFoundPage />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: '',
            element: <AdminPage />,
          },
        ],
      },
    ],
  },
  {
    element: <AdminDrivingGuard />,
    errorElement: <NotFoundPage />,
    children: [
      {
        element: <AdminDrivingLayout />,
        children: [
          {
            path: PATH.DRIVING.ADMIN.CLASS,
            element: <AdminDrivingClassPage />,
          },
          {
            path: PATH.DRIVING.ADMIN.DATE,
            element: <AdminDrivingDatePage />,
          },
          {
            path: PATH.DRIVING.ADMIN.CENTER,
            element: <AdminDrivingCenterPage />,
          },
          {
            path: PATH.DRIVING.ADMIN.QUERY,
            element: <AdminDrivingListPage />,
          },
          {
            path: PATH.DRIVING.ADMIN.ROOT,
            element: <AdminDrivingPage />,
          },
          {
            path: PATH.DRIVING.ADMIN.TYPE,
            element: <AdminDrivingTypePage />,
          },
          {
            path: PATH.DRIVING.ADMIN.TEACHER,
            element: <AdminDrivingTeacherPage />,
          },
          {
            path: PATH.DRIVING.ADMIN.VEHICLE,
            element: <AdminDrivingVehiclePage />,
          },
        ],
      },
    ],
  },
  {
    element: <AdminElearningGuard />,
    errorElement: <NotFoundPage />,
    children: [
      {
        element: <AdminElearningLayout />,
        children: [
          {
            path: PATH.ELEARNING.ADMIN.ROOT,
            element: <AdminElearningPage />,
          },
          {
            path: PATH.ELEARNING.ADMIN.STUDENT,
            element: <AdminElearningStudentPage />,
          },
        ],
      },
    ],
  },
  {
    element: <StudentElearningGuard />,
    errorElement: <NotFoundPage />,
    children: [
      {
        element: <StudentElearningLayout />,
        children: [
          {
            path: PATH.ELEARNING.STUDENT.ROOT,
            element: <ElearningStudentPage />,
          },
          {
            path: PATH.ELEARNING.STUDENT.RESULT,
            element: <ElearningStudentResultPage />,
          },
        ],
      },
      {
        path: PATH.ELEARNING.STUDENT.COURSE_DETAIL,
        element: <ElearningStudentCourseDetailPage />,
      },
    ],
  },
  {
    path: PATH.AUTH.SIGNIN,
    element: <LoginPage/>
  },
  {
    path: PATH.AUTH.OTP,
    element: <OtpPage/>
  },
  {
    path: PATH.SUPPORT.ROOT,
    element: <ServiceLayout pageTitle="Hỗ trợ">
      <SupportPage />
    </ServiceLayout>
  },
  {
    path: PATH.MAINTAIN,
    element: <ServiceLayout pageTitle="Đang phát triển">
      <MaintainPage />
    </ServiceLayout>
  },
  {
    path: PATH.NOT_FOUND,
    element: <ServiceLayout pageTitle="404" backTo={PATH.HOME}>
    <NotFoundPage />
  </ServiceLayout>
  },
  {
    path: PATH.PHOTOCOPY.ROOT,
    element: <ServiceLayout pageTitle="In ấn" backTo={PATH.HOME}>
      <PhotocopyPage />
    </ServiceLayout>
  },
  {
    path: PATH.SWIMMING_POOL.ROOT,
    element: <ServiceLayout pageTitle="Hồ bơi">
      <PoolInfoPage />
    </ServiceLayout>
  },
  {
    path: PATH.QR_SCAN.ROOT,
    element: <ServiceLayout pageTitle="Quét mã">
      <QrScanPage />
    </ServiceLayout>
  },
  {
    path: PATH.DRIVING.TEST,
    element: <ServiceLayout pageTitle="Lý thuyết sát hạch">
      <DrivingTestPage />
    </ServiceLayout>
  },
]);

export default router;
