import React, { useEffect } from 'react';
import moodleApi from 'services/moodleApi';
import { groupByUserCourseModule } from 'utils/elearning.utils';
import CourseReportAccordion from '../components/CourseReportAccordion';
import { Button, Container } from 'react-bootstrap';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';

function ElearningStudentResultPage() {
  const studentInfo = JSON.parse(localStorage.getItem('moodleSiteInfo'));
  const [courseReport, setCourseReport] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [isLoading, setLoading] = React.useState(true);

  useEffect(() => {
    setLoading(true);

    if (studentInfo?.userid) {
      moodleApi
        .getUserCourseReport({
          userIds: [studentInfo?.userid],
        })
        .then((data) => {
          const reportData = groupByUserCourseModule(data);
          console.log(reportData);
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
        <h2 className='mb-4'>Kết quả học tập của học viên</h2>
        {courseReport ? (
          <CourseReportAccordion courseReport={courseReport} />
        ) : (
          <p>Chưa có dữ liệu học tập.</p>
        )}
      </Container>
    </div>
  );
}

export default ElearningStudentResultPage;
