import React, { useEffect } from 'react';
import { Card, Container, Row, Col, Badge, Accordion } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import moodleApi from 'services/moodleApi';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatTime } from 'utils/commonUtils';

const formatDateTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
};

const ElearningAttemptResultPage = () => {
  const attemptId = useParams().attemptId;
  const [data, setData] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const { grade, attempt, questions } = data;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await moodleApi.getAttemptReview(attemptId);
        console.log('Attempt data:', response);
        setData(response);
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
                  <Col>
                    <strong>Điểm:</strong> <Badge bg='success'>{grade}</Badge>
                  </Col>
                  <Col>
                    <strong>Đúng:</strong>{' '}
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
                  <Accordion.Header>Câu hỏi {q.number}</Accordion.Header>
                  <Accordion.Body>
                    <div dangerouslySetInnerHTML={{ __html: q.html }} />
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
