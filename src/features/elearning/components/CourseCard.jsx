import { PATH } from 'constants/path';
import React, { useState } from 'react';
const {
  Card,
  Row,
  Col,
  Button,
  Collapse,
  ListGroup,
} = require('react-bootstrap');

const CourseCard = ({ course, courseContent }) => {
  console.log(course);
  console.log(courseContent);
  const [open, setOpen] = useState(false);

  return (
    <Card className='mb-3 shadow-sm'>
      <Card.Body>
        <Row>
          {/* <Col md={3}>
            <img
              src={course.courseimage}
              height={100}
              alt='Thumbnail'
              className='img-fluid rounded'
            />
          </Col> */}
          <Col>
            <h5>{course.fullnamedisplay}</h5>
            <p>{course.summary}</p>
            <Button
              variant='outline-primary'
              onClick={() => setOpen(!open)}
              aria-controls={`lessons-${course.id}`}
              aria-expanded={open}
              size='sm'
            >
              {open ? 'Ẩn bài học' : 'Hiện bài học'}
            </Button>

            <Collapse in={open}>
              <div id={`lessons-${course.id}`}>
                <ListGroup className='mt-3'>
                  {courseContent?.map((lesson, index) => (
                    <ListGroup.Item key={lesson?.id}>
                      <h6>{lesson?.name}</h6>
                      {lesson.modules?.map((mod) => (
                        <Row className='align-items-center mb-2 g-2' key={mod?.id}>
                          <Col xs={10}>{mod.name}</Col>
                          <Col xs={2} className='text-end'>
                            {mod.modname === 'supervideo' && (
                              <Button
                              variant='outline-primary'
                              size='sm'
                              href={PATH.ELEARNING.STUDENT.VIDEO.replace(':id', mod?.instance)}
                              target='_blank'
                            >
                              Xem video
                            </Button>
                            )}
                          </Col>
                        </Row>
                      ))}
                      {lesson?.summary && <p>{lesson.summary}</p>}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            </Collapse>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default CourseCard;
