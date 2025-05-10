import React, { useEffect, useMemo } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import moodleApi from 'services/moodleApi';
import CourseCard from '../components/CourseCard';
import { toastWrapper } from 'utils';
import LoadingSpinner from '../components/LoadingSpinner';
import { useSelector } from 'react-redux';
import { selectElearningData } from 'store/elearning.slice';
import TimeExceedWarning from '../components/TimeExceedWarning';

function ElearningStudentCoursePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courseContents, setCourseContents] = React.useState([]);
  const elearningData = useSelector(selectElearningData);
  const { elearningCourses, isLimitExceeded, timeLimitPerDay, totalTodayTime, elearningUser } =
    elearningData;
  const courses = useMemo(() => {
    if (!elearningCourses) return [];

    return Object?.values(elearningCourses)?.filter((course) => course?.visible);
  }, [elearningCourses]);
    
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (courses.length > 0) {
          const courseIds = courses.map((course) => course.id);
          const promises = courseIds.map((id) =>
            moodleApi.getCourseContents(id)
          );
          const results = await Promise.all(promises);
          const courseContents = results.reduce((acc, content, index) => {
            acc[courseIds[index]] = content;
            return acc;
          }, {});
          setCourseContents(courseContents);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        toastWrapper(
          'Có lỗi xảy ra trong quá trình tải dữ liệu. Vui lòng thử lại sau.',
          'error'
        );
      }
    };
    fetchData();
  }, [courses?.length]);

  const handleSelectCourse = (course) => {
    setSearchParams({ courseId: course.id });
  };

  if (isLimitExceeded) {
    return (
      <TimeExceedWarning
        timeLimitPerDay={timeLimitPerDay}
        totalTodayTime={totalTodayTime}
      />
    );
  }

  if(!elearningUser) {
    return (
      <div style={{ height: '100vh', overflowY: 'scroll', padding: '20px' }}>
        <Container>
          <h2 className='mb-4 h2'>Danh sách môn học</h2>
          <div className='text-center mt-5'>
            <LoadingSpinner />
          </div>
        </Container>
      </div>
    );
  }

  if (elearningUser && !elearningUser?.elearningLessons) {
    return (
      <div style={{ height: '100vh', overflowY: 'scroll', padding: '20px' }}>
        <Container>
          <h2 className='mb-4 h2'>Danh sách môn học</h2>
          <div className='text-center mt-5'>
            <h4>Không có môn học nào</h4>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', overflowY: 'scroll', padding: '20px' }}>
      <Container>
        <h2 className='mb-4 h2'>Danh sách môn học</h2>
        {courses.length === 0 && elearningUser?.elearningLessons?.length > 0 ? (
          <div className='text-center mt-5'>
            <LoadingSpinner />
          </div>
        ) : null}
        {courses.length > 0 && (
          <Row className='g-4'>
            {courses?.map((course) =>
              elearningUser?.elearningLessons?.includes(course.id) ? (
                <Col key={course.id} xs={12}>
                  <CourseCard
                    key={course.id}
                    course={course}
                    courseContent={courseContents[course.id]}
                    onClick={handleSelectCourse}
                  />
                </Col>
              ) : null
            )}
          </Row>
        )}
      </Container>
    </div>
  );
}

export default ElearningStudentCoursePage;
