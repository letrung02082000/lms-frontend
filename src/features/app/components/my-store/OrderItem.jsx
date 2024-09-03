import orderApi from 'api/orderApi';
import ZaloImage from 'assets/images/ZaloImage';
import CopyToClipboardButton from 'components/button/CopyToClipboardButton';
import ZaloLink from 'components/link/ZaloLink';
import React from 'react';
import { Alert, Button, Card, Col, Row } from 'react-bootstrap';
import { MdPhone } from 'react-icons/md';
import { toastWrapper } from 'utils';
import { formatCurrency, formatPhoneNumber } from 'utils/commonUtils';

function OrderItem({ order, onDetailClick }) {
  const ORDER_STATUS_LABEL = {
    0: 'Tiếp nhận lại',
    1: 'Nhận đơn',
    2: 'Giao đơn',
    3: 'Đã giao đơn',
    4: 'Đã hoàn thành',
  };
  
  const ORDER_STATUS = {
    CANCELLED: 0,
    PENDING: 1,
    CONFIRMED: 2,
    DELIVERED: 3,
    COMPLETED: 4,
  };
  
  const [orderStatus, setOrderStatus] = React.useState(order?.status || ORDER_STATUS.PENDING);

  const updateOrder = async (id, data) => {
    orderApi.updateMyOrder(id, data).then((res) => {
      setOrderStatus(res?.data?.status);
      toastWrapper('Đã cập nhật trạng thái đơn hàng', 'success');
    }).catch((err) => {
      console.log(err);
    });
  }

  const remainder = order?.total - order?.discount - order?.cash;

  return (
    <Card key={order.id} className='my-3 mx-2'>
      <Card.Body>
        <Row className='mb-2'>
          <div className='d-flex justify-content-between align-items-center'>
            <span className='form-text fw-bold'>
              <span>
                {new Date(order?.createdAt).toLocaleDateString('en-GB')}
              </span>{' '}
              <span>
                {new Date(order?.createdAt).toLocaleTimeString('en-GB')}
              </span>
            </span>
            <span className='form-text'>#{order?.code}</span>
          </div>
        </Row>
        <Row>
          <Col xs={7}>
            <div>
              <p className='fw-bold mb-2'>{order?.name}</p>

              <p className='mb-2'>
                {order?.address.length > 25
                  ? `${order?.address.slice(0, 25)}...`
                  : order?.address}
              </p>
              <div>
                <p className='mb-2'>{formatPhoneNumber(order?.tel)}</p>
                <CopyToClipboardButton
                  variant='outline-primary'
                  value={order?.tel}
                />
                <a href={`tel:${order?.tel}`} className='ms-3'>
                  <MdPhone />
                </a>
                <ZaloLink tel={order?.tel} className='ms-3'>
                  <ZaloImage />
                </ZaloLink>
              </div>
            </div>
          </Col>
          <Col>
            <p className='text-primary mb-2'>
              <span>Tổng</span> {formatCurrency(order?.total)} đ
            </p>
            <p className='mb-2'>
              <span className='text-warning'>
                - Giảm {formatCurrency(order?.discount)} đ
              </span>
            </p>
            <p className='mb-2'>
              <span className='text-success'>
                - CK {formatCurrency(order?.cash || 0)} đ
              </span>
            </p>
            {remainder !== 0 && (
              <p className='text-danger mb-2'>
                Nợ {formatCurrency(remainder)} đ
              </p>
            )}
          </Col>
        </Row>
      </Card.Body>
      <Card.Footer>
        <div className='d-flex justify-content-between'>
          {orderStatus !== ORDER_STATUS.CANCELLED ? (
            <Button
              variant='outline-danger'
              onClick={() =>
                updateOrder(order?._id, { status: ORDER_STATUS.CANCELLED })
              }
            >
              <small>Huỷ đơn</small>
            </Button>
          ) : (
            <Button variant='danger'>
              <small>Đã huỷ</small>
            </Button>
          )}

          {orderStatus !== ORDER_STATUS.COMPLETED ? (
            <Button
              variant='outline-primary ms-3'
              onClick={() => {
                if (orderStatus === ORDER_STATUS.COMPLETED) return;

                updateOrder(order?._id, { status: orderStatus + 1 });
              }}
            >
              <small>{ORDER_STATUS_LABEL[orderStatus]}</small>
            </Button>
          ) : (
            <Button variant='success'>
              <small>Đã hoàn thành</small>
            </Button>
          )}
          <Button variant='primary ms-3' onClick={() => onDetailClick(order)}>
            <small>Xem chi tiết</small>
          </Button>
        </div>
      </Card.Footer>
    </Card>
  );
}

export default OrderItem;
