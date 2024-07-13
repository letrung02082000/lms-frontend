import { PATH } from 'constants/path';
import React from 'react';
import { Button, Table } from 'react-bootstrap';
import { formatCurrency } from 'utils/commonUtils';

function OrderInfo({ order }) {
  console.log(order)
  const productByStoreId = order?.productByStoreId || [];

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
      {
            Object.keys(productByStoreId).map((key, index) => {
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
                            {formatCurrency(product?.price * product?.quantity)}{' '}
                            đ
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={2} className='text-end'>
                        <Button variant='outline-primary' className='w-100'>
                          Thanh toán cho cửa hàng này
                        </Button>
                      </td>
                      <td className='text-end'>Tổng cộng</td>
                      <td>
                        {formatCurrency(
                          productByStoreId[key]?.reduce(
                            (acc, cur) => acc + cur.price * cur.quantity,
                            0
                          )
                        )}{' '}
                        đ
                      </td>
                    </tr>
                  </tfoot>
                </Table>
              );
            })
          }
    </>
  );
}

export default OrderInfo;
