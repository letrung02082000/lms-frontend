import orderApi from 'api/orderApi';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import OrderInfo from '../components/OrderInfo';
import { Container } from 'react-bootstrap';

function OrderPage() {
  const orderId = useParams().orderId;
  const [order, setOrder] = React.useState({});

  useEffect(() => {
    orderApi
      .getOrder(orderId)
      .then((res) => {
        setOrder(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Container>
      <OrderInfo order={order} />
    </Container>
  );
}

export default OrderPage;
