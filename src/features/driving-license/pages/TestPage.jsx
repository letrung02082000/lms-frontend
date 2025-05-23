import drivingApi from 'api/drivingApi';
import { DRIVING_TYPE } from 'constants/driving';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Col,
  Container,
  Image,
  Pagination,
  Row,
} from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Question from '../components/Question';

function DrivingTestPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const drivingType = searchParams.get('type');
  const [questionData, setQuestionData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  console.log(answers);
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setQuestionData([]);
    drivingApi
      .getTest(drivingType?.toLocaleLowerCase())
      .then((res) => {
        if (res.data) {
          setQuestionData(res?.data);
        }
      })
      .catch((err) => {
        console.log(err);
        setQuestionData([]);
      })
  }, [drivingType]);

  useEffect(() => {
    setAnswers(Array(questionData.length).fill(null));
  }, [questionData.length]);

  if (!drivingType)
    return (
      <Container>
        <Row>
          <Col>
            <Button
              onClick={() => setSearchParams({ type: DRIVING_TYPE.A1 })}
              className='bg-warning py-4 my-2 text-center fw-bold rounded text-white w-100 border-0'
            >
              Hạng A1
            </Button>
          </Col>
          <Col>
            <Button
              onClick={() => setSearchParams({ type: DRIVING_TYPE.A2 })}
              className='bg-info py-4 my-2 text-center fw-bold rounded text-white w-100 border-0'
            >
              Hạng A2
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              onClick={() => setSearchParams({ type: DRIVING_TYPE.B1 })}
              className='bg-danger py-4 my-2 text-center fw-bold rounded text-white w-100 border-0'
            >
              Hạng B1
            </Button>
          </Col>
          <Col>
            <Button
              onClick={() => setSearchParams({ type: DRIVING_TYPE.B2 })}
              className='bg-primary py-4 my-2 text-center fw-bold rounded text-white w-100 border-0'
            >
              Hạng B2
            </Button>
          </Col>
        </Row>
      </Container>
    );

  return (
    questionData.length > 0 && (
      <Container>
        <Question
          setAnswers={setAnswers}
          currentQuestionIndex={currentQuestionIndex}
          questionData={questionData[currentQuestionIndex]}
          number={questionData[currentQuestionIndex]?.number}
          question={questionData[currentQuestionIndex]?.question}
          answers={questionData[currentQuestionIndex]?.answers}
          explanation={questionData[currentQuestionIndex]?.explanation}
        />

        <Pagination className='mt-5'>
          <Pagination.First onClick={() => setCurrentQuestionIndex(0)} />
          <Pagination.Prev
            onClick={() =>
              currentQuestionIndex > 0 &&
              setCurrentQuestionIndex(currentQuestionIndex - 1)
            }
          >
            Lùi lại
          </Pagination.Prev>
          <Pagination.Item active>
            {currentQuestionIndex + 1}/{questionData?.length}
          </Pagination.Item>
          <Pagination.Next
            onClick={() =>
              currentQuestionIndex < questionData.length - 1 &&
              setCurrentQuestionIndex(currentQuestionIndex + 1)
            }
          >
            Kế tiếp
          </Pagination.Next>
          <Pagination.Last
            onClick={() => setCurrentQuestionIndex(questionData.length - 1)}
          />
        </Pagination>
        <h5 className='text-center mt-5 mb-3'>Danh sách câu hỏi</h5>
        <div className='d-flex flex-wrap justify-content-between'>
          {answers.map((ans, index) => (
            <Button
              variant={
                index === currentQuestionIndex ? 'primary' : (
                  ans === null ? 'outline-primary' : (ans ? 'success' : 'danger')
                )
              }
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className='m-1'
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </Container>
    )
  );
}

export default DrivingTestPage;
