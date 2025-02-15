import elearningApi from 'api/elearningApi';
import React, { useEffect, useMemo } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

function ElearningStudentCoursePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = React.useState([]);
  const [categories, setCategories] = React.useState([]);

  useEffect(() => {
    document.title = 'Học viên | E-learning';
    const courseId = searchParams.get('courseId');    
  }, []);

  useEffect(() => {
    const categoryIds = courses.map((course) => course.category);

    if (categoryIds.length > 0) {
      elearningApi
        .getCategoryByIds(categoryIds)
        .then((response) => {
          const categories = response.data;
          setCategories(categories);
        })
        .catch((error) => {
          console.log('Failed to fetch categories: ', error);
        });
    }
  }, [courses]);

  const CATEGORY_LABEL = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.id] = category.name;
      return acc;
    }, {});
  }, [categories]);

  console.log(CATEGORY_LABEL)

  return (
    <div className='d-flex flex-wrap w-100 justify-content-center'>
      {courses.map((course) => (
        <div key={course.id} className='m-2'>
          <Card style={{ width: '18rem' }}>
            <Card.Img variant='top' src={course.courseimage} />
            <Card.Body>
              <Card.Title>{course.displayname}</Card.Title>
              <Card.Subtitle className='mb-2 text-muted'>{CATEGORY_LABEL[course.category]}</Card.Subtitle>
              <Card.Text>
                {course.summary}
              </Card.Text>
              <Button variant='primary'>Vào học</Button>
            </Card.Body>
          </Card>
        </div>
      ))}
    </div>
  );
}

export default ElearningStudentCoursePage;
