import React, { useEffect, useMemo, useRef, useState } from 'react';
import moodleApi from 'services/moodleApi';
import {
  calculateTotalLearningTimeForDate,
  groupActivityReport,
  groupByUserCourseModule,
  groupGradeReport,
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
  const [isLoading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [userCourseGrade, setUserCourseGrade] = useState(null);
  const [activityReport, setActivityReport] = useState(null);
  const [activityReportLoading, setActivityReportLoading] = useState(false);
  const [lessonIds, setLessonIds] = useState([]);
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

  // Tải dữ liệu học tập của người dùng
  useEffect(() => {
    if (!student?.userid) return;

    setLoading(true);
    moodleApi
      .getUserCourseReport({
        userIds: [student.elearningUserId],
      })
      .then((data) => {
        const reportData = groupByUserCourseModule(data);
        setCourseReport(reportData[student.elearningUserId]);
      })
      .catch((err) => {
        console.error('Error fetching course report:', err);
        setError('Không thể tải báo cáo học tập.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [student?.elearningUserId]);

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
            groupGradeReport(userCourseGradeRes?.data)[student?.elearningUserId]
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
      setLoading(true);
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
          setLoading(false);
        });
    }
  }, [center?._id]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className='mt-4'>
        <ErrorMessage message={error} />
      </div>
    );
  }

  // Tính tổng thời gian học trong ngày hôm nay
  const today = Date.now();
  const threshold = 5000;
  const courseEntries = Object.entries(courseReport?.courses || {});
  const timePerCourse = courseEntries.map(([courseId, course]) => {
    const timeSpent = calculateTotalLearningTimeForDate(
      course.modules || {},
      today,
      threshold
    );
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
                    <td>{formatTime(timeSpent / 1000)}</td>
                  </tr>
                ))}
              <tr>
                <td className='text-end'>
                  <strong>Tổng cộng</strong>
                </td>
                <td>
                  <strong>{formatTime(totalTodayTime / 1000)}</strong>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>

      <div className='mt-4'>
        <h2>Kết quả học tập</h2>
        {activityReportLoading ? (
          <LoadingSpinner />
        ) : (
          <DetailActivityReport
            elearningUser={student}
            elearningGrades={userCourseGrade?.courses}
            activityReport={activityReport}
            elearningCourses={elearningCourses}
            elearningCoursesContents={elearningCoursesContents}
          />
        )}
      </div>
    </div>
  );
}

export default ElearningStudentResultPage;
