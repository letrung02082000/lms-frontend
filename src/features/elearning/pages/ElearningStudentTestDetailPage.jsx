import { QUIZ_ATTEMPT_STATUS } from 'constants/driving-elearning.constant';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import moodleApi from 'services/moodleApi';
import {
  Button,
  Card,
  Row,
  Col,
  Container,
  Accordion,
  Spinner,
} from 'react-bootstrap';
import QuestionItem from '../components/QuestionItem';
import { parseQuestionHTML } from 'utils/commonUtils';

function ElearningStudentTestDetailPage() {
  const testId = useParams().id;
  const [courseId, setCourseId] = useState(null);
  const [userAttempts, setUserAttempts] = useState([]);
  const [quizAttemptId, setQuizAttemptId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [quizAttemptData, setQuizAttemptData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [showHistory, setShowHistory] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tách xử lý URLSearchParams
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const cId = parseInt(searchParams.get('c'));
    setCourseId(cId);
  }, []);

  useEffect(() => {
    if (!testId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [attemptsRes, quizzesRes] = await Promise.all([
          moodleApi.getUserAttempts(testId, 'all'),
          moodleApi.getQuizzesByCourses([courseId]),
        ]);

        setUserAttempts(attemptsRes.attempts);
        const foundQuiz = quizzesRes?.quizzes?.find((q) => q.id == testId);
        if (foundQuiz) {
          setQuiz(foundQuiz);
          setQuizzes(quizzesRes.quizzes);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchData();
  }, [testId, courseId]);

  useEffect(() => {
    if (courseId) {
      moodleApi
        .getCourseById(courseId)
        .then((data) => {
          setCourse(data);
        })
        .catch((error) => {
          console.error('Error fetching course:', error);
        });
    }
  }, [courseId]);

  const startNewAttempt = () => {
    moodleApi
      .startQuizAttempt(testId)
      .then((attemptData) => {
        setQuizAttemptId(attemptData.attempt.id);
      })
      .catch(console.error);
  };

  const handleGetAttemptData = (attemptId, page) => {
    moodleApi
      .getAttemptData(attemptId, page)
      .then((data) => setQuizAttemptData(data))
      .catch(console.error);
  };

  useEffect(() => {
    if (quizAttemptId != null) {
      handleGetAttemptData(quizAttemptId, currentPage);
    }
  }, [quizAttemptId, currentPage]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const continueQuizAttempt = (attempt) => {
    setQuizAttemptId(attempt.id);
    setCurrentPage(0);
    setShowHistory(false);
  };

  return (
    <div
      style={{
        height: '100vh',
        overflowY: 'scroll',
        padding: '20px',
      }}
    >
      <Container fluid className='py-4'>
        {loading ? (
          <div className='text-center py-5'>
            <Spinner animation='border' variant='primary' />
            <div className='mt-2'>Đang tải dữ liệu...</div>
          </div>
        ) : (
          <>
            {quiz && (
              <>
                <div className='mb-4'>
                  <h2>{quiz.name}</h2>
                  <p>{quiz.intro}</p>
                  <p>
                    Thời gian làm bài: {Math.floor(quiz.timelimit / 60)} phút
                  </p>
                  <p>Môn học: {course?.displayname || ''}</p>
                </div>
                <div className='mb-4'>
                  {userAttempts.length === 0 && !quizAttemptId && (
                    <Button
                      variant='primary'
                      onClick={startNewAttempt}
                      size='lg'
                    >
                      Bắt đầu làm bài
                    </Button>
                  )}
                  {userAttempts.at(-1)?.state === 'finished' &&
                    !quizAttemptId && (
                      <Button
                        variant='primary'
                        onClick={startNewAttempt}
                        size='lg'
                      >
                        Làm lại bài thi
                      </Button>
                    )}
                  {userAttempts.at(-1)?.state === 'inprogress' &&
                    !quizAttemptId && (
                      <Button
                        variant='primary'
                        onClick={() => continueQuizAttempt(userAttempts.at(-1))}
                        size='lg'
                      >
                        Tiếp tục bài làm
                      </Button>
                    )}
                </div>
              </>
            )}

            {userAttempts.length > 0 && (
              <Accordion activeKey={showHistory ? '0' : null}>
                <Accordion.Item eventKey='0'>
                  <Accordion.Header
                    onClick={() => setShowHistory((prev) => !prev)}
                  >
                    Lịch sử làm bài
                  </Accordion.Header>
                  <Accordion.Body>
                    <Row xs={1} md={2} className='g-4'>
                      {userAttempts.map((attempt) => (
                        <Col key={attempt.attempt}>
                          <Card className='shadow-sm'>
                            <Card.Body>
                              <Card.Title>
                                Lần {attempt.attempt} -{' '}
                                {QUIZ_ATTEMPT_STATUS[attempt.state]}
                              </Card.Title>
                              <Card.Text>
                                <div>
                                  Bắt đầu:{' '}
                                  {new Date(
                                    attempt.timestart * 1000
                                  ).toLocaleString('en-GB')}
                                </div>
                                {attempt.state === 'finished' && (
                                  <>
                                    <div>
                                      Kết thúc:{' '}
                                      {new Date(
                                        attempt.timefinish * 1000
                                      ).toLocaleString('en-GB')}
                                    </div>
                                    <div>Điểm: {attempt.sumgrades}</div>
                                  </>
                                )}
                              </Card.Text>
                              {attempt.state === 'inprogress' && (
                                <Button
                                  variant='primary'
                                  onClick={() => continueQuizAttempt(attempt)}
                                >
                                  Tiếp tục bài làm
                                </Button>
                              )}
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            )}

            {quizAttemptId && quizAttemptData?.questions?.length > 0 && (
              <div className='mt-5'>
                <h2 className='mb-4'>Danh sách câu hỏi</h2>
                <Row className='g-4'>
                  {quizAttemptData.questions.map((question) => (
                    <Col xs={12} key={question.number}>
                      <Card className='shadow-sm'>
                        <Card.Header>
                          <Card.Title className='mb-0'>Câu {question.number}</Card.Title>
                        </Card.Header>
                        <Card.Body>
                          <QuestionItem
                            question={parseQuestionHTML(question.html)}
                            onAnswerChange={handleAnswerChange}
                          />
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                  <div className='d-flex justify-content-between mt-4'>
                    <Button
                      variant='secondary'
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 0}
                    >
                      Câu trước
                    </Button>
                    <Button
                      variant='primary'
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Câu tiếp
                    </Button>
                  </div>
                </Row>
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
}

export default ElearningStudentTestDetailPage;
