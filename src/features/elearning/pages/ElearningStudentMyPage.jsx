import elearningApi from 'api/elearningApi';
import { GENDERS } from 'constants/driving-student.constant';
import React, { useEffect } from 'react';
import { Card, Col, Container, Image, Row, Table } from 'react-bootstrap';
import moodleApi from 'services/moodleApi';
import { groupByUserCourseModule } from 'utils/elearning.utils';

function ElearningStudentMyPage() {
  const moodleToken = localStorage.getItem('moodleToken');
  const [student, setStudent] = React.useState(null);
  const [courseReport, setCourseReport] = React.useState(null);
  console.log(courseReport);
  useEffect(() => {
    if (!moodleToken) {
      window.location.href = '/elearning/login';
    } else {
      elearningApi
        .getUserByMoodleToken(moodleToken)
        .then((res) => {
          setStudent(res.data);
        })
        .catch((error) => {
          console.error('Error fetching site info:', error);
          localStorage.removeItem('moodleToken');
          window.location.href = '/elearning/login';
        });
    }
  }, [moodleToken]);

  useEffect(() => {
    if (student) {
      moodleApi
        .getUserCourseReport({
          userIds: [student?.elearningUserId],
        })
        .then((data) => {
          const reportData = groupByUserCourseModule(data);
          setCourseReport(reportData[student?.elearningUserId]);
        })
        .catch((error) => {
          console.error('Error fetching course report:', error);
        });
    }
  }, [student]);

  return (
    <div
      style={{
        height: '100vh',
        overflowY: 'scroll',
      }}
    >
      <Container className='mt-4'>
        <Card className='mb-4 shadow-sm'>
          <Card.Body>
            <Row>
              <Col md={2} className='text-center'>
                <Image
                  src={
                    student?.portraitUrl ||
                    'https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg'
                  }
                  roundedCircle
                  width={100}
                  height={100}
                  alt='avatar'
                />
              </Col>
              <Col md={5}>
                <h4>{student?.name || 'Chưa cập nhật'}</h4>
                <p>
                  <strong>Mã học viên:</strong>{' '}
                  {student?.registrationCode || 'Chưa cập nhật'}
                </p>
                <p>
                  <strong>Số CMND/CCCD:</strong>{' '}
                  {student?.cardNumber || 'Chưa cập nhật'}
                </p>
                <p>
                  <strong>Giới tính:</strong>{' '}
                  {GENDERS[student?.gender] || 'Chưa cập nhật'}
                </p>
                <p>
                  <strong>Ngày sinh:</strong> {student?.dob || 'Chưa cập nhật'}
                </p>
                <p>
                  <strong>SĐT:</strong> {student?.tel || 'Chưa cập nhật'}
                </p>
                <p>
                  <strong>Địa chỉ:</strong>{' '}
                  {student?.address || 'Chưa cập nhật'}
                </p>
              </Col>
              <Col md={5}>
                <h4>Khoá: {student?.course?.name || 'Chưa cập nhật'}</h4>
                <p>
                  <strong>Mã khoá học:</strong>{' '}
                  {student?.course?.code || 'Chưa cập nhật'}
                </p>
                <p>
                  <strong>Hạng:</strong>{' '}
                  {student?.drivingType?.label || 'Chưa cập nhật'}
                </p>
                <p>
                  <strong>Khai giảng:</strong>{' '}
                  {student?.course?.enrollmentDate
                    ? new Date(
                        student?.course?.enrollmentDate
                      ).toLocaleDateString('en-GB')
                    : 'Chưa cập nhật'}
                </p>
                <p>
                  <strong>Bế giảng:</strong>{' '}
                  {student?.course?.graduationDate
                    ? new Date(
                        student?.course?.enrollmentDate
                      ).toLocaleDateString('en-GB')
                    : 'Chưa cập nhật'}
                </p>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Quá trình học tập */}
        <Card className='shadow-sm'>
          <Card.Header>
            <h5>Quá trình học tập</h5>
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Môn học</th>
                  <th>Tiến độ</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(courseReport?.courses || {}).map(
                  (item, index) => (
                    <tr key={item.courseId}>
                      <td>{index + 1}</td>
                      <td>{item.coursename}</td>
                      <td>{item.progress}</td>
                    </tr>
                  )
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default ElearningStudentMyPage;
