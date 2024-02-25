import { createBrowserRouter } from 'react-router-dom';
import { PATH } from 'constants/path';
import { AccountPage, DrivingInfoPage, DrivingInstructionPage, DrivingRegisterPage, ExplorePage, HomePage, LoginPage, MaintainPage, NotFoundPage, SupportPage } from 'features';
import MainGuard from 'components/guard/MainGuard';
import MainLayout from 'components/layout/MainLayout';
import UserGuard from 'components/guard/UserGuard';
import ServiceLayout from 'components/layout/ServiceLayout';

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
//   {
//     path: PATH.ADMIN.ROOT,
//     element: <AdminGuard />,
//     errorElement: <ErrorPage />,
//     children: [
//       {
//         element: <AdminLayout />,
//         children: [
//           {
//             path: '',
//             element: <AdminPage />,
//           },
//           {
//             path: PATH.ADMIN.VIDEO_LIST,
//             element: <VideoManagementPage />,
//           },
//         ],
//       },
//     ],
//   },
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
]);

export default router;
