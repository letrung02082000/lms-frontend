import React, { useEffect } from 'react';
import moodleApi from 'services/moodleApi';
import { groupByUserCourseModule } from 'utils/elearning.utils';
import CourseReportAccordion from '../components/CourseReportAccordion';
import { Container } from 'react-bootstrap';

function ElearningStudentResultPage() {
  const studentInfo = JSON.parse(localStorage.getItem('moodleSiteInfo'));
  const [courseReport, setCourseReport] = React.useState(null);

  useEffect(() => {
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
        });
    }
  }, []);

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
