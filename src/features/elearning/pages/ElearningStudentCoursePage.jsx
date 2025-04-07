import elearningApi from 'api/elearningApi';
import React, { useEffect, useMemo } from 'react';
import { Button, Card, Col, Container, Navbar, Row } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import moodleApi from 'services/moodleApi';
import CourseCard from '../components/CourseCard';

function ElearningStudentCoursePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [courseContents, setCourseContents] = React.useState([]);

  useEffect(() => {
    moodleApi
      .getMyEnrolledCourses()
      .then((data) => {
        setCourses(data);
      })
      .catch((err) => {
        console.log(err);
      });

    moodleApi
      .getCoursesContents()
      .then((data) => {
        setCourseContents(data);
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
      });
  }, []);

  const handleSelectCourse = (course) => {
    setSearchParams({ courseId: course.id });
  };

  return (
    <div style={{ height: '100vh', overflowY: 'scroll' }}>
      <Container className='my-4'>
        {courses.length > 0 ? (
          <Row className='g-4'>
            {courses?.map((course) => (
              <Col key={course.id} xs={12}>
                <CourseCard
                  course={course}
                  courseContent={courseContents[course.id]}
                  onClick={handleSelectCourse} // Truyền hàm xử lý click
                />
              </Col>  
            ))}
          </Row>
        ) : (
          <p>Bạn chưa tham gia khóa học nào đang diễn ra.</p>
        )}
      </Container>
    </div>
  );
}

export default ElearningStudentCoursePage;
