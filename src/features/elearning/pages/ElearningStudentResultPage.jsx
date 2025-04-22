import React, { useEffect, useRef } from 'react';
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
  const studentInfo = JSON.parse(localStorage.getItem('moodleSiteInfo'));
  const [courseReport, setCourseReport] = React.useState(null);
  const [courses, setCourses] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [isLoading, setLoading] = React.useState(true);
  const totalTime = useRef(0);

  useEffect(() => {
    if (studentInfo?.userid) {
      setLoading(true);
      moodleApi
        .getUserCourseReport({
          userIds: [studentInfo?.userid],
        })
        .then((data) => {
          const reportData = groupByUserCourseModule(data);
          setCourseReport(reportData[studentInfo?.userid]);
        })
        .catch((error) => {
          console.error('Error fetching course report:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    if (studentInfo?.userid) {
      moodleApi
        .getMyEnrolledCourses('all')
        .then((courses) => {
          setCourses(courses);
        })
        .catch((error) => {
          console.error('Error fetching courses:', error);
        });
    }
  }, [studentInfo?.userid]);

  useEffect(() => {
    if (studentInfo?.userid && courses.length > 0) {
      moodleApi
        .getCoursesCompletionStatus(
          courses?.map((course) => course.id),
          studentInfo?.userid
        )
        .then((data) => {
          console.log('Courses completion status:', data);
        })
        .catch((error) => {
          console.error('Error fetching course completion status:', error);
        });
    }
  }, [courses?.length]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error && !isLoading) {
    return (
      <div className='mt-4'>
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div
      style={{
        overflowY: 'scroll',
        height: '100vh',
        padding: '20px',
      }}
    >
      <Container>
        <Row className='mt-4'>
          <h2 className='mb-4'>Thời gian học hôm nay</h2>
          <Col>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Môn học</th>
                  <th>Thời gian tích luỹ</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(courseReport?.courses || {}).map((courseId) => {
                  const course = courseReport?.courses[courseId];
                  const todaySpentTime = calculateTotalLearningTimeForDate(
                    course?.modules || {},
                    Date.now(),
                    5000
                  );
                  totalTime.current += todaySpentTime;
                  if (todaySpentTime === 0) return null;

                  return (
                    <tr key={courseId}>
                      <td>{course?.coursename}</td>
                      <td>{formatTime(todaySpentTime / 1000)}</td>
                    </tr>
                  );
                })}
                <tr>
                  <td className='text-end'>
                    <strong>Tổng cộng</strong>
                  </td>
                  <td>
                    <strong>{formatTime(totalTime.current / 1000)}</strong>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row className='mt-4'>
          <h2 className='mb-4'>Kết quả học tập toàn khoá</h2>
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
