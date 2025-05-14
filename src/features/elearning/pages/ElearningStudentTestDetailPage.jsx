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
  Badge,
} from 'react-bootstrap';
import QuestionItem from '../components/QuestionItem';
import { parseQuestionHTML } from 'utils/commonUtils';
import QuestionNavigator from '../components/QuestionNavigator';
import { toastWrapper } from 'utils';
import { usePromptWithUnload } from 'hooks/usePromptWithUnload';
import Timer from '../components/Timer';
import QuestionReviewModal from '../components/QuestionReviewModal';
import { PATH } from 'constants/path';
import { useDispatch, useSelector } from 'react-redux';
import { selectElearningData, updateElearningData } from 'store/elearning.slice';
import TimeExceedWarning from '../components/TimeExceedWarning';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  MdChecklist,
  MdOutlineQuiz,
  MdOutlineTimelapse,
  MdSubject,
} from 'react-icons/md';

function ElearningStudentTestDetailPage() {
  const testId = useParams().id;
  const [courseId, setCourseId] = useState(null);
  const [userAttempts, setUserAttempts] = useState([]);
  const [quizAttempt, setQuizAttempt] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [quizAttemptData, setQuizAttemptData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [slotAnswers, setSlotAnswers] = useState(null);
  const [slot, setSlot] = useState(null);
  const [showHistory, setShowHistory] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAttemptSummary, setLoadingAttemptSummary] = useState(true);
  const [attemptSummary, setAttemptSummary] = useState(null);
  const [showQuestionReviewModal, setShowQuestionReviewModal] = useState(false);
  const [preventFinish, setPreventFinish] = useState(false);
  const [startingAttempt, setStartingAttempt] = useState(false);
  const elearningData = useSelector(selectElearningData);
  const { isLimitExceeded, timeLimitPerDay, totalTodayTime } = elearningData;

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
        const foundQuiz = quizzesRes?.find((q) => q.id == testId);
        if (foundQuiz) {
          setQuiz(foundQuiz);
          setQuizzes(quizzesRes);
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
      setLoadingAttemptSummary(true);
      const data = await moodleApi.getQuizAttemptSummary(attemptId);
      setAttemptSummary(data);
    } catch (error) {
      console.error('Error fetching attempt summary:', error);
    } finally {
      setLoadingAttemptSummary(false);
    }
  };

  const startNewAttempt = () => {
    if (!testId) return;

    setStartingAttempt(true);
    moodleApi
      .startQuizAttempt(testId)
      .then((attemptData) => {
        setQuizAttempt(attemptData.attempt);
      })
      .catch(console.error)
      .finally(() => {
        setStartingAttempt(false);
      });
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
        setPreventFinish(true);
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
        toastWrapper('Có lỗi xảy ra khi lưu câu trả lời!', 'error');
      } finally {
        setPreventFinish(false);
      }
    }, 0);
  }, [quizAttempt?.id]);

  const handleAnswerChange = (slot, payload) => {
    setSlot(slot);
    setAnswers((prev) => {
      const updated = { ...prev };
      payload.forEach(({ name, value }) => {
        updated[name] = value;
      });
      const slotAnswers = Object.fromEntries(
        Object.entries(updated).filter(([key]) => key.includes(`:${slot}_`))
      );
      setSlotAnswers(slotAnswers);
      return updated;
    });
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
      toastWrapper('Có lỗi xảy ra khi nộp bài!', 'error');
    } finally {
      setShowQuestionReviewModal(false);
      setPreventFinish(false);
    }
  };

  if (isLimitExceeded) {
    return (
      <TimeExceedWarning
        timeLimitPerDay={timeLimitPerDay}
        totalTodayTime={totalTodayTime}
      />
    );
  }

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
          <LoadingSpinner />
        ) : (
          <>
            {quiz && (
              <>
                <div className='mb-4'>
                  <h2>{quiz.name}</h2>
                  {/* <div
                    dangerouslySetInnerHTML={{
                      __html: quiz.intro,
                    }}
                  ></div> */}
                  <p>
                    <MdSubject className='me-2' />
                    Môn học: {course?.displayname || ''}
                  </p>
                  <p>
                    <MdOutlineTimelapse className='me-2' />
                    Thời gian làm bài:{' '}
                    {quiz.timelimit != 0
                      ? `${Math.floor(quiz.timelimit / 60)} phút`
                      : 'Không giới hạn'}
                  </p>
                  <p>
                    <MdOutlineQuiz className='me-2' />
                    Số câu hỏi: {quiz?.questioncount || ''}
                  </p>
                  <p>
                    <MdChecklist className='me-2' />
                    Điểm cần đạt: {quiz.gradepass}/{quiz.sumgrades}
                  </p>
                </div>
                <div className='mb-4'>
                  {userAttempts.length === 0 && !quizAttempt?.id && (
                    <Button
                      variant='primary'
                      onClick={startNewAttempt}
                      disabled={startingAttempt}
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
                                    {/* <div>
                                      Điểm: {attempt.sumgrades}/
                                      {quiz?.sumgrades}
                                    </div> */}
                                    {quiz?.timelimit > 0 && (
                                      <div>
                                        <strong>Kết quả:</strong>{' '}
                                        {attempt?.sumgrades >=
                                        quiz?.gradepass ? (
                                          <Badge bg='success'>Đạt</Badge>
                                        ) : (
                                          <Badge bg='danger'>Không đạt</Badge>
                                        )}
                                      </div>
                                    )}
                                  </>
                                )}
                              </Card.Text>
                              {attempt.state === 'inprogress' ? (
                                <Button
                                  variant='primary'
                                  onClick={() => continueQuizAttempt(attempt)}
                                >
                                  Tiếp tục bài làm
                                </Button>
                              ) : (
                                <Button
                                  variant='outline-primary'
                                  target='_blank'
                                  href={`${PATH.ELEARNING.STUDENT.ATTEMPT_RESULT.replace(
                                    ':attemptId',
                                    attempt.id
                                  )}?c=${courseId}`}
                                >
                                  Xem lại bài làm
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
                    <div className='d-flex justify-content-end mt-4'>
                      <Button
                        variant='primary'
                        disabled={preventFinish || !slotAnswers}
                        onClick={() => {
                          debouncedSaveAnswer(slotAnswers, slot);
                          setSlotAnswers(null);

                          if (
                            currentPage <
                            attemptSummary.questions.length - 1
                          ) {
                            setCurrentPage((prev) => prev + 1);
                          }
                        }}
                      >
                        {preventFinish
                          ? 'Đang lưu câu trả lời'
                          : 'Lưu câu trả lời và tiếp tục'}
                      </Button>
                    </div>
                  </Col>
                  <Col md={3}>
                    {quiz.timelimit > 0 && (
                      <div className='mb-4'>
                        <Timer
                          timestart={quizAttempt?.timestart * 1000 - 5000}
                          timelimit={quiz?.timelimit / 60}
                          onTimeUp={() => {
                            handleFinishQuiz(true);
                          }}
                        />
                      </div>
                    )}
                    <div className='d-flex flex-column align-items-center'>
                      <Button
                        size='lg'
                        className='mb-5'
                        onClick={() => {
                          getQuizAttemptSummary(quizAttempt?.id);
                          setShowQuestionReviewModal(true);
                        }}
                        disabled={preventFinish || loadingAttemptSummary}
                      >
                        {showQuestionReviewModal ? (
                          <>
                            <Spinner animation='border' size='sm' />
                            <span className='ms-2'>Chuẩn bị nộp bài</span>
                          </>
                        ) : (
                          'Nộp bài'
                        )}
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
        show={
          showQuestionReviewModal && !preventFinish && !loadingAttemptSummary
        }
        onHide={() => setShowQuestionReviewModal(false)}
        summary={attemptSummary}
        onFinish={handleFinishQuiz}
      />
    </div>
  );
}

export default ElearningStudentTestDetailPage;
