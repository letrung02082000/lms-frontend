import React from 'react';
import { Table } from 'react-bootstrap';
import { formatCurrency } from 'utils/commonUtils';

function OrderInfo({ order }) {
  const products = order?.products || [];
  const totalPrice = products.reduce((total, product) => {
    return total + product.price * product.quantity;
  }, 0);

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
            <td>{order?.tel}</td>
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
        </tbody>
      </Table>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Sản phẩm</th>
            <th>Cửa hàng</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((product, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{product?.name}</td>
                <td>
                  <a
                    href={'/app/' + product?.store?._id}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {product?.store?.name}
                  </a>
                </td>
                <td>{product?.quantity}</td>
                <td>{formatCurrency(product?.price * product?.quantity)} đ</td>
              </tr>
            );
          })}
          <tr>
            <td colSpan={4}>
              <b>Tổng cộng</b>
            </td>
            <td>
              <b>{formatCurrency(totalPrice)} đ</b>
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  );
}

export default OrderInfo;
