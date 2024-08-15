import { PATH } from 'constants/path';
import React, { useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import { formatCurrency, formatPhoneNumber } from 'utils/commonUtils';
import PaymentModal from './PaymentModal';
import OrderItem from './OrderItem';

function OrderInfo({ order, storeOrders=[] }) {
  const [storeId, setStoreId] = React.useState('');
  const [show, setShow] = React.useState(false);
  const [amount, setAmount] = React.useState(0);
  const [desc, setDesc] = React.useState('');
  const [storeOrder, setStoreOrder] = React.useState({});

  const handlePaymentButton = (storeOrder) => {
    setStoreOrder(storeOrder);
    setShow(true);
  };

  return (
    <>
      <Table bordered hover>
        <tbody>
          <tr>
            <td>Khách hàng</td>
            <td>{order?.name}</td>
          </tr>
          <tr>
            <td>Số điện thoại</td>
            <td>{formatPhoneNumber(order?.tel)}</td>
          </tr>
          <tr>
            <td>Địa chỉ</td>
            <td>{order?.address}</td>
          </tr>
          <tr>
            <td>Ghi chú</td>
            <td>{order?.note || 'Không có'}</td>
          </tr>
        </tbody>
      </Table>
      {storeOrders.map((storeOrder) => {
        return (
          <OrderItem
            orderId={order?._id}
            key={storeOrder?._id}
            storeOrder={storeOrder}
            handlePaymentButton={() => handlePaymentButton(storeOrder)}
          />
        );
      })}
      <PaymentModal
        storeOrder={storeOrder}
        show={show}
        setShow={setShow}
        onClose={() => {
          window.location.reload();
        }}
      />
    </>
  );
}

export default OrderInfo;
