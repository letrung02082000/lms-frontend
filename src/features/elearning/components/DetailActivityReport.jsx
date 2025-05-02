import React, { useEffect, useMemo, useState } from 'react';
import { Card, Table, Container } from 'react-bootstrap';
import elearningApi from 'api/elearningApi';
import { COURSE_MODULES } from 'constants/driving-elearning.constant';
import { formatTime } from 'utils/commonUtils';

function DetailActivityReport({
  activityReport,
  elearningCourses,
  elearningCoursesContents,
  elearningGrades,
  elearningUser,
}) {
  console.log(elearningCoursesContents)
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [bookTime, setBookTime] = useState([]);
  const [elearningSettings, setElearningSettings] = useState({});
  const [totalTimes, setTotalTimes] = useState({});

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
      let quizAttempts = {};
      for (let quizId of quizIds) {
        try {
          const res = await elearningApi.getLastUserQuizAttempt(
            elearningUser?.elearningUserId,
            quizId
          );
          quizAttempts[quizId] = res?.data || {};
        } catch (error) {
          console.error('Error fetching quiz attempts:', error);
        }
      }
      setQuizAttempts(quizAttempts);
    };

    if (quizIds.length > 0) fetchQuizAttempts(quizIds);
  }, [quizIds]);

  useEffect(() => {
    const fetchBookTime = async (bookIds) => {
      let bookTime = {};
      for (let bookId of bookIds) {
        try {
          const res = await elearningApi.getModuleTime(bookId);
          bookTime[bookId] =
            res?.data?.reduce((acc, item) => {
              if (item?.readingTime) acc += item.readingTime;
              return acc;
            }, 0) || 0;
        } catch (error) {
          console.error('Error fetching book time: ', error);
        }
      }
      setBookTime(bookTime);
    };

    if (bookIds.length > 0) fetchBookTime(bookIds);
  }, [bookIds]);

  useEffect(() => {
    const fetchElearningSetting = async () => {
      let settings = {};
      for (let cid of Object.keys(elearningCourses)) {
        try {
          const res = await elearningApi.getElearningSetting(
            cid,
            elearningUser?.course?.drivingType
          );
          if (res?.data?.[0]) {
            settings[cid] = res.data[0];
          }
        } catch (error) {
          console.error('Error fetching elearning setting:', error);
        }
      }
      setElearningSettings(settings);
    };

    fetchElearningSetting();
  }, []);

  useEffect(() => {
    if (!activityReport || !elearningGrades || !elearningCoursesContents) return;

    const totals = {};
    Object.keys(activityReport).forEach((key) => {
      const activities = activityReport?.[key];
      let totalTime = 0;

      activities.forEach((activity) => {
        const grade = elearningGrades?.[key]?.modules?.[activity.cmid];
        let timeSpent = 0;

        if (
          grade?.finalgrade &&
          grade?.duration &&
          activity.modname === 'supervideo'
        ) {
          timeSpent = Math.floor((grade?.finalgrade * grade?.duration) / 100);
        } else if (grade && activity.modname === 'quiz') {
          if (
            grade?.quiztimelimit > 0 &&
            grade?.finalgrade > grade?.gradepass
          ) {
            timeSpent = grade?.quiztimelimit;
          } else if (grade?.quiztimelimit === 0) {
            timeSpent =
              (quizAttempts?.[grade?.cminstance]?.questionsAnswered || 0) *
              (elearningSettings?.[key]?.timePerQuestionInMinute || 0) *
              60;
          }
        } else if (
          activity?.isoverallcomplete &&
          activity?.modname === 'book'
        ) {
          timeSpent = bookTime?.[activity?.cmid] * 60 || 0;
        }

        totalTime += timeSpent;
      });

      totals[key] = totalTime;
    });

    setTotalTimes(totals);
  }, [activityReport, elearningGrades, elearningCoursesContents, quizAttempts, bookTime, elearningSettings]);
  return (
    <div className='mt-4'>
      <Card className='mb-3'>
        <Card.Body>
          <Table striped bordered hover size='sm'>
            <thead>
              <tr>
                <th>Tên học viên</th>
                <th>Thời gian tích luỹ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{elearningUser?.name}</td>
                <td>{formatTime(Object.values(totalTimes).reduce(
                  (acc, time) => acc + time,
                  0
                ))}</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      {activityReport &&
        Object.keys(activityReport).map((key) => {
          const activities = activityReport?.[key];

          return (
            <React.Fragment key={key}>
              <Card className='mb-3'>
                <Card.Header className='d-flex justify-content-between align-items-center'>
                  <h5>{elearningCourses?.[key]?.fullname}</h5>
                </Card.Header>
                <Card.Body>
                  <Table striped bordered hover size='sm'>
                    <thead>
                      <tr>
                        <th>Tên hoạt động, bài học</th>
                        <th>Loại hoạt động</th>
                        <th>Điểm</th>
                        <th>Tình trạng</th>
                        <th>Thời gian tích luỹ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activities.map((activity) => {
                        const courseContent =
                          elearningCoursesContents?.[key]?.[activity.cmid];
                        const grade =
                          elearningGrades?.[key]?.modules?.[activity.cmid];
                        let timeSpent = 0;

                        if (grade && activity.modname === 'supervideo') {
                          timeSpent = Math.floor(
                            (grade?.finalgrade * grade?.duration) / 100
                          );
                        } else if (grade && activity.modname === 'quiz') {
                          if (
                            grade?.quiztimelimit > 0 &&
                            grade?.finalgrade > grade?.gradepass
                          ) {
                            timeSpent = grade?.quiztimelimit;
                          } else if (grade?.quiztimelimit === 0) {
                            timeSpent =
                              quizAttempts?.[grade?.cminstance]
                                ?.questionsAnswered *
                              elearningSettings?.[key]?.timePerQuestionInMinute *
                              60;
                          }
                        } else if (
                          activity?.isoverallcomplete &&
                          activity?.modname === 'book'
                        ) {
                          timeSpent = bookTime?.[activity?.cmid] * 60 || 0;
                        }

                        return (
                          <tr key={activity.cmid}>
                            <td>{courseContent?.name}</td>
                            <td>{COURSE_MODULES[activity?.modname]}</td>
                            <td>
                              {activity.modname === 'supervideo' ? (
                                <span>{grade?.finalgrade || 0}/100</span>
                              ) : activity.modname === 'quiz' ? (
                                <span>{grade?.finalgrade || 0}/10</span>
                              ) : (
                                <span>{activity?.grade || 0}</span>
                              )}
                            </td>
                            <td>
                              {activity.isoverallcomplete ? (
                                <span className='text-success'>
                                  Đã hoàn thành
                                </span>
                              ) : (
                                <span className='text-danger'>
                                  Chưa hoàn thành
                                </span>
                              )}
                            </td>
                            <td>{formatTime(timeSpent)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </React.Fragment>
          );
        })}
    </div>
  );
}

export default DetailActivityReport;
