import { PATH } from 'constants/path';
import React, { useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import { formatCurrency, formatPhoneNumber } from 'utils/commonUtils';
import PaymentModal from './PaymentModal';

function OrderInfo({ order, storeOrders }) {
  const productByStoreId = order?.productByStoreId || [];
  const [storeId, setStoreId] = React.useState('');
  const [show, setShow] = React.useState(false);
  const [amount, setAmount] = React.useState(0);
  const [desc, setDesc] = React.useState('');

  const handlePaymentButton = (storeId, amount, desc) => {
    setStoreId(storeId);
    setDesc(desc);
    setAmount(amount);
    setShow(true);
  };

  return (
    <>
      <Table bordered hover>
        <thead>
          <tr>
            <th colSpan={2} className='text-center text-uppercase'>
              Thông tin khách hàng
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Họ tên</td>
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
          {/* <tr>
            <td>Điểm tích luỹ</td>
            <td>{order?.points || 0}</td>
          </tr> */}
          <tr>
            <td>Ghi chú</td>
            <td>{order?.note || 'Không có'}</td>
          </tr>
        </tbody>
      </Table>
      {storeOrders.map((storeOrder) => {
        return (
          <Table striped bordered hover key={storeOrder?._id}>
            <tbody>
              <tr>
                <td colSpan={4}>
                  <a
                    className='text-decoration-none fw-bold p-0'
                    href={PATH.APP.STORE_DETAIL.replace(
                      ':storeId',
                      storeOrder.storeId?._id
                    )}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {storeOrder.storeId?.name}
                  </a>
                </td>
              </tr>
              {storeOrder?.products.map((product, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{product?.name}</td>
                    <td>x {product?.quantity}</td>
                    <td>
                      {formatCurrency(product?.price * product?.quantity)} đ
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2} className='text-end'>
                  Tổng cộng
                </td>
                <td colSpan={2}>
                  {storeOrder?.discount > 0 && (
                    <div className='text-decoration-line-through'>
                      {formatCurrency(storeOrder?.total)} đ
                    </div>
                  )}
                  <div>{formatCurrency(storeOrder?.total - storeOrder?.discount)} đ</div>
                </td>
              </tr>
              <tr>
                <td colSpan={4} className='text-end'>
                  <Button
                    variant='primary'
                    className='w-100 text-white'
                    onClick={() =>
                      handlePaymentButton(
                        storeOrder?.storeId?._id,
                        storeOrder?.total - storeOrder?.discount,
                        storeOrder?.paymentCode
                      )
                    }
                  >
                    <small>Thanh toán cho cửa hàng này</small>
                  </Button>
                </td>
              </tr>
            </tfoot>
          </Table>
        );
      })}
      <PaymentModal
        storeId={storeId}
        show={show}
        setShow={setShow}
        amount={amount}
        desc={desc}
      />
    </>
  );
}

export default OrderInfo;
