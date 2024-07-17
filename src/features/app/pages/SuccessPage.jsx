import React, { useEffect } from 'react';
import { Button, Col, Container, Image, Row } from 'react-bootstrap';
import styled from 'styled-components';
import OrderInfo from '../components/OrderInfo';
import { useNavigate } from 'react-router-dom';
import SuccessOrderImage from 'assets/images/food/success-order.svg';
import EmptyCartImage from 'assets/images/food/empty-cart.jpg';
import { PATH } from 'constants/path';
import orderApi from 'api/orderApi';

function SuccessPage() {
  const navigate = useNavigate();
  const order = JSON.parse(localStorage.getItem('order') || '{}');
  const [storeOrders, setStoreOrders] = React.useState([]);
  
  useEffect(() => {
    if(order?._id){
      orderApi
        .queryOrder({
          code: order?.code,
        })
        .then((res) => {
          setStoreOrders(res?.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [order?._id])

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
          <OrderInfo order={order} storeOrders={storeOrders}/>
          <Row>
            <Col>
              <Button
                variant='outline-primary'
                className='w-100 py-2 mb-5'
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
