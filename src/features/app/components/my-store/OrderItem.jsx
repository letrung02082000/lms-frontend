import ZaloImage from 'assets/images/ZaloImage';
import CopyToClipboardButton from 'components/button/CopyToClipboardButton';
import ZaloLink from 'components/link/ZaloLink';
import React from 'react';
import { Alert, Card, Col, Row } from 'react-bootstrap';
import { MdPhone } from 'react-icons/md';
import { formatCurrency, formatPhoneNumber } from 'utils/commonUtils';

function OrderItem({ order }) {
  const ORDER_STATUS = {
    0: 'Đã hủy',
    1: 'Chờ xác nhận',
    2: 'Đã xác nhận',
    3: 'Đang giao hàng',
    4: 'Đã giao hàng',
  };

  const remainder = order?.total - order?.discount - order?.cash;

  return (
    <Card key={order.id} className='my-3 mx-2'>
      <Card.Body>
        <Card.Title>
          <div className='d-flex justify-content-between align-items-center'>
            <div>
              <h6>#{order?.code}</h6>
            </div>
            <Alert className='p-2' style={{ width: 'fit-content' }}>
              <small>{ORDER_STATUS[order?.status || 1]}</small>
            </Alert>
          </div>
        </Card.Title>
        <Row>
          <Col xs={8}>
            <div>
              <p className='fw-bold'>{order?.name}</p>
              <p className='form-text'>
                <span>
                  {new Date(order?.createdAt).toLocaleDateString('en-GB')}
                </span>{' '}
                <span>
                  {new Date(order?.createdAt).toLocaleTimeString('en-GB')}
                </span>
              </p>
              <p>
                {order?.address.length > 25
                  ? `${order?.address.slice(0, 25)}...`
                  : order?.address}
              </p>
              <div>
                <span>{formatPhoneNumber(order?.tel)}</span>
                <CopyToClipboardButton
                  variant='outline-primary'
                  value={order?.tel}
                  className='ms-3'
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
            <p>
              <span className='text-secondary'>
                Tổng {formatCurrency(order?.total)} đ
              </span>
            </p>
            <p>
              <span className='text-info'>
                Giảm {formatCurrency(order?.discount)} đ
              </span>
            </p>
            <p>
              <span className='text-primary'>
                CK: {formatCurrency(order?.cash || 0)} đ
              </span>
            </p>
            <p>
              {remainder === 0 ? (
                ''
              ) : (
                <span className='text-danger'>
                  Còn thiếu {formatCurrency(remainder)} đ
                </span>
              )}
            </p>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default OrderItem;
