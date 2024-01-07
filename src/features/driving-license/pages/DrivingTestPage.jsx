import { PATH } from 'constants/path';
import React from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function DrivingTestPage() {
  const navigate = useNavigate();

  return (
    <Container>
      <Row>
        <Col>
          <Button
            onClick={() => navigate(PATH.DRIVING.A1_TEST)}
            className='bg-warning py-4 my-2 text-center fw-bold rounded text-white w-100 border-0'
          >
            Hạng A1
          </Button>
        </Col>
        <Col>
          <Button
            onClick={() => navigate(PATH.DRIVING.A2_TEST)}
            className='bg-info py-4 my-2 text-center fw-bold rounded text-white w-100 border-0'
          >
            Hạng A2
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            onClick={() => navigate(PATH.DRIVING.B1_TEST)}
            className='bg-danger py-4 my-2 text-center fw-bold rounded text-white w-100 border-0'
          >
            Hạng B1
          </Button>
        </Col>
        <Col>
          <Button
            onClick={() => navigate(PATH.DRIVING.B2_TEST)}
            className='bg-primary py-4 my-2 text-center fw-bold rounded text-white w-100 border-0'
          >
            Hạng B2
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default DrivingTestPage;
