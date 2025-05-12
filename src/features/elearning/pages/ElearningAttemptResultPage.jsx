import React, { useEffect, useMemo } from 'react';
import { Card, Container, Row, Col, Badge, Accordion } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import moodleApi from 'services/moodleApi';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatTime, parseQuestionHTML } from 'utils/commonUtils';
import QuestionItem from '../components/QuestionItem';
import { QUIZ_GRADE_STATUS } from 'constants/driving-elearning.constant';

const formatDateTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp * 1000);
  return date.toLocaleString('en-GB');
};

const ElearningAttemptResultPage = () => {
  const attemptId = useParams().attemptId;
  const courseId = new URLSearchParams(window.location.search).get('c');
  const [data, setData] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const { grade, attempt, questions } = data;
  const [quizzes, setQuizzes] = React.useState([]);
  const quiz = useMemo(() => {
    if (!quizzes.length) return null;
    const quizId = attempt?.quiz;
    return quizzes.find((quiz) => quiz.id === quizId);
  }, [quizzes, attempt]);
  console.log('quiz', quiz);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [attemptRes, quizzesRes] = await Promise.all([
          moodleApi.getAttemptReview(attemptId),
          moodleApi.getQuizzesByCourses([courseId]),
        ]);
        setData(attemptRes);
        setQuizzes(quizzesRes);
      } catch (error) {
        console.error('Error fetching attempt result:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [attemptId]);

  if (!data?.attempt) {
    return loading ? <LoadingSpinner /> : <div>Không có dữ liệu</div>;
  }

  return (
    <div style={{ height: '100vh', overflowY: 'scroll' }}>
      <Container className='my-4'>
        <Row className='mb-4'>
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>Kết quả bài kiểm tra</Card.Title>
                <Row className='mb-2'>
                  {quiz?.timelimit > 0 && (
                    <Col>
                      <strong>Kết quả:</strong>{' '}
                      <Badge bg={grade >= quiz?.gradepass ? 'success' : 'danger'}>
                        {grade >= quiz?.gradepass ? 'Đạt' : 'Không đạt'}
                      </Badge>
                    </Col>
                  )}
                  <Col>
                    <strong>Số câu đúng:</strong>{' '}
                    {attempt.sumgrades + '/' + questions.length}
                  </Col>
                  <Col>
                    <strong>Thời gian bắt đầu:</strong>{' '}
                    {formatDateTime(attempt.timestart)}
                  </Col>
                  <Col>
                    <strong>Thời gian kết thúc:</strong>{' '}
                    {formatDateTime(attempt.timefinish)}
                  </Col>
                  <Col>
                    <strong>Thời gian làm bài:</strong>{' '}
                    {formatTime(attempt.timefinish - attempt.timestart)}
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Accordion defaultActiveKey='0' className='mt-4'>
              {questions.map((q, index) => (
                <Accordion.Item eventKey={String(index)} key={q.slot}>
                  <Accordion.Header>
                    Câu hỏi {q.number}
                    <Badge
                      bg={
                        q?.state === 'gradedright'
                          ? 'success'
                          : q?.state === 'gradedwrong'
                          ? 'danger'
                          : q?.state === 'gaveup'
                          ? 'warning'
                          : ''
                      }
                      className='ms-2'
                    >
                      {QUIZ_GRADE_STATUS[q?.state]}
                    </Badge>
                  </Accordion.Header>
                  <Accordion.Body>
                    <QuestionItem
                      question={parseQuestionHTML(q.html)}
                      key={index}
                      disabled={true}
                    />
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ElearningAttemptResultPage;
