import { createBrowserRouter } from 'react-router-dom';
import { PATH } from '../constants/path';
import { HomePage, NotFoundPage } from 'features';
import AdminGuard from 'components/guard/AdminGuard';
import AllDriving from 'features/admin/driving-license/A1Driving';
import A2Driving from 'features/admin/driving-license/A2Driving';
import DrivingAdminLayout from 'components/layouts/admin/DrivingAdminLayout';
import DrivingByDate from 'features/admin/driving-license/DrivingDate';
import DrivingTestPage from 'features/driving-license/pages/DrivingTestPage';
import MainGuard from 'components/guard/MainGuard';
import ServiceLayout from 'components/layouts/ServiceLayout';
import A1TestPage from 'features/driving-license/pages/A1TestPage';
import A2TestPage from 'features/driving-license/pages/A2TestPage';
import B1TestPage from 'features/driving-license/pages/B1TestPage';
import B2TestPage from 'features/driving-license/pages/B2TestPage';

const router = createBrowserRouter([
  {
    path: PATH.HOME,
    element: <MainGuard/>,
    errorElement: <NotFoundPage/>,
    children: [
      {
        path: PATH.DRIVING.TEST,
        element: <ServiceLayout pageTitle='Thi thử lý thuyết'>
          <DrivingTestPage/>
        </ServiceLayout>
      },
      {
        path: PATH.DRIVING.A1_TEST,
        element: <ServiceLayout pageTitle='Thi thử lý thuyết' navigationTo={PATH.DRIVING.TEST}>
          <A1TestPage/>
        </ServiceLayout>
      },
      {
        path: PATH.DRIVING.A2_TEST,
        element: <ServiceLayout pageTitle='Thi thử lý thuyết' navigationTo={PATH.DRIVING.TEST}>
          <A2TestPage/>
        </ServiceLayout>
      },
      {
        path: PATH.DRIVING.B1_TEST,
        element: <ServiceLayout pageTitle='Thi thử lý thuyết' navigationTo={PATH.DRIVING.TEST}>
          <B1TestPage/>
        </ServiceLayout>
      },
      {
        path: PATH.DRIVING.B2_TEST,
        element: <ServiceLayout pageTitle='Thi thử lý thuyết' navigationTo={PATH.DRIVING.TEST}>
          <B2TestPage/>
        </ServiceLayout>
      },
    ]
  },

  {
    path: PATH.ADMIN.ROOT,
    element: <AdminGuard />,
    errorElement: <NotFoundPage />,
    children: [
      {
        element: <DrivingAdminLayout />,
        children: [
          {
            path: PATH.ADMIN.DRIVING.A1,
            element: <AllDriving />,
          },
          {
            path: PATH.ADMIN.DRIVING.A2,
            element: <A2Driving />,
          },
          {
            path: PATH.ADMIN.DRIVING.B1B2,
            element: <A2Driving />,
          },
          {
            path: PATH.ADMIN.DRIVING.DATE,
            element: <DrivingByDate />,
          },
        ],
      },
    ],
  },
]);

export default router;
