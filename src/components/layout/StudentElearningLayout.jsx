import React, { useEffect, useMemo } from 'react';
import AdminLayout from './AdminLayout';
import { STUDENT_ELEARNING_MENU } from 'constants/menu';
import elearningApi from 'api/elearningApi';
import { Button, Image } from 'react-bootstrap';
import { PATH } from 'constants/path';
import { useDispatch, useSelector } from 'react-redux';
import { selectElearningData, selectElearningUser, updateElearningData } from 'store/elearning.slice';
import {
  calculateTotalLearningTimeForDate,
  groupCourseContent,
  groupUserGradeByCourseModule,
} from 'utils/elearning.utils';
import moodleApi from 'services/moodleApi';

function StudentElearningLayout() {
  const dispatch = useDispatch();
  const student = useSelector(selectElearningUser);
  const elearningData = useSelector(selectElearningData);
  const { activityReport, elearningGrades, elearningSettings, quizAttempts, isLimitExceeded, elearningUser } = elearningData;
  const today = Date.now();
  const threshold = 5;
  const courseEntries = Object.entries(elearningGrades || {});
  const timePerCourse = courseEntries.map(([courseId, course]) => {
    const timeSpent = calculateTotalLearningTimeForDate({
      data: course.modules || {},
      targetDate: today,
      intervalTime: threshold,
      elearningSetting: elearningSettings?.[courseId],
      quizAttempts: quizAttempts || {},
    });
    return {
      courseId,
      coursename: course.coursename,
      timeSpent,
    };
  });

  const totalTodayTime = timePerCourse.reduce((sum, c) => sum + c.timeSpent, 0);
  const timeLimitPerDay = 8 * 60 * 60; // 8 hours in seconds
  
  useEffect(() => {
    const isLimitExceeded = totalTodayTime > timeLimitPerDay;
    dispatch(
      updateElearningData({
        isLimitExceeded,
        timeLimitPerDay,
        totalTodayTime,
      })
    );
  }, [totalTodayTime, timeLimitPerDay]);
  
  const [isCollapsed, setIsCollapsed] = React.useState(
    window.location.pathname?.includes('/elearning/student/book')
  );

  useEffect(() => {
    const moodleToken = localStorage.getItem('moodleToken');
    if (!moodleToken) {
      window.location.href = '/elearning/login';
    } else {
      elearningApi
        .getUserByMoodleToken(moodleToken)
        .then((res) => {
          dispatch(
            updateElearningData({
              elearningUser: res.data,
            })
          );
        })
        .catch((error) => {
          console.error('Error fetching site info:', error);
          window.location.href = PATH.ELEARNING.LOGIN;
        });
    }
  }, []);

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
        );
      } catch (error) {
        console.error('Error fetching quiz attempts:', error);
      }
    };

    if (quizIds.length > 0 && student?.elearningUserId)
      fetchQuizAttempts(quizIds);
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
      } catch (error) {
        console.error('Error fetching book time:', error);
      }
    };

    if (bookIds.length > 0) fetchBookTime(bookIds);
  }, [bookIds?.length]);

  const loadUserElearningData = async (lessonIds) => {
    const [
      userCourseGradeRes,
      activityReportRes,
    ] = await Promise.all([
      elearningApi.getUserCourseGrade([student?.elearningUserId]),
      elearningApi.getElearningActivityReport(lessonIds, [
        student?.elearningUserId,
      ]),
    ]);
    const elearningGrades = groupUserGradeByCourseModule(
      userCourseGradeRes?.data
    )[student?.elearningUserId]?.courses;
    const activityReport = activityReportRes?.data?.[student?.elearningUserId];
    dispatch(
      updateElearningData({
        elearningGrades,
        activityReport,
      })
    );
  };

  useEffect(() => {
    const loadElearningCoursesData = async (lessonIds) => {
      const [elearningCoursesRes, elearningCoursesContentsRes] =
        await Promise.all([
          moodleApi.getMyEnrolledCourses('all'),
          elearningApi.getCoursesContents(lessonIds),
        ]);
      const elearningCourses = {};
      elearningCoursesRes?.map((item) => {
        elearningCourses[item.id] = item;
      });
      const elearningCoursesContents = {};
      lessonIds?.map((lessonId) => {
        elearningCoursesContents[lessonId] = groupCourseContent(
          elearningCoursesContentsRes?.[lessonId] || []
        );
      });
      dispatch(
        updateElearningData({
          elearningCourses,
          elearningCoursesContents,
        })
      );
    };

    if (student) {
      const lessonIds = student?.elearningLessons;
      loadElearningCoursesData(lessonIds);
    }

    const intervalId = setInterval(() => {
      if (student?.elearningUserId && !isLimitExceeded) {
        loadUserElearningData(student?.elearningLessons);
      }
    }, 1000 * 60 * 5); // 5 minutes

    return () => {
      clearInterval(intervalId);
    };
  }, [student?.elearningUserId]);

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
  }, [student?.elearningUserId]);

  return (
    <>
      <AdminLayout
        isCollapsed={isCollapsed}
        menu={STUDENT_ELEARNING_MENU}
        title={<img src={elearningUser?.center?.logo} alt='Logo' style={{ height: '15vh' }} />}
        handleLogout={() => {
          dispatch(
            updateElearningData({
              activityReport: null,
              elearningCourses: null,
              elearningCoursesContents: null,
              elearningGrades: null,
              elearningUser: null,
              elearningSettings: null,
              bookTime: null,
              quizAttempts: null,
              isLimitExceeded: false,
              timeLimitPerDay: null,
              totalTodayTime: null,
            })
          );
          localStorage.removeItem('moodleToken');
          localStorage.removeItem('moodleSiteInfo');
          localStorage.removeItem('forcePasswordChange');
          window.location.reload();
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: '50px',
          right: '10px',
          zIndex: 1000,
        }}
      >
        <div className='d-flex flex-column align-items-center'>
          <Button
            variant='btn'
            href={`tel:${elearningUser?.center?.tel}`}
            className='mb-3 p-0'
          >
            <Image src='/phone.png' alt='Phone' width={50} />
          </Button>
          <Button
            variant='white'
            className='p-0 m-0'
            href={`https://zalo.me/${elearningUser?.center?.zalo}`}
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
