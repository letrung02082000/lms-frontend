import { createBrowserRouter } from 'react-router-dom';
import { PATH } from 'constants/path';
import { AccountPage, DrivingInfoPage, DrivingInstructionPage, DrivingRegisterPage, ExplorePage, GuestHouseInfoPage, HomePage, LoginPage, MaintainPage, NotFoundPage, PoolInfoPage, QrScanPage, SupportPage, UniformRegistrationPage } from 'features';
import MainGuard from 'components/guard/MainGuard';
import MainLayout from 'components/layout/MainLayout';
import UserGuard from 'components/guard/UserGuard';
import ServiceLayout from 'components/layout/ServiceLayout';
import AdminLayout from 'components/layout/AdminLayout';
import AdminGuard from 'components/guard/AdminGuard';
import AdminPage from 'features/admin/pages/AdminPage';
import { ADMIN_DRIVING_MENU } from 'constants/menu';
import AdminDrivingDatePage from 'features/admin/driving-license/pages/AdminDrivingDatePage';
import AdminDrivingA1Page from 'features/admin/driving-license/pages/AdminDrivingPage';
import DrivingAdminPage from 'features/admin/driving-license/DrivingAdminPage';
import YenSharePage from 'features/yenshare/pages/YenSharePage';

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
            path: '',
            element: <HomePage />,
          },
          {
            path: PATH.EXPLORE.ROOT,
            element: <ExplorePage />,
          },
          {
            path: PATH.ACCOUNT,
            element: <AccountPage/>
          },
        ],
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
    element: <AdminGuard />,
    errorElement: <NotFoundPage />,
    children: [
      {
        element: <DrivingAdminPage />,
        path: PATH.DRIVING_ADMIN,
      },
    ],
  },
  {
    element: <AdminGuard />,
    errorElement: <NotFoundPage />,
    children: [
      {
        element: <AdminLayout menu={ADMIN_DRIVING_MENU} title='Quản lý lái xe'/>,
        children: [
          {
            path: PATH.DRIVING.ADMIN.DATE,
            element: <AdminDrivingDatePage />,
          },
          {
            path: PATH.DRIVING.ADMIN.ROOT,
            element: <AdminDrivingA1Page />,
          },
        ],
      },
    ],
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
  {
    path: PATH.AUTH.SIGNIN,
    element: <LoginPage/>
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
    path: PATH.DRIVING.ROOT,
    element: <ServiceLayout pageTitle="Sát hạch lái xe">
      <DrivingInfoPage />
    </ServiceLayout>
  },
  {
    path: PATH.DRIVING.INSTRUCTION,
    element: <ServiceLayout pageTitle="Hướng dẫn dự thi">
      <DrivingInstructionPage />
    </ServiceLayout>
  },
  {
    path: PATH.DRIVING.REGISTRATION,
    element: <ServiceLayout pageTitle="Đăng ký dự thi">
      <DrivingRegisterPage />
    </ServiceLayout>
  },
  {
    path: PATH.UNIFORM.ROOT,
    element: <ServiceLayout pageTitle="Đăng ký dự thi">
      <UniformRegistrationPage />
    </ServiceLayout>
  },
  {
    path: PATH.PHOTOCOPY.ROOT,
    element: <ServiceLayout pageTitle="In ấn sinh viên">
      <MaintainPage />
    </ServiceLayout>
  },
  {
    path: PATH.SWIMMING_POOL.ROOT,
    element: <ServiceLayout pageTitle="Hồ bơi">
      <PoolInfoPage />
    </ServiceLayout>
  },
  {
    path: PATH.GUEST_HOUSE.ROOT,
    element: <ServiceLayout pageTitle="Đặt phòng nhà khách">
      <GuestHouseInfoPage />
    </ServiceLayout>
  },
  {
    path: PATH.QR_SCAN.ROOT,
    element: <ServiceLayout pageTitle="Quét mã">
      <QrScanPage />
    </ServiceLayout>
  },
  {
    path: PATH.YEN_SHARE.ROOT,
    element: <ServiceLayout pageTitle="Yên share">
      <YenSharePage />
    </ServiceLayout>
  }
]);

export default router;
