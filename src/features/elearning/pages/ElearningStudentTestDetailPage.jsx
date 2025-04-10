import { QUIZ_ATTEMPT_STATUS } from 'constants/driving-elearning.constant';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import debounce from 'lodash.debounce';
import moodleApi, { getUserAttempts } from 'services/moodleApi';
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
import { usePromptWithUnload } from 'hooks/usePromptWithUnload';
import Timer from '../components/Timer';
import QuestionReviewModal from '../components/QuestionReviewModal';

function ElearningStudentTestDetailPage() {
  const testId = useParams().id;
  const [courseId, setCourseId] = useState(null);
  const [userAttempts, setUserAttempts] = useState([]);
  const [quizAttempt, setQuizAttempt] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [quizAttemptData, setQuizAttemptData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [showHistory, setShowHistory] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attemptSummary, setAttemptSummary] = useState(null);
  const [showQuestionReviewModal, setShowQuestionReviewModal] = useState(false);
  const [preventFinish, setPreventFinish] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const cId = parseInt(searchParams.get('c'));
    setCourseId(cId);
  }, []);

  usePromptWithUnload(
    'Bạn có chắc muốn rời đi? Dữ liệu chưa được lưu.',
    quizAttempt?.id != null
  );

  useEffect(() => {
    if (!testId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [attemptsRes, quizzesRes] = await Promise.all([
          moodleApi.getUserAttempts(testId, 'all'),
          moodleApi.getQuizzesByCourses([courseId]),
        ]);

        if (attemptsRes?.attempts.at(-1)?.state === 'inprogress') {
          setQuizAttempt(attemptsRes.attempts.at(-1));
        }

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
    if (quizAttempt?.id) {
      getQuizAttemptSummary(quizAttempt?.id);
    }
  }, [quizAttempt?.id]);

  const getQuizAttemptSummary = async (attemptId) => {
    try {
      const data = await moodleApi.getQuizAttemptSummary(attemptId);
      setAttemptSummary(data);
    } catch (error) {
      console.error('Error fetching attempt summary:', error);
    }
  };

  const startNewAttempt = () => {
    if (!testId) return;

    moodleApi
      .startQuizAttempt(testId)
      .then((attemptData) => {
        setQuizAttempt(attemptData.attempt);
      })
      .catch(console.error);
  };

  const handleGetAttemptData = (attemptId, page) => {
    moodleApi
      .getAttemptData(attemptId, page)
      .then((data) => setQuizAttemptData(data))
      .catch((error) => {
        setQuizAttemptData(null);
        setQuizAttempt(null);
        console.error('Error fetching attempt data:', error);
        window.location.reload();
      })
      .finally(() => {
        setShowHistory(false);
      });
  };

  useEffect(() => {
    if (quizAttempt?.id != null) {
      handleGetAttemptData(quizAttempt?.id, currentPage);
    }
  }, [quizAttempt?.id, currentPage]);

  const debouncedSaveAnswer = useMemo(() => {
    return debounce(async (slotAnswers, slot) => {
      const data = Object.entries(slotAnswers).map(([key, value]) => ({
        name: key,
        value,
      }));

      try {
        await moodleApi.saveAttemptData(quizAttempt?.id, data);
        setAttemptSummary((prev) => {
          const updated = { ...prev };
          updated.questions = updated.questions.map((question) => {
            if (question.slot === slot) {
              return {
                ...question,
                stateclass: 'answersaved',
              };
            }
            return question;
          });
          return updated;
        });
      } catch (err) {
        console.error('Error saving answer:', err);
      }
    }, 1000);
  }, [quizAttempt?.id]);

  const handleAnswerChange = (slot, payload) => {
    setPreventFinish(true);
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
      debouncedSaveAnswer(slotAnswers, slot);
      return updated;
    });
    setPreventFinish(false);
  };

  useEffect(() => {
    return () => {
      debouncedSaveAnswer.cancel();
    };
  }, [debouncedSaveAnswer]);

  const continueQuizAttempt = (attempt) => {
    setQuizAttempt(attempt);
    setShowHistory(false);
  };

  const handleFinishQuiz = async (timeUp = false) => {
    if (!quizAttempt?.id || preventFinish) return;
    setPreventFinish(true);

    try {
      await moodleApi.finishQuizAttempt(quizAttempt?.id, timeUp);
      toastWrapper('Nộp bài thành công!', 'success');
      setQuizAttempt(null);
      setQuizAttemptData(null);
      setAttemptSummary(null);
      setAnswers({});
      setCurrentPage(0);
      setShowHistory(true);
      getUserAttempts(testId, 'all')
        .then((data) => {
          setUserAttempts(data.attempts);
        })
        .catch((error) => {
          console.error('Error fetching user attempts:', error);
        });
    } catch (error) {
      console.error('Error finishing quiz:', error);
    } finally {
      setShowQuestionReviewModal(false);
      setPreventFinish(false);
    }
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
                  <p>Môn học: {course?.displayname || ''}</p>
                  <p>
                    Thời gian làm bài:{' '}
                    {quiz.timelimit != 0
                      ? `${Math.floor(quiz.timelimit / 60)} phút`
                      : 'Không giới hạn'}
                  </p>
                  <p>Số câu hỏi: {quiz?.sumgrades || ''}</p>
                </div>
                <div className='mb-4'>
                  {userAttempts.length === 0 && !quizAttempt?.id && (
                    <Button
                      variant='primary'
                      onClick={startNewAttempt}
                      size='lg'
                    >
                      Bắt đầu làm bài
                    </Button>
                  )}
                  {userAttempts.at(-1)?.state === 'finished' &&
                    !quizAttempt?.id && (
                      <Button
                        variant='primary'
                        onClick={startNewAttempt}
                        size='lg'
                      >
                        Thực hiện lại
                      </Button>
                    )}
                  {userAttempts.at(-1)?.state === 'inprogress' &&
                    !quizAttempt?.id && (
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

            {quizAttempt?.id && quizAttemptData?.questions?.length > 0 && (
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
                            sequenceCheck={question.sequencecheck}
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
                        Trang trước
                      </Button>
                      <Button
                        variant='primary'
                        onClick={() => setCurrentPage(currentPage + 1)}
                      >
                        Trang tiếp
                      </Button>
                    </div>
                  </Col>
                  <Col md={3}>
                    {quiz.timelimit > 0 && (
                      <Timer
                        timestart={quizAttempt?.timestart * 1000 - 5000}
                        timelimit={quiz?.timelimit / 60}
                        onTimeUp={() => {
                          handleFinishQuiz(true);
                        }}
                      />
                    )}
                    <div className='d-flex flex-column align-items-center mt-4'>
                      <Button
                        variant='success'
                        size='lg'
                        className='mb-5'
                        onClick={() => {
                          getQuizAttemptSummary(quizAttempt?.id);
                          setShowQuestionReviewModal(true);
                        }}
                      >
                        Nộp bài
                      </Button>
                    </div>
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
      <QuestionReviewModal
        key={Date.now()}
        show={showQuestionReviewModal && !preventFinish}
        onHide={() => setShowQuestionReviewModal(false)}
        summary={attemptSummary}
        onFinish={handleFinishQuiz}
      />
    </div>
  );
}

export default ElearningStudentTestDetailPage;
