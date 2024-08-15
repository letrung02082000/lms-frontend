import orderApi from 'api/orderApi';
import storeApi from 'api/storeApi';
import { PATH } from 'constants/path';
import React, { useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import { toastWrapper } from 'utils';
import { formatCurrency } from 'utils/commonUtils';

function OrderItem({storeOrder, handlePaymentButton, orderId}) {
  const [store, setStore] = React.useState({});
  const [paymentLoading, setPaymentLoading] = React.useState(false);

  useEffect(() => {
    if(storeOrder?.storeId?._id) {
      storeApi
      .getStoreById(storeOrder?.storeId?._id)
      .then((res) => {
        setStore(res?.data);
      })
      .catch((err) => {
        console.log(err);
      })
    }
  }, [storeOrder?.storeId?._id]);

  const createPaymentLink = () => {
    setPaymentLoading(true);
    orderApi
      .createPaymentLink({
        paymentCode: storeOrder?.paymentCode,
        orderId: orderId,
      })
      .then((res) => {
        window.open(res?.data?.checkoutUrl, '_blank');
      })
      .catch((err) => {
        orderApi
        .getPaymentLink(storeOrder?.paymentCode)
        .then((res) => {
          const checkoutUrl = `https://pay.payos.vn/web/${res?.data?.id}`;
          window.open(checkoutUrl, '_blank');
        })
        .catch((err) => {
          console.log(err);
          toastWrapper('Không thể tạo link thanh toán', 'error');
        });
      }).finally(() => {
        setPaymentLoading(false);
      });
  };

  return (
    <Table striped bordered hover>
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
              <td>{formatCurrency(product?.price * product?.quantity)} đ</td>
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
            <div>
              {formatCurrency(storeOrder?.total - storeOrder?.discount)} đ
            </div>
          </td>
        </tr>

        {store?.paymentInfo?.integrated && (
          <>
            <tr>
              <td colSpan={2} className='text-end'>
                Đã thanh toán
              </td>
              <td colSpan={2}>
                <div>{formatCurrency(storeOrder?.cash)} đ</div>
              </td>
            </tr>

            <tr>
              <td colSpan={2} className='text-end'>
                Chưa thanh toán
              </td>
              <td colSpan={2}>
                <div>
                  {formatCurrency(
                    storeOrder?.total - storeOrder?.discount - storeOrder?.cash
                  )}{' '}
                  đ
                </div>
              </td>
            </tr>
          </>
        )}

        <tr>
          <td colSpan={4}>
            <p className='text-danger text-center m-0'>
              Vui lòng giữ lại biên lai thanh toán để nhân viên cửa hàng kiểm
              tra khi được yêu cầu
            </p>
          </td>
        </tr>

        {store?.paymentInfo?.integrated ? (
          <tr>
            <td colSpan={4} className='text-end'>
              <Button
                disabled={paymentLoading}
                variant='primary'
                className='w-100 text-white'
                onClick={createPaymentLink}
              >
                {paymentLoading ? 'Đang tạo link thanh toán...' : 'Thanh toán cho cửa hàng này'}
              </Button>
            </td>
          </tr>
        ) : (
          <tr>
            <td colSpan={4} className='text-end'>
              <Button
                variant='primary'
                className='w-100 text-white'
                onClick={() => handlePaymentButton(storeOrder)}
              >
                Thanh toán cho cửa hàng này
              </Button>
            </td>
          </tr>
        )}
      </tfoot>
    </Table>
  );
}

export default OrderItem;
