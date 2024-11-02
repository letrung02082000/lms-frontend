import { createBrowserRouter } from 'react-router-dom';
import { PATH } from 'constants/path';
import { ADMIN_DRIVING_MENU } from 'constants/menu';
import { AccountPage, DrivingInfoPage, DrivingInstructionPage, DrivingRegisterPage, LoginPage, MaintainPage, NotFoundPage, SupportPage, DrivingTestPage, DrivingHealthPage } from 'features';
import MainGuard from 'components/guard/MainGuard';
import MainLayout from 'components/layout/MainLayout';
import UserGuard from 'components/guard/UserGuard';
import ServiceLayout from 'components/layout/ServiceLayout';
import AdminLayout from 'components/layout/AdminLayout';
import AdminGuard from 'components/guard/AdminGuard';
import AdminPage from 'features/admin/pages/AdminPage';
import AdminDrivingDatePage from 'features/admin/driving-license/pages/AdminDrivingDatePage';
import AdminDrivingPage from 'features/admin/driving-license/pages/AdminDrivingPage';
import DrivingAdminPage from 'features/admin/driving-license/DrivingAdminPage';
import AdminDrivingGuard from 'components/guard/AdminDrivingGuard';
import OtpPage from 'features/login/OtpPage';
import AdminB12DrivingPage from 'features/admin/driving-license/pages/AdminB12DrivingPage';
import AdminA1DrivingPage from 'features/admin/driving-license/pages/AdminA1DrivingPage';
import AdminA2DrivingPage from 'features/admin/driving-license/pages/AdminA2DrivingPage';

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
        path: PATH.HOME,
        element: <ServiceLayout pageTitle="Trung tâm đào tạo lái xe Bách Việt" backTo={PATH.HOME}>
          <DrivingInfoPage />
        </ServiceLayout>
      },
      {
        path: PATH.DRIVING.ROOT,
        element: <ServiceLayout pageTitle="Sát hạch lái xe" backTo={PATH.HOME}>
          <DrivingInfoPage />
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
        path: PATH.DRIVING.HEALTH_CHECK,
        element: <ServiceLayout pageTitle="Đăng ký khám sức khoẻ" backTo={PATH.HOME}>
          <DrivingHealthPage />
        </ServiceLayout>
      },
      {
        path: PATH.DRIVING.TEST,
        element: <ServiceLayout pageTitle="Lý thuyết sát hạch">
          <DrivingTestPage />
        </ServiceLayout>
      },

      {
        path: PATH.AUTH.SIGNIN,
        element: <LoginPage />
      },
      {
        path: PATH.AUTH.OTP,
        element: <OtpPage />
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
    path: '',
    element: <AdminDrivingGuard />,
    errorElement: <NotFoundPage />,
    children: [
      {
        element: <DrivingAdminPage />,
        path: PATH.DRIVING_ADMIN,
      },
    ],
  },
  {
    element: <AdminDrivingGuard />,
    errorElement: <NotFoundPage />,
    children: [
      {
        element: <AdminLayout menu={ADMIN_DRIVING_MENU} title='Quản lý lái xe' />,
        children: [
          {
            path: PATH.DRIVING.ADMIN.DATE,
            element: <AdminDrivingDatePage />,
          },
          {
            path: PATH.DRIVING.ADMIN.ROOT,
            element: <AdminDrivingPage />,
          },
          {
            path: PATH.DRIVING.ADMIN.A1,
            element: <AdminA1DrivingPage />,
          },
          {
            path: PATH.DRIVING.ADMIN.A2,
            element: <AdminA2DrivingPage />,
          },
          {
            path: PATH.DRIVING.ADMIN.B12,
            element: <AdminB12DrivingPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
