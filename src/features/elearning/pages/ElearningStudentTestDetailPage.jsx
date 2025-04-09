import { QUIZ_ATTEMPT_STATUS } from 'constants/driving-elearning.constant';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import moodleApi from 'services/moodleApi';
import { Button, Card, Row, Col, Container } from 'react-bootstrap';

function ElearningStudentTestDetailPage() {
  const testId = useParams().id;
  const [userAttempts, setUserAttempts] = useState([]);
  const [quizAttemptId, setQuizAttemptId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [quizAttemptData, setQuizAttemptData] = useState([]);

  useEffect(() => {
    moodleApi
      .getUserAttempts(testId, 'all')
      .then((data) => {
        if (data?.attempts?.at(-1)?.state === 'finished' || data?.attempts?.length === 0) {
          moodleApi
            .startQuizAttempt(testId)
            .then((attemptData) => {
              setQuizAttemptId(attemptData.attempt.id);
            })
            .catch(console.error);
        } else if (data?.attempts?.length > 0) {
          setUserAttempts(data.attempts);
        }
      })
      .catch(console.error);
  }, []);

  const handleGetAttemptData = (attemptId, page) => {
    moodleApi
      .getAttemptData(attemptId, page)
      .then((data) => setQuizAttemptData(data))
      .catch(console.error);
  };

  useEffect(() => {
    if (quizAttemptId) {
      handleGetAttemptData(quizAttemptId, currentPage);
    }
  }, [quizAttemptId, currentPage]);

  return (
    <div
      style={{
        height: '100vh',
        overflowY: 'scroll',
        padding: '20px',
      }}
    >
      <Container fluid className='py-4'>
        {userAttempts.length > 0 && (
          <div>
            <h2 className='mb-4'>Lịch sử làm bài</h2>
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
                          {new Date(attempt.timestart * 1000).toLocaleString()}
                        </div>
                        {attempt.state === 'finished' && (
                          <div>
                            Kết thúc:{' '}
                            {new Date(
                              attempt.timefinish * 1000
                            ).toLocaleString()}
                          </div>
                        )}
                        <div>Điểm: {attempt.sumgrades}</div>
                      </Card.Text>
                      {attempt.state === 'inprogress' && (
                        <Button
                          variant='primary'
                          onClick={() => setQuizAttemptId(attempt.id)}
                        >
                          Tiếp tục làm bài
                        </Button>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {quizAttemptId && (
          <div className='mt-5'>
            <h2 className='mb-4'>Bài làm hiện tại</h2>
            <Row className='g-4'>
              {quizAttemptData?.questions?.map((question) => (
                <Col xs={12} key={question.number}>
                  <Card className='shadow-sm'>
                    <Card.Body>
                      <div
                        dangerouslySetInnerHTML={{ __html: question.html }}
                      ></div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Container>
    </div>
  );
}

export default ElearningStudentTestDetailPage;
