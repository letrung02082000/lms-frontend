import elearningApi from 'api/elearningApi';
import { GENDERS } from 'constants/driving-student.constant';
import React, { useEffect } from 'react';
import {
  Card,
  Col,
  Container,
  Image,
  ProgressBar,
  Row,
  Table,
} from 'react-bootstrap';
import moodleApi from 'services/moodleApi';
import LoadingSpinner from '../components/LoadingSpinner';
import 'react-circular-progressbar/dist/styles.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { PATH } from 'constants/path';
import drivingApi from 'api/drivingApi';

function ElearningStudentMyPage() {
  const moodleToken = localStorage.getItem('moodleToken');
  const [student, setStudent] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [courses, setCourses] = React.useState([]);

  useEffect(() => {
    if (!moodleToken) {
      window.location.href = '/elearning/login';
    } else {
      setLoading(true);
      elearningApi
        .getUserByMoodleToken(moodleToken)
        .then((res) => {
          setStudent(res.data);
          localStorage.setItem('center', JSON.stringify(res.data?.center));
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
      moodleApi
        .getMyEnrolledCourses('all')
        .then((courses) => {
          setCourses(courses);
        })
        .catch((error) => {
          console.error('Error fetching courses:', error);
        });

      drivingApi.getPortraitImage(student?._id).then((data) => {
        const url = URL.createObjectURL(data);
        setStudent((prev) => ({ ...prev, portraitUrl: url }));
      }).catch(console.error);
    }
  }, [student?._id]);

  return (
    <div
      style={{
        height: '100vh',
        overflowY: 'scroll',
      }}
    >
      {!loading ? (
        <Container className='mt-4'>
          <h2 className='mb-4 h2'>Thông tin cá nhân</h2>
          <Card className='mb-4 shadow-sm'>
            <Card.Body>
              <Row>
                <Col md={3} className='text-center'>
                  <Image
                    src={
                      student?.portraitUrl ||
                      'https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg'
                    }
                    roundedCircle
                    width='150'
                    height='150'
                    style={{ objectFit: 'cover' }}
                    alt='avatar'
                    className='mb-3'
                  />
                </Col>
                <Col md={6}>
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
                    <strong>Ngày sinh:</strong>{' '}
                    {student?.dob || 'Chưa cập nhật'}
                  </p>
                  <p>
                    <strong>SĐT:</strong> {student?.tel || 'Chưa cập nhật'}
                  </p>
                  <p>
                    <strong>Địa chỉ:</strong>{' '}
                    {student?.address || 'Chưa cập nhật'}
                  </p>
                </Col>
                <Col md={3}>
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
                          student?.course?.graduationDate
                        ).toLocaleDateString('en-GB')
                      : 'Chưa cập nhật'}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Row>
            <Col
              md={3}
              className='d-flex align-items-center justify-content-center'
            >
              <div style={{ width: 250, height: 250 }} className='mb-3'>
                <CircularProgressbar
                  value={
                    courses.length > 0
                      ? courses.reduce((sum, c) => sum + (c.progress || 0), 0) /
                        courses.length
                      : 0
                  }
                  text={`${
                    courses.length > 0
                      ? Math.round(
                          courses.reduce(
                            (sum, c) => sum + (c.progress || 0),
                            0
                          ) / courses.length
                        )
                      : 0
                  }%`}
                  styles={buildStyles({
                    textSize: '18px',
                    pathColor: `var(--bs-primary)`,
                    textColor: '#000',
                    trailColor: '#d6d6d6',
                  })}
                />
              </div>
            </Col>

            <Col md={9}>
              <Card className='shadow-sm'>
                <Card.Header>
                  <h5>Quá trình học tập</h5>
                </Card.Header>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Môn học</th>
                      <th>Tiến độ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((item, index) => (
                      <tr key={item.courseId}>
                        <td>{index + 1}</td>
                        <td>{item.fullname}</td>
                        <td>
                          {item?.progress ? (
                            <ProgressBar
                              variant='primary'
                              now={item.progress}
                              label={`${Math.round(item.progress)}%`}
                              style={{ height: '20px' }}
                            />
                          ) : (
                            <span>Chưa có dữ liệu</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card>
            </Col>
          </Row>
        </Container>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
}

export default ElearningStudentMyPage;
