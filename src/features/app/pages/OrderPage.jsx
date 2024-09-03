import orderApi from 'api/orderApi';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import OrderInfo from '../components/OrderInfo';
import { Container } from 'react-bootstrap';
import { QRCodeSVG } from 'qrcode.react';

function OrderPage() {
  const orderId = useParams().orderId;
  const [order, setOrder] = React.useState({});
  const [storeOrders, setStoreOrders] = React.useState([]);

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
  

  return (
    <Container>
      <div className='w-100 d-flex justify-content-center mb-3'>
        <QRCodeSVG value={window.location.href}/>
      </div>
      <OrderInfo order={order} storeOrders={storeOrders} />
    </Container>
  );
}

export default OrderPage;
