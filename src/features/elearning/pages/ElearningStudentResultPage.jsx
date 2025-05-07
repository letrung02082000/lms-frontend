import React, { useEffect, useMemo, useRef, useState } from 'react';
import moodleApi from 'services/moodleApi';
import {
  calculateTotalLearningTimeForDate,
  groupCourseContent,
  groupUserGradeByCourseModule,
} from 'utils/elearning.utils';
import { Table } from 'react-bootstrap';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatTime } from 'utils/commonUtils';
import DetailActivityReport from '../components/DetailActivityReport';
import elearningApi from 'api/elearningApi';
import { PATH } from 'constants/path';
import { toastWrapper } from 'utils';
import { useDispatch, useSelector } from 'react-redux';
import { selectElearningData, updateElearningData } from 'store/elearning.slice';

function ElearningStudentResultPage() {
  const dispatch = useDispatch();
  const elearningData = useSelector(selectElearningData);
  const {
    elearningCourses,
    elearningCoursesContents,
    elearningUser,
    elearningSettings,
    bookTime,
    elearningGrades,
    quizAttempts,
    activityReport,
  } = elearningData;
  const [loading, setLoading] = useState(true);
  const [quizAttemptsLoading, setQuizAttemptsLoading] = useState(true);

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
        setQuizAttemptsLoading(true);
        const responses = await Promise.all(
          quizIds.map((quizId) =>
            elearningApi
              .getUserQuizAttempts(elearningUser?.elearningUserId, quizId)
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
        toastWrapper.error('Có lỗi xảy ra khi tải dữ liệu bài kiểm tra của bạn!');
      } finally {
        setQuizAttemptsLoading(false);
      }
    };

    if (quizIds.length > 0 && elearningUser?.elearningUserId)
      fetchQuizAttempts(quizIds);
  }, [quizIds?.length, elearningUser?.elearningUserId]);

  useEffect(() => {
    const loadUserElearningData = async (lessonIds) => {
      try {
        setLoading(true);
        const [userCourseGradeRes, activityReportRes] = await Promise.all([
          elearningApi.getUserCourseGrade([elearningUser?.elearningUserId]),
          elearningApi.getElearningActivityReport(lessonIds, [
            elearningUser?.elearningUserId,
          ]),
        ]);
        const elearningGrades = groupUserGradeByCourseModule(
          userCourseGradeRes?.data
        )[elearningUser?.elearningUserId]?.courses;
        const activityReport = activityReportRes?.data?.[elearningUser?.elearningUserId];
        dispatch(
          updateElearningData({
            elearningGrades,
            activityReport,
          })
        );
      } catch (error) {
        console.error('Error fetching user elearning data:', error);
        toastWrapper.error('Có lỗi xảy ra khi tải dữ liệu học tập của bạn!');
      } finally {
        setLoading(false);
      }
    };

    if (elearningUser) {
      const lessonIds = elearningUser?.elearningLessons;
      loadUserElearningData(lessonIds);
    }
  }, [elearningUser]);

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

  return (
    <div style={{ overflowY: 'scroll', height: '100vh', padding: '20px' }}>
      <div className='mt-4'>
        {loading ||
        quizAttemptsLoading ||
        !elearningUser ||
        !elearningCourses ||
        !elearningCoursesContents ||
        !elearningSettings ||
        !bookTime ? (
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
              elearningUser={elearningUser}
              elearningGrades={elearningGrades}
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
