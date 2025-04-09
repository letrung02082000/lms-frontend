import { QUIZ_ATTEMPT_STATUS } from 'constants/driving-elearning.constant';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import debounce from 'lodash.debounce';
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
import QuestionNavigator from '../components/QuestionNavigator';
import { toastWrapper } from 'utils';

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
  const [attemptSummary, setAttemptSummary] = useState(null);
  console.log(answers)
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

  useEffect(() => {
    if (quizAttemptId) {
      moodleApi
        .getQuizAttemptSummary(quizAttemptId)
        .then((data) => {
          console.log('Attempt summary:', data);
          setAttemptSummary(data);
        })
        .catch((error) => {
          console.error('Error fetching attempt summary:', error);
        });
    }
  }, [quizAttemptId]);

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
      .catch(error => {
        toastWrapper(error.message, 'error');
        setQuizAttemptData(null);
        setQuizAttemptId(null);
        console.error('Error fetching attempt data:', error);
      });
  };

  useEffect(() => {
    if (quizAttemptId != null) {
      handleGetAttemptData(quizAttemptId, currentPage);
    }
  }, [quizAttemptId, currentPage]);

  const debouncedSaveAnswer = useMemo(() => {
    return debounce(async (slotAnswers) => {
      const data = Object.entries(slotAnswers).map(([key, value]) => ({
        name: key,
        value,
      }));
  
      try {
        await moodleApi.saveAttemptData(quizAttemptId, data);
      } catch (err) {
        console.error('Error saving answer:', err);
      }
    }, 1000);
  }, [quizAttemptId]);
  
  const handleAnswerChange = (slot, payload) => {
    setAnswers((prev) => {
      const updated = { ...prev };
  
      // Cập nhật lại câu trả lời mới vào answers
      payload.forEach(({ name, value }) => {
        updated[name] = value;
      });
  
      // Lọc ra tất cả các câu trả lời liên quan đến cùng slot
      const slotAnswers = Object.fromEntries(
        Object.entries(updated).filter(([key]) => key.includes(`:${slot}_`))
      );
  
      // Gọi API lưu trễ với các câu trả lời của cùng slot
      debouncedSaveAnswer(slotAnswers);
  
      return updated;
    });
  };

  useEffect(() => {
    return () => {
      debouncedSaveAnswer.cancel();
    };
  }, [debouncedSaveAnswer]);

  const continueQuizAttempt = (attempt) => {
    setQuizAttemptId(attempt.id);
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
                  <Col md={9}>
                    {quizAttemptData.questions.map((question) => (
                      <Card key={question.number} className='mb-3 shadow-sm'>
                        <Card.Header>
                          <Card.Title className='mb-0'>
                            Câu {question.number}
                          </Card.Title>
                        </Card.Header>
                        <Card.Body>
                          <QuestionItem
                            question={parseQuestionHTML(question.html)}
                            onAnswerChange={handleAnswerChange}
                            slot={question.slot}
                          />
                        </Card.Body>
                      </Card>
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
                  </Col>
                  <Col md={3}>
                    <QuestionNavigator
                      summaryQuestions={attemptSummary?.questions || []}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                    />
                  </Col>
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
