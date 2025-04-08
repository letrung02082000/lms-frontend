import { createBrowserRouter } from 'react-router-dom';
import { PATH } from 'constants/path';
import { AccountPage, DrivingInfoPage, DrivingInstructionPage, DrivingRegisterPage, LoginPage, NotFoundPage, DrivingTestPage, DrivingHealthPage } from 'features';
import MainGuard from 'components/guard/MainGuard';
import MainLayout from 'components/layout/MainLayout';
import UserGuard from 'components/guard/UserGuard';
import ServiceLayout from 'components/layout/ServiceLayout';
import AdminLayout from 'components/layout/AdminLayout';
import AdminGuard from 'components/guard/AdminGuard';
import AdminDrivingCoursePage from 'features/admin/driving-license/pages/AdminDrivingCoursePage';
import AdminDrivingPage from 'features/admin/driving-license/pages/AdminDrivingPage';
import AdminDrivingProcessingPage from 'features/admin/driving-license/pages/AdminDrivingProcessingPage';
import AdminDrivingGuard from 'components/guard/AdminDrivingGuard';
import ShortLinkPage from 'features/short-link/pages/ShortLinkPage';
import OtpPage from 'features/login/OtpPage';
import AdminDrivingCenterPage from 'features/admin/driving-license/pages/AdminDrivingCenterPage';
import CenterInstructionPage from 'features/driving-license/pages/CenterInstructionPage';
import AdminDrivingLayout from 'components/layout/AdminDrivingLayout';
import AdminDrivingStudentPage from 'features/admin/driving-license/pages/AdminDrivingStudentPage';
import AdminElearningGuard from 'components/guard/AdminElearningGuard';
import AdminElearningLayout from 'components/layout/AdminElearningLayout';
import AdminElearningPage from 'features/admin/elearning/pages/AdminElearningPage';
import AdminElearningStudentPage from 'features/admin/elearning/pages/AdminElearningStudentPage';
import StudentElearningGuard from 'components/guard/StudentElearningGuard';
import StudentElearningLayout from 'components/layout/StudentElearningLayout';
import ElearningStudentPage from 'features/elearning/pages/ElearningStudentPage';
import ElearningStudentCourseDetailPage from 'features/elearning/pages/ElearningStudentCourseDetailPage';
import ElearningStudentResultPage from 'features/elearning/pages/ElearningStudentResultPage';
import AdminDrivingTypePage from 'features/admin/driving-license/pages/AdminDrivingTypePage';
import AdminDrivingTeacherPage from 'features/admin/driving-license/pages/AdminDrivingTeacherPage';
import AdminDrivingDatePage from 'features/admin/driving-license/pages/AdminDrivingDatePage';
import AdminDrivingVehiclePage from 'features/admin/driving-license/pages/AdminDrivingVehiclePage';
import AdminDrivingElearningPage from 'features/admin/driving-license/pages/AdminDrivingElearningPage';
import ElearningStudentTestPage from 'features/elearning/pages/ElearningStudentTestPage';
import ElearningStudentLoginPage from 'features/elearning/pages/ElearningStudentLoginPage';
import ElearningStudentCoursePage from 'features/elearning/pages/ElearningStudentCoursePage';
import ElearningStudentMyPage from 'features/elearning/pages/ElearningStudentMyPage';
import ElearningStudentVideoPage from 'features/elearning/pages/ElearningStudentVideoPage';

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
            path: PATH.DRIVING.ADMIN.ROOT,
            element: <AdminDrivingPage />,
          },
          {
            path: PATH.DRIVING.ADMIN.COURSE,
            element: <AdminDrivingCoursePage />,
          },
          {
            path: PATH.DRIVING.ADMIN.ELEARNING,
            element: <AdminDrivingElearningPage />,
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
            path: PATH.DRIVING.ADMIN.PROCESSING,
            element: <AdminDrivingProcessingPage />,
          },
          {
            path: PATH.DRIVING.ADMIN.STUDENT,
            element: <AdminDrivingStudentPage />,
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
    path: PATH.ELEARNING.LOGIN,
    element: <ElearningStudentLoginPage />,
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
            element: <ElearningStudentMyPage />,
          },
          {
            path: PATH.ELEARNING.STUDENT.COURSE,
            element: <ElearningStudentCoursePage />,
          },
          {
            path: PATH.ELEARNING.STUDENT.VIDEO,
            element: <ElearningStudentVideoPage />,
          },
          {
            path: PATH.ELEARNING.STUDENT.RESULT,
            element: <ElearningStudentResultPage />,
          },
          {
            path: PATH.ELEARNING.STUDENT.TEST,
            element: <ElearningStudentTestPage />,
          },
        ],
      },
      // {
      //   path: PATH.ELEARNING.STUDENT.COURSE_DETAIL,
      //   element: <ElearningStudentCourseDetailPage />,
      // },
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
    path: PATH.NOT_FOUND,
    element: <ServiceLayout pageTitle="404" backTo={PATH.HOME}>
    <NotFoundPage />
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
