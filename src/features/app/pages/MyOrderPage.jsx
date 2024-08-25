import orderApi from 'api/orderApi';
import CopyToClipboardButton from 'components/button/CopyToClipboardButton';
import ZaloLink from 'components/link/ZaloLink';
import React, { useEffect } from 'react';
import { Alert, Button, ButtonGroup, Card } from 'react-bootstrap';
import { MdPhone } from 'react-icons/md';
import styled from 'styled-components';
import { formatCurrency, formatPhoneNumber } from 'utils/commonUtils';
import OrderItem from '../components/my-store/OrderItem';

function MyOrderPage() {
  const [orders, setOrders] = React.useState([]);

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

  return (
    <Styles>
      {orders.map((order) => (
        <OrderItem key={order?._id} order={order} />
      ))}
    </Styles>
  );
}

export default MyOrderPage;

const Styles = styled.div`
`;