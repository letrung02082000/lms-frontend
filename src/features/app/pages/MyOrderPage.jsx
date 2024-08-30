import orderApi from 'api/orderApi';
import CopyToClipboardButton from 'components/button/CopyToClipboardButton';
import ZaloLink from 'components/link/ZaloLink';
import React, { useEffect } from 'react';
import { Alert, Button, ButtonGroup, Card } from 'react-bootstrap';
import { MdPhone } from 'react-icons/md';
import styled from 'styled-components';
import { formatCurrency, formatPhoneNumber } from 'utils/commonUtils';
import OrderItem from '../components/my-store/OrderItem';
import PaymentModal from '../components/PaymentModal';

function MyOrderPage() {
  const [orders, setOrders] = React.useState([]);
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);
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

  return (
    <Styles>
      {orders.map((order) => {
        return (
          <OrderItem
            key={order?._id}
            order={order}
            onPaymentClick={handlePaymentButton}
          />
        );
      })}
      <PaymentModal show={showPaymentModal} setShow={setShowPaymentModal} onClose={() => setShowPaymentModal(false)} storeOrder={storeOrder}/>
    </Styles>
  );
}

export default MyOrderPage;

const Styles = styled.div`
  margin-bottom: 100px;
`;