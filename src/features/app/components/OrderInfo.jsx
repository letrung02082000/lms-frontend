import { PATH } from 'constants/path';
import React, { useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import { formatCurrency, formatPhoneNumber } from 'utils/commonUtils';
import PaymentModal from './PaymentModal';

function OrderInfo({ order }) {
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
              Thông tin đơn hàng
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
          <tr>
            <td>Email</td>
            <td>{order?.email || 'Không có'}</td>
          </tr>
          <tr>
            <td>Ghi chú</td>
            <td>{order?.note || 'Không có'}</td>
          </tr>
          <tr>
            <td>Điểm tích luỹ</td>
            <td>{order?.points || 0}</td>
          </tr>
        </tbody>
      </Table>
      {Object.keys(productByStoreId).map((key) => {
        const total = productByStoreId[key]?.reduce(
          (acc, cur) => acc + cur.price * cur.quantity,
          0
        );

        return (
          <Table striped bordered hover key={key}>
            <tbody>
              <tr>
                <td colSpan={4}>
                  <a
                    className='text-decoration-none fw-bold p-0'
                    href={PATH.APP.STORE_DETAIL.replace(
                      ':storeId',
                      productByStoreId[key][0]?.store?._id
                    )}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {productByStoreId[key][0]?.store?.name}
                  </a>
                </td>
              </tr>
              {productByStoreId[key].map((product, index) => {
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
                  <Button
                    variant='outline-primary'
                    className='w-100'
                    onClick={() => handlePaymentButton(key, total, order?.code)}
                  >
                    Thanh toán cho cửa hàng này
                  </Button>
                </td>
                <td className='text-end'>Tổng cộng</td>
                <td>{formatCurrency(total)} đ</td>
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
