import { MainLayout } from 'components/layout';
import React from 'react';
import { Button, Col, Container, Image, Row } from 'react-bootstrap';
import styled from 'styled-components';
import OrderInfo from '../components/OrderInfo';
import { useNavigate } from 'react-router-dom';
import SuccessOrderImage from 'assets/images/sucess-order.svg';

function SuccessPage() {
  const order = JSON.parse(localStorage.getItem('order') || '{}');
  const navigate = useNavigate();

  return (
    <Styles>
      <MainLayout>
        <Container>
          <Row className='my-2'>
            <Image
              src={SuccessOrderImage}
              alt='success-order mx-auto'
              height={150}
            />
          </Row>
          <Row>
            <Col>
              <h1 className='fw-bold mb-5 text-center'>Đặt hàng thành công</h1>
            </Col>
          </Row>

          <Row>
            <Col>
              <Button
                className='w-100 py-2 mt-3 mb-5'
                onClick={() => {
                  localStorage.removeItem('order');
                  navigate(PATH.ORDER.ROOT);
                }}
              >
                Tạo đơn hàng mới
              </Button>
            </Col>
          </Row>

          <OrderInfo />
        </Container>
      </MainLayout>
    </Styles>
  );
}

export default SuccessPage;

const Styles = styled.div``;
