import React, { useEffect, useMemo, useRef, useState } from 'react';
import moodleApi from 'services/moodleApi';
import {
  calculateTotalLearningTimeForDate,
  groupByUserCourseModule,
} from 'utils/elearning.utils';
import CourseReportAccordion from '../components/CourseReportAccordion';
import { Button, Card, Col, Container, Row, Table } from 'react-bootstrap';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatTime } from 'utils/commonUtils';

function ElearningStudentResultPage() {
  const studentInfo = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('moodleSiteInfo'));
    } catch (e) {
      return null;
    }
  }, []);

  const [courseReport, setCourseReport] = useState(null);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(true);

  // Tải dữ liệu học tập của người dùng
  useEffect(() => {
    if (!studentInfo?.userid) return;

    setLoading(true);
    moodleApi
      .getUserCourseReport({
        userIds: [studentInfo.userid],
      })
      .then((data) => {
        const reportData = groupByUserCourseModule(data);
        setCourseReport(reportData[studentInfo.userid]);
      })
      .catch((err) => {
        console.error('Error fetching course report:', err);
        setError('Không thể tải báo cáo học tập.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [studentInfo?.userid]);

  // Tải danh sách khoá học đã đăng ký
  useEffect(() => {
    if (!studentInfo?.userid) return;

    moodleApi
      .getMyEnrolledCourses('all')
      .then(setCourses)
      .catch((err) => {
        console.error('Error fetching courses:', err);
        setError('Không thể tải danh sách môn học.');
      });
  }, [studentInfo?.userid]);

  // Tải trạng thái hoàn thành khoá học (nếu cần)
  useEffect(() => {
    if (!studentInfo?.userid || courses.length === 0) return;

    moodleApi
      .getCoursesCompletionStatus(
        courses.map((course) => course.id),
        studentInfo.userid
      )
      .then((data) => {
        console.log('Courses completion status:', data);
      })
      .catch((err) => {
        console.error('Error fetching course completion status:', err);
      });
  }, [courses, studentInfo?.userid]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="mt-4">
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

  const totalTodayTime = timePerCourse.reduce(
    (sum, c) => sum + c.timeSpent,
    0
  );

  return (
    <div style={{ overflowY: 'scroll', height: '100vh', padding: '20px' }}>
      <Container>
        <Row className="mt-4">
          <h2 className="mb-4">Thời gian học hôm nay</h2>
          <Col>
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
                  <td className="text-end">
                    <strong>Tổng cộng</strong>
                  </td>
                  <td>
                    <strong>{formatTime(totalTodayTime / 1000)}</strong>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>

        <Row className="mt-4">
          <h2 className="mb-4">Kết quả học tập toàn khoá</h2>
          <Col>
            {courseReport ? (
              <CourseReportAccordion courseReport={courseReport} />
            ) : (
              <p>Chưa có dữ liệu học tập.</p>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ElearningStudentResultPage;
