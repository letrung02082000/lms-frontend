import { PATH } from 'constants/path';
import React, { useState } from 'react';
import { FaBookReader } from 'react-icons/fa';
import { IoMdEye } from 'react-icons/io';
import { MdLink, MdPlayArrow } from 'react-icons/md';
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
  const moodleToken = localStorage.getItem('moodleToken');
  const [open, setOpen] = useState(false);

  return (
    <Card className='mb-3 shadow-sm'>
      <Card.Body>
        <Row>
          <Col>
            <h5>{course.fullnamedisplay}</h5>
            <p>{course.summary}</p>
            <Button
              variant='outline-primary'
              onClick={() => setOpen(!open)}
              aria-controls={`lessons-${course.id}`}
              aria-expanded={open}
            >
              {open ? 'Ẩn các phần' : 'Hiện các phần'}
            </Button>

            <Collapse in={open}>
              <div id={`lessons-${course.id}`}>
                <ListGroup className='mt-3'>
                  {courseContent?.map((lesson) => (
                    <ListGroup.Item key={lesson?.id}>
                      <h6>{lesson?.name}</h6>
                      {lesson.modules?.map((mod) => (
                        <>
                          <Row
                            className='align-items-center mb-2 g-2'
                            key={mod?.id}
                          >
                            <Col xs={10}>{mod.name}</Col>
                            <Col xs={2} className='text-end'>
                            {mod.modname === 'url' && (
                              <Button
                                variant='outline-primary'
                                size='sm'
                                href={`${mod?.contents[0]?.fileurl}`}
                                target='_blank'
                                >
                                  <MdLink className='me-1' />
                                  Truy cập
                                </Button>
                            )}
                              {mod.modname === 'supervideo' && (
                                <Button
                                  variant='outline-primary'
                                  size='sm'
                                  href={`${PATH.ELEARNING.STUDENT.VIDEO.replace(
                                    ':id',
                                    mod?.instance
                                  )}?m=${mod?.id}`}
                                  target='_blank'
                                >
                                  <MdPlayArrow className='me-1' />
                                  Phát
                                </Button>
                              )}
                              {mod.modname === 'quiz' && (
                                <Button
                                  variant='outline-primary'
                                  size='sm'
                                  href={`${PATH.ELEARNING.STUDENT.TEST_DETAIL.replace(
                                    ':id',
                                    mod?.instance
                                  )}?m=${mod?.id}&c=${course.id}`}
                                  target='_blank'
                                >
                                  <IoMdEye className='me-1' />
                                  Xem
                                </Button>
                              )}
                              {mod.modname === 'resource' && (
                                <Button
                                  variant='outline-primary'
                                  size='sm'
                                  href={`${
                                    mod?.contents[0]?.fileurl?.split('?')[0]
                                  }?token=${moodleToken}`}
                                  target='_blank'
                                >
                                  <IoMdEye className='me-1' />
                                  Xem
                                </Button>
                              )}
                              {mod.modname === 'page' && (
                                <Button
                                  key={mod?.contents[0]?.fileurl}
                                  className='mb-1'
                                  variant='outline-primary'
                                  size='sm'
                                  href={`${PATH.ELEARNING.STUDENT.BOOK.replace(
                                    ':id',
                                    mod?.instance
                                  )}?m=${mod?.id}&url=${mod?.contents[0]?.fileurl}`}
                                  target='_blank'
                                >
                                  <FaBookReader className='me-1' />
                                  Đọc
                                </Button>
                              )}
                            </Col>
                          </Row>
                          {mod.modname === 'book' && (
                            <>
                              {mod.contents?.map((content) => {
                                return (
                                  content.type === 'file' && (
                                    <Row>
                                      <Col xs={10}>{content.content}</Col>
                                      <Col xs={2} className='text-end'>
                                        <Button
                                          key={content?.fileurl}
                                          className='mb-1'
                                          variant='outline-primary'
                                          size='sm'
                                          href={`${PATH.ELEARNING.STUDENT.BOOK.replace(
                                            ':id',
                                            mod?.instance
                                          )}?m=${mod?.id}&url=${
                                            content?.fileurl
                                          }`}
                                          target='_blank'
                                        >
                                          <FaBookReader className='me-1' />
                                          Đọc
                                        </Button>
                                      </Col>
                                    </Row>
                                  )
                                );
                              })}
                            </>
                          )}
                        </>
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
