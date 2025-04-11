import { createBrowserRouter } from 'react-router-dom';
import { PATH } from 'constants/path';
import ServiceLayout from 'components/layout/ServiceLayout';
import AdminDrivingCoursePage from 'features/admin/driving-license/pages/AdminDrivingCoursePage';
import AdminDrivingPage from 'features/admin/driving-license/pages/AdminDrivingPage';
import AdminDrivingProcessingPage from 'features/admin/driving-license/pages/AdminDrivingProcessingPage';
import AdminDrivingGuard from 'components/guard/AdminDrivingGuard';
import OtpPage from 'features/login/OtpPage';
import AdminDrivingCenterPage from 'features/admin/driving-license/pages/AdminDrivingCenterPage';
import AdminDrivingLayout from 'components/layout/AdminDrivingLayout';
import AdminDrivingStudentPage from 'features/admin/driving-license/pages/AdminDrivingStudentPage';
import AdminElearningGuard from 'components/guard/AdminElearningGuard';
import AdminElearningLayout from 'components/layout/AdminElearningLayout';
import AdminElearningPage from 'features/admin/elearning/pages/AdminElearningPage';
import AdminElearningStudentPage from 'features/admin/elearning/pages/AdminElearningStudentPage';
import StudentElearningGuard from 'components/guard/StudentElearningGuard';
import StudentElearningLayout from 'components/layout/StudentElearningLayout';
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
import ElearningStudentTestDetailPage from 'features/elearning/pages/ElearningStudentTestDetailPage';
import ElearningStudentArticlePage from 'features/elearning/pages/ElearningStudentArticlePage';
import ElearningStudentBookPage from 'features/elearning/pages/ElearningStudentBookPage';
import ForceChangePasswordPage from 'features/elearning/pages/ForceChangePasswordPage';
import ElearningAttemptResultPage from 'features/elearning/pages/ElearningAttemptResultPage';
import { DrivingTestPage, LoginPage, NotFoundPage } from 'features';

const router = createBrowserRouter([
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
    path: PATH.ELEARNING.CHANGE_PASSWORD,
    element: <ForceChangePasswordPage />,
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
          {
            path: PATH.ELEARNING.STUDENT.TEST_DETAIL,
            element: <ElearningStudentTestDetailPage />,
          },
          {
            path: PATH.ELEARNING.STUDENT.ARTICLE,
            element: <ElearningStudentArticlePage />,
          },
          {
            path: PATH.ELEARNING.STUDENT.BOOK,
            element: <ElearningStudentBookPage />,
          },
          {
            path: PATH.ELEARNING.STUDENT.ATTEMPT_RESULT,
            element: <ElearningAttemptResultPage />,
          },
        ],
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
