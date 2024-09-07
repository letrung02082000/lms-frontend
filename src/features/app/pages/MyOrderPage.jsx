import orderApi from 'api/orderApi';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import OrderItem from '../components/my-store/OrderItem';
import PaymentModal from '../components/PaymentModal';
import { Button, Modal } from 'react-bootstrap';
import OrderInfo from '../components/OrderInfo';

function MyOrderPage() {
  const [orders, setOrders] = React.useState([]);
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);
  const [showDetailModal, setShowDetailModal] = React.useState(false);
  const [storeOrder, setStoreOrder] = React.useState({});
  useEffect(() => {
    orderApi
      .getMyOrders()
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handlePaymentButton = (order) => {
    setStoreOrder(order);
    setShowPaymentModal(true);
  }

  const onDetailClick = (order) => {
    setStoreOrder(order);
    setShowDetailModal(true);
  }

  return (
    <Styles>
      {orders.map((order) => {
        return (
          <OrderItem
            key={order?._id}
            order={order}
            onPaymentClick={handlePaymentButton}
            onDetailClick={onDetailClick}
          />
        );
      })}
      <PaymentModal
        show={showPaymentModal}
        setShow={setShowPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        storeOrder={storeOrder}
      />
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>#{storeOrder?.code}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <OrderInfo order={storeOrder} storeOrders={[storeOrder]} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowDetailModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </Styles>
  );
}

export default MyOrderPage;

const Styles = styled.div`
  margin-bottom: 100px;
`;
