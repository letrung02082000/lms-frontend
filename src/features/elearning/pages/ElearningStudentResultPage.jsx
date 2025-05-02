import React, { useEffect, useMemo, useRef, useState } from 'react';
import moodleApi from 'services/moodleApi';
import {
  calculateTotalLearningTimeForDate,
  groupActivityReport,
  groupUserGradeByCourseModule,
} from 'utils/elearning.utils';
import { Table } from 'react-bootstrap';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatTime } from 'utils/commonUtils';
import DetailActivityReport from '../components/DetailActivityReport';
import elearningApi from 'api/elearningApi';
import { PATH } from 'constants/path';
import { toastWrapper } from 'utils';

function ElearningStudentResultPage() {
  const moodleToken = localStorage.getItem('moodleToken');
  const [center] = React.useState(() => {
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
  const [courseReport, setCourseReport] = useState(null);
  const [elearningCourses, setElearningCourses] = useState({});
  const [elearningCoursesContents, setElearningCoursesContents] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [userCourseGrade, setUserCourseGrade] = useState(null);
  const [activityReport, setActivityReport] = useState(null);
  const [activityReportLoading, setActivityReportLoading] = useState(true);
  const [lessonIds, setLessonIds] = useState([]);
  const [quizAttempts, setQuizAttempts] = useState({});
  const [bookTime, setBookTime] = useState({});
  const [elearningSettings, setElearningSettings] = useState({});
  const [elearningSettingLoading, setElearningSettingLoading] = useState(true);
  const [bookTimeLoading, setBookTimeLoading] = useState(true);
  const [quizAttemptsLoading, setQuizAttemptsLoading] = useState(true);
  const [elearningCoursesLoading, setElearningCoursesLoading] = useState(true);

  useEffect(() => {
    if (!moodleToken) {
      window.location.href = '/elearning/login';
    } else {
      setLoading(true);
      elearningApi
        .getUserByMoodleToken(moodleToken)
        .then((res) => {
          setStudent(res.data);
          setLessonIds(res.data?.elearningLessons);
        })
        .catch((error) => {
          console.error('Error fetching site info:', error);
          localStorage.removeItem('moodleToken');
          window.location.href = PATH.ELEARNING.LOGIN;
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [moodleToken]);

  useEffect(() => {
    if (student) {
      setActivityReportLoading(true);
      setActivityReport(null);

      const fetchData = async () => {
        try {
          const [userCourseGradeRes, activityReportRes] = await Promise.all([
            elearningApi.getUserCourseGrade([student?.elearningUserId]),
            elearningApi.getElearningActivityReport(lessonIds, [
              student?.elearningUserId,
            ]),
          ]);

          setUserCourseGrade(
            groupUserGradeByCourseModule(userCourseGradeRes?.data)[
              student?.elearningUserId
            ]
          );
          setActivityReport(
            activityReportRes?.data?.[student?.elearningUserId]
          );
        } catch (err) {
          console.error('Error fetching activity report:', err);
          toastWrapper('Có lỗi xảy ra', 'error');
        } finally {
          setActivityReportLoading(false);
        }
      };

      fetchData();
    }
  }, [student]);

  useEffect(() => {
    if (center?._id) {
      setElearningCoursesLoading(true);
      elearningApi
        .getCoursesByCenter(center?._id)
        .then(async (res) => {
          const elearningCourses = {};
          res?.data?.courses?.map((item) => {
            elearningCourses[item.id] = item;
          });
          setElearningCourses(elearningCourses);

          const elearningCoursesContents =
            await elearningApi.getCoursesContents(
              res?.data?.courses?.map((item) => item.id)
            );
          const elearningCoursesContentsMap = {};
          res?.data?.courses?.map((item) => {
            elearningCoursesContentsMap[item.id] = groupActivityReport(
              elearningCoursesContents?.[item.id]
            );
          });
          setElearningCoursesContents(elearningCoursesContentsMap);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setElearningCoursesLoading(false);
        });
    }
  }, [center?._id]);

  const quizIds = useMemo(() => {
    if (!userCourseGrade?.courses) return [];
    return Object.values(userCourseGrade?.courses).reduce((acc, grade) => {
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
  }, [userCourseGrade?.courses]);

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

  useEffect(() => {
    const fetchQuizAttempts = async (quizIds) => {
      setQuizAttemptsLoading(true);
      try {
        const responses = await Promise.all(
          quizIds.map((quizId) =>
            elearningApi
              .getLastUserQuizAttempt(student?.elearningUserId, quizId)
              .then((res) => ({ quizId, data: res?.data || {} }))
              .catch((error) => {
                console.error(`Error fetching quiz ${quizId}:`, error);
                return { quizId, data: {} }; // fallback empty data
              })
          )
        );

        const quizAttempts = {};
        responses.forEach(({ quizId, data }) => {
          quizAttempts[quizId] = data;
        });

        setQuizAttempts(quizAttempts);
      } finally {
        setQuizAttemptsLoading(false);
      }
    };

    if (quizIds.length > 0) fetchQuizAttempts(quizIds);
  }, [quizIds, student?.elearningUserId]);

  useEffect(() => {
    const fetchBookTime = async (bookIds) => {
      setBookTimeLoading(true);
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
                return { bookId, totalTime: 0 }; // fallback
              })
          )
        );

        const bookTime = {};
        responses.forEach(({ bookId, totalTime }) => {
          bookTime[bookId] = totalTime;
        });

        setBookTime(bookTime);
      } finally {
        setBookTimeLoading(false);
      }
    };

    if (bookIds.length > 0) fetchBookTime(bookIds);
  }, [bookIds]);

  useEffect(() => {
    const fetchElearningSetting = async () => {
      try {
        setElearningSettingLoading(true);
        const courseIds = Object.keys(elearningCourses);

        const responses = await Promise.all(
          courseIds.map((cid) =>
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

        setElearningSettings(settings);
      } finally {
        setElearningSettingLoading(false);
      }
    };

    if (Object.keys(elearningCourses).length > 0) {
      fetchElearningSetting();
    }
  }, [elearningCourses]);

  if (error) {
    return (
      <div className='mt-4'>
        <ErrorMessage message={error} />
      </div>
    );
  }

  const today = Date.now();
  const threshold = 5;
  const courseEntries = Object.entries(userCourseGrade?.courses || {});
  const timePerCourse = courseEntries.map(([courseId, course]) => {
    const timeSpent = calculateTotalLearningTimeForDate({
      data: course.modules || {},
      targetDate: today,
      intervalTime: threshold,
      elearningSetting: elearningSettings?.[courseId],
      quizAttempts: quizAttempts,
    });
    return {
      courseId,
      coursename: course.coursename,
      timeSpent,
    };
  });

  const totalTodayTime = timePerCourse.reduce((sum, c) => sum + c.timeSpent, 0);

  return (
    <div style={{ overflowY: 'scroll', height: '100vh', padding: '20px' }}>
      <div className='mt-4'>
        {loading ||
          elearningCoursesLoading ||
        activityReportLoading ||
        bookTimeLoading ||
        quizAttemptsLoading ||
        elearningSettingLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className='mt-4'>
              <h2 className='mb-4'>Thời gian học hôm nay</h2>
              <div>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Môn học</th>
                      <th>Thời gian tích luỹ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timePerCourse
                      .filter((item) => item.timeSpent > 0)
                      .map(({ courseId, coursename, timeSpent }) => (
                        <tr key={courseId}>
                          <td>{coursename}</td>
                          <td>{formatTime(timeSpent)}</td>
                        </tr>
                      ))}
                    <tr>
                      <td className='text-end'>
                        <strong>Tổng cộng</strong>
                      </td>
                      <td>
                        <strong>{formatTime(totalTodayTime)}</strong>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
            <h2>Báo cáo kết quả toàn khoá học</h2>
            <DetailActivityReport
              elearningUser={student}
              elearningGrades={userCourseGrade?.courses}
              activityReport={activityReport}
              elearningCourses={elearningCourses}
              elearningCoursesContents={elearningCoursesContents}
              quizAttempts={quizAttempts}
              bookTime={bookTime}
              elearningSettings={elearningSettings}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default ElearningStudentResultPage;
