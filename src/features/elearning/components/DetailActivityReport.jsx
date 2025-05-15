import React, { useEffect, useMemo, useState } from 'react';
import { Card, Table, Container } from 'react-bootstrap';
import { COURSE_MODULES } from 'constants/driving-elearning.constant';
import { formatTime } from 'utils/commonUtils';

function DetailActivityReport({
  activityReport,
  elearningCourses,
  elearningCoursesContents,
  elearningGrades,
  elearningUser,
  elearningSettings,
  quizAttempts = null,
  bookTime,
}) {
  const totalTimes = useMemo(() => {
    if (!activityReport || !elearningGrades || !elearningCoursesContents)
      return {};

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
              (quizAttempts?.[grade?.cminstance]?.totalQuestionsAnswered || 0) *
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

    return totals;
  }, [
    activityReport,
    elearningGrades,
    elearningCoursesContents,
    quizAttempts,
    bookTime,
    elearningSettings,
  ]);

  return (
    <div className='mt-4'>
      <Card className='mb-3'>
        <Card.Header className='d-flex justify-content-between align-items-center'>
          <h5>Kết quả tổng hợp</h5>
          <span className='text-muted'>
            {elearningUser?.name} - {elearningUser?.course?.name}
          </span>
        </Card.Header>

        <Card.Body>
          <Table striped bordered hover size='sm'>
            <thead>
              <tr>
                <th>Môn học</th>
                <th>Tổng thời gian đã tích luỹ</th>
                <th>Thời gian yêu cầu tổi thiểu</th>
                <th>Kết quả</th>
              </tr>
            </thead>
            <tbody>
              {elearningCourses &&
                Object.keys(elearningCourses).map((key) => {
                  const course = elearningCourses?.[key];
                  const totalTime = totalTimes?.[key] || 0;
                  const requiredTime = elearningSettings?.[key]?.minTimeInHour*60*60 || 0;

                  if(elearningUser?.elearningLessons?.includes(course.id) === false) return null;

                  return (
                    <tr key={key}>
                      <td>{course?.fullname}</td>
                      <td>{formatTime(totalTime)}</td>
                      <td>{formatTime(requiredTime)}</td>
                      <td>
                        {totalTime >= requiredTime ? (
                          <span className='text-success'>Đã đủ giờ</span>
                        ) : (
                          <span className='text-danger'>Chưa đủ giờ</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      {activityReport &&
        Object.keys(activityReport).map((key) => {
          const activities = activityReport?.[key];

          if(!elearningCourses?.[key]) return null;

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
                        <th>Điểm để qua</th>
                        <th>Trạng thái</th>
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
                            grade?.finalgrade >= grade?.gradepass
                          ) {
                            timeSpent = grade?.quiztimelimit;
                          } else if (grade?.quiztimelimit === 0) {
                            timeSpent =
                              quizAttempts?.[grade?.cminstance]
                                ?.totalQuestionsAnswered *
                              elearningSettings?.[key]
                                ?.timePerQuestionInMinute *
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
                                <span>{grade?.finalgrade || 0}/{grade?.grademax}</span>
                              ) : activity.modname === 'quiz' ? (
                                <span>{grade?.finalgrade || 0}/{grade?.grademax}</span>
                              ) : activity.modname === 'book' ? (
                                <span>
                                  {activity?.isoverallcomplete ? 10 : 0}/10
                                </span>
                              ) : null}
                            </td>
                            <td>
                              {activity.modname === 'supervideo' ? (
                                <span>{grade?.gradepass || 0}</span>
                              ) : activity.modname === 'quiz' ? (
                                <span>{grade?.gradepass || 0}</span>
                              ) : activity.modname === 'book' ? (
                                <span>10</span>
                              ) : null}
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
