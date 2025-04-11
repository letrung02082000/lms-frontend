import elearningApi from 'api/elearningApi';
import React, { useEffect, useMemo } from 'react';
import { Button, Card, Col, Container, Navbar, Row } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import moodleApi from 'services/moodleApi';
import CourseCard from '../components/CourseCard';
import { toastWrapper } from 'utils';
import LoadingSpinner from '../components/LoadingSpinner';

function ElearningStudentCoursePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [courseContents, setCourseContents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const courses = await moodleApi.getMyEnrolledCourses('all');
        setCourses(courses);

        if (courses.length > 0) {
          moodleApi
            .getCoursesContents(courses.map((course) => course.id))
            .then((courseContents) => {
              setCourseContents(courseContents);
            })
            .catch((error) =>
              console.log('Failed to fetch course content: ', error)
            );
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        toastWrapper(
          'Có lỗi xảy ra trong quá trình tải dữ liệu. Vui lòng thử lại sau.',
          'error'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSelectCourse = (course) => {
    setSearchParams({ courseId: course.id });
  };

  return (
    <div style={{ height: '100vh', overflowY: 'scroll' }}>
      <Container className='my-4'>
        <h2 className='mb-3 mt-4'>Danh sách môn học</h2>
        {courses.length > 0 ? (
          <Row className='g-4'>
            {courses?.map((course) => (
              <Col key={course.id} xs={12}>
                <CourseCard
                  course={course}
                  courseContent={courseContents[course.id]}
                  onClick={handleSelectCourse}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className='text-center mt-5'>
                <h4>Không có môn học nào</h4>
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
}

export default ElearningStudentCoursePage;
