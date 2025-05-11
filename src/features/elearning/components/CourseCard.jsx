import { COURSE_MODULES } from 'constants/driving-elearning.constant';
import { PATH } from 'constants/path';
import useMediaQuery from 'hooks/useMediaQuery';
import React, { useEffect, useState } from 'react';
import { FaBookReader } from 'react-icons/fa';
import { IoMdEye } from 'react-icons/io';
import { MdCheckCircle, MdCheckCircleOutline, MdForum, MdLink, MdList, MdOutlineForum, MdPlayArrow, MdQuiz } from 'react-icons/md';
import { countModulesByType } from 'utils/commonUtils';
import { appendTokenToUrl } from 'utils/elearning.utils';
const {
  Card,
  Row,
  Col,
  Button,
  Collapse,
  ListGroup,
  Badge,
  Spinner,
} = require('react-bootstrap');

const CourseCard = ({ course, courseContent }) => {
  const moodleToken = localStorage.getItem('moodleToken');
  const [open, setOpen] = useState(false);
  const [moduleCount, setModuleCount] = useState({});
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    const count = countModulesByType(courseContent);
    setModuleCount(count);
  }, [courseContent]);

  return (
    <Card className='mb-3 shadow-sm'>
      <Card.Body>
        <Row>
          {!isMobile && (
            <Col xs={2} className='text-center'>
              {course?.courseimage && (
                <img
                  src={
                    course.courseimage.includes('pluginfile.php')
                      ? appendTokenToUrl(course.courseimage, moodleToken)
                      : course.courseimage
                  }
                  alt={course?.fullname}
                  width='100%'
                />
              )}
            </Col>
          )}
          <Col>
            <Row>
              <Col>
                <h5>{course.fullnamedisplay}</h5>
                <div
                  className='text-muted'
                  dangerouslySetInnerHTML={{ __html: course.summary }}
                ></div>
              </Col>
              <Col className='text-end'>
                {Object.keys(moduleCount)?.map((mod) => (
                  <Badge
                    key={mod}
                    bg='primary'
                    className='me-1'
                    pill
                    style={{ fontSize: '0.8rem' }}
                  >
                    <span className='me-1'>{moduleCount[mod]}</span>
                    <span className='me-1'>{COURSE_MODULES[mod]}</span>
                  </Badge>
                ))}
              </Col>
            </Row>
            <Button
              disabled={!courseContent?.length}
              variant='outline-primary'
              onClick={() => setOpen(!open)}
              aria-controls={`lessons-${course.id}`}
              aria-expanded={open}
            >
              {courseContent?.length ? (
                <MdList className='me-1' />
              ) : (
                <Spinner
                  animation='border'
                  size='sm'
                  role='status'
                  aria-hidden='true'
                  className='me-1'
                />
              )}
              {open ? 'Ẩn nội dung' : 'Xem nội dung'}
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
                            <Col xs={10}>
                              <div className='d-flex align-items-center'>
                                <span>
                                  {mod?.completiondata?.isoverallcomplete &&
                                  mod?.completiondata?.hascompletion && (
                                    <MdCheckCircle
                                      style={{
                                        color: 'var(--bs-success)',
                                      }}
                                      className='me-2'
                                      size={20}
                                    />
                                  )}
                                {!mod?.completiondata?.isoverallcomplete &&
                                  mod?.completiondata?.hascompletion && (
                                    <MdCheckCircleOutline
                                      style={{
                                        color: 'var(--bs-secondary)',
                                      }}
                                      className='me-2'
                                      size={20}
                                    />
                                  )}
                                </span>
                                <span className='text-truncate'>
                                  {mod?.name}
                                </span>
                              </div>
                            </Col>
                            <Col xs={2} className='text-end'>
                              {mod.modname === 'forum' && (
                                <Button
                                  variant='outline-primary'
                                  size='sm'
                                  href={`${PATH.ELEARNING.STUDENT.FORUM.replace(
                                    ':id',
                                    mod?.instance
                                  )}?m=${mod?.id}`}
                                  target='_blank'
                                >
                                  <MdOutlineForum className='me-1' />
                                  Thảo luận
                                </Button>
                              )}
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
                                  <MdQuiz className='me-1' />
                                  Thực hiện
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
                                  )}?m=${mod?.id}&url=${
                                    mod?.contents[0]?.fileurl
                                  }`}
                                  target='_blank'
                                >
                                  <FaBookReader className='me-1' />
                                  Đọc
                                </Button>
                              )}
                              {mod?.modname === 'book' &&
                                mod?.contents?.length > 0 && (
                                  <Button
                                    className='mb-1'
                                    variant='outline-primary'
                                    size='sm'
                                    href={`${PATH.ELEARNING.STUDENT.BOOK.replace(
                                      ':id',
                                      mod?.instance
                                    )}?m=${mod?.id}&i=${
                                      mod.instance
                                    }&urls=${mod?.contents
                                      ?.filter(
                                        (c) => c?.filename === 'index.html'
                                      )
                                      ?.map((content) => content?.fileurl)
                                      ?.join(',')}`}
                                    target='_blank'
                                  >
                                    <FaBookReader className='me-1' />
                                    Học
                                  </Button>
                                )}
                            </Col>
                          </Row>
                          {/* {mod.modname === 'book' && (
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
                          )} */}
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
