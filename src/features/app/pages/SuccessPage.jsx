import React from 'react';
import { Button, Col, Container, Image, Row } from 'react-bootstrap';
import styled from 'styled-components';
import OrderInfo from '../components/OrderInfo';
import { useNavigate } from 'react-router-dom';
import SuccessOrderImage from 'assets/images/food/success-order.svg';
import EmptyCartImage from 'assets/images/food/empty-cart.jpg';
import { PATH } from 'constants/path';

function SuccessPage() {
  const navigate = useNavigate();
  const order = JSON.parse(localStorage.getItem('order') || '{}');

  if(!order?.products?.length) {
    return (
      <Row className='my-2'>
        <Image src={EmptyCartImage} alt='empty-cart'/>
        <h3 className='fw-bold mb-2 text-center'>Bạn chưa đặt đơn hàng nào</h3>
      </Row>
    );
  }

  return (
    <Styles>
        <Container>
          <Row className='my-2'>
            <Image
              src={SuccessOrderImage}
              alt='success-order'
              className='mx-auto'
              height={150}
            />
          </Row>
          <Row>
            <Col>
              <h1 className='fw-bold mb-5 text-center'>Đặt hàng thành công</h1>
            </Col>
          </Row>
          <OrderInfo />
          <Row>
            <Col>
              <Button
                className='w-100 py-2 mt-3 mb-5 text-white'
                onClick={() => {
                  navigate(PATH.APP.ROOT);
                }}
              >
                Tạo đơn hàng mới
              </Button>
            </Col>
          </Row>
        </Container>
    </Styles>
  );
}

export default SuccessPage;

const Styles = styled.div``;
