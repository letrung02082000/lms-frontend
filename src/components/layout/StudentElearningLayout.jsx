import React, { useEffect, useMemo } from 'react';
import AdminLayout from './AdminLayout';
import { STUDENT_ELEARNING_MENU } from 'constants/menu';
import elearningApi from 'api/elearningApi';
import { Button, Image } from 'react-bootstrap';
import { PATH } from 'constants/path';
import { useDispatch } from 'react-redux';
import { updateElearningData } from 'store/elearning.slice';
import { groupCourseContent, groupUserGradeByCourseModule } from 'utils/elearning.utils';
import moodleApi from 'services/moodleApi';

function StudentElearningLayout() {
  const dispatch = useDispatch();
  const [center, setCenter] = React.useState(() => {
    try {
      const data = localStorage.getItem('center');
      if (data && data !== 'undefined') {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Lỗi khi parse localStorage center:', e.message);
    }
    return {};
  });
  const [student, setStudent] = React.useState(null);
  const [activityReport, setActivityReport] = React.useState(null);
  const [elearningGrades, setElearningGrades] = React.useState(null);
  const [isCollapsed, setIsCollapsed] = React.useState(
    window.location.pathname?.includes('/elearning/student/book')
  );

  useEffect(() => {
    if (!center?._id) {
      const moodleToken = localStorage.getItem('moodleToken');
      if (!moodleToken) {
        window.location.href = '/elearning/login';
      } else {
        elearningApi
          .getUserByMoodleToken(moodleToken)
          .then((res) => {
            setCenter(res.data?.center);
            setStudent(res.data);
            localStorage.setItem('center', JSON.stringify(res.data?.center));
          })
          .catch((error) => {
            console.error('Error fetching site info:', error);
            window.location.href = '/elearning/login';
          });
      }
    } else {
      const moodleToken = localStorage.getItem('moodleToken');
      if (!moodleToken) {
        window.location.href = '/elearning/login';
      } else {
        elearningApi
          .getUserByMoodleToken(moodleToken)
          .then((res) => {
            setStudent(res.data);
          })
          .catch((error) => {
            console.error('Error fetching site info:', error);
            window.location.href = '/elearning/login';
          });
      }
    }
  }, [center]);

  useEffect(() => {
    if (window.location.pathname?.includes('/elearning/student/book')) {
      setIsCollapsed(true);
    }
  }, []);

  const bookIds = useMemo(() => {
    if (!activityReport) return [];
    return Object.values(activityReport).reduce((acc, activities) => {
      activities.forEach((activity) => {
        if (activity.modname === 'book') {
          acc.push(activity.cmid);
        }
      });
      return acc;
    }, []);
  }, [activityReport]);

    const quizIds = useMemo(() => {
    if (!elearningGrades) return [];
    return Object.values(elearningGrades).reduce((acc, grade) => {
      if (grade?.modules) {
        Object.keys(grade?.modules).forEach((cmid) => {
          const module = grade.modules[cmid];
          if (module?.modname === 'quiz' && module?.quiztimelimit === 0) {
            acc.push(module?.cminstance);
          }
        });
      }
      return acc;
    }, []);
  }, [elearningGrades]);

  useEffect(() => {
    const fetchQuizAttempts = async (quizIds) => {
      try {
        const responses = await Promise.all(
          quizIds.map((quizId) =>
            elearningApi
              .getUserQuizAttempts(student?.elearningUserId, quizId)
              .then((res) => ({ quizId, data: res?.data || {} }))
              .catch((error) => {
                console.error(`Error fetching quiz ${quizId}:`, error);
                return { quizId, data: {} };
              })
          )
        );

        const quizAttempts = {};
        responses.forEach(({ quizId, data }) => {
          quizAttempts[quizId] = data;
        });

        dispatch(
          updateElearningData({
            quizAttempts,
          })
        )
      } catch (error) {
        console.error('Error fetching quiz attempts:', error);
      }
    };

    if (quizIds.length > 0 && student?.elearningUserId) fetchQuizAttempts(quizIds);
  }, [quizIds, student?.elearningUserId]);

  useEffect(() => {
    const fetchBookTime = async (bookIds) => {
      try {
        const responses = await Promise.all(
          bookIds.map((bookId) =>
            elearningApi
              .getModuleTime(bookId)
              .then((res) => {
                const totalTime =
                  res?.data?.reduce((acc, item) => {
                    if (item?.readingTime) acc += item.readingTime;
                    return acc;
                  }, 0) || 0;
                return { bookId, totalTime };
              })
              .catch((error) => {
                console.error(`Error fetching book time for ${bookId}:`, error);
                return { bookId, totalTime: 0 };
              })
          )
        );

        const bookTime = {};
        responses.forEach(({ bookId, totalTime }) => {
          bookTime[bookId] = totalTime;
        });
        dispatch(
          updateElearningData({
            bookTime,
          })
        );
      }  catch (error) {
        console.error('Error fetching book time:', error);
      }
    };

    if (bookIds.length > 0) fetchBookTime(bookIds);
  }, [bookIds]);

  useEffect(() => {
    const loadUserElearningData = async (lessonIds) => {
      const [
        userCourseGradeRes,
        activityReportRes,
        elearningCoursesRes,
        elearningCoursesContentsRes,
      ] = await Promise.all([
        elearningApi.getUserCourseGrade([student?.elearningUserId]),
        elearningApi.getElearningActivityReport(lessonIds, [
          student?.elearningUserId,
        ]),
        moodleApi.getMyEnrolledCourses('all'),
        elearningApi.getCoursesContents(lessonIds),
      ]);
      const elearningCourses = {};
      elearningCoursesRes?.map((item) => {
        elearningCourses[item.id] = item;
      });
      const elearningGrades = groupUserGradeByCourseModule(
        userCourseGradeRes?.data
      )[student?.elearningUserId]?.courses;
      const activityReport =
        activityReportRes?.data?.[student?.elearningUserId];
      const elearningCoursesContents = {};
      lessonIds?.map((lessonId) => {
        elearningCoursesContents[lessonId] = groupCourseContent(
          elearningCoursesContentsRes?.[lessonId]
        );
      });
      dispatch(
        updateElearningData({
          elearningCourses,
          elearningCoursesContents,
          elearningGrades,
          activityReport,
          elearningUser: student,
        })
      );
      setActivityReport(activityReport);
      setElearningGrades(elearningGrades);
    };

    if (student) {
      const lessonIds = student?.elearningLessons;
      loadUserElearningData(lessonIds);
    }
  }, [student]);

  useEffect(() => {
    const fetchElearningSetting = async () => {
      try {
        const responses = await Promise.all(
          student?.elearningLessons?.map((cid) =>
            elearningApi
              .getElearningSetting(cid, student?.course?.drivingType)
              .then((res) => ({
                cid,
                setting: res?.data?.[0] || null,
              }))
              .catch((error) => {
                console.error(
                  `Error fetching setting for course ${cid}:`,
                  error
                );
                return { cid, setting: null };
              })
          )
        );

        const settings = {};
        responses.forEach(({ cid, setting }) => {
          if (setting) {
            settings[cid] = setting;
          }
        });
        dispatch(
          updateElearningData({
            elearningSettings: settings,
          })
        );
      } catch (error) {
        console.error('Error fetching elearning settings:', error);
      }
    };

    if (student?.elearningLessons?.length > 0) {
      fetchElearningSetting();
    }
  }, [student]);

  return (
    <>
      <AdminLayout
        isCollapsed={isCollapsed}
        menu={STUDENT_ELEARNING_MENU}
        title={<img src={center?.logo} alt='Logo' style={{ height: '15vh' }} />}
        handleLogout={() => {
          localStorage.removeItem('moodleToken');
          localStorage.removeItem('moodleSiteInfo');
          localStorage.removeItem('forcePasswordChange');
          localStorage.removeItem('center');
          window.location.reload();
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: '50%',
          right: '10px',
          transform: 'translateY(50%)',
          zIndex: 1000,
        }}
      >
        <div className='d-flex flex-column align-items-center'>
          <Button
            variant='btn'
            href={`tel:${center?.tel}`}
            className='mb-3 p-0'
          >
            <Image src='/phone.png' alt='Phone' width={50} />
          </Button>
          <Button
            variant='white'
            className='p-0 m-0'
            href={`https://zalo.me/${center?.zalo}`}
            target='_blank'
          >
            <Image src='/zalo.png' alt='Phone' width={50} />
          </Button>
        </div>
      </div>
    </>
  );
}

export default StudentElearningLayout;
