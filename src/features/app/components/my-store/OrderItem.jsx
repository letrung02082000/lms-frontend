import ZaloImage from 'assets/images/ZaloImage';
import CopyToClipboardButton from 'components/button/CopyToClipboardButton';
import ZaloLink from 'components/link/ZaloLink';
import React from 'react';
import { Alert, Button, Card, Col, Row } from 'react-bootstrap';
import { MdPhone } from 'react-icons/md';
import { formatCurrency, formatPhoneNumber } from 'utils/commonUtils';

function OrderItem({ order, onPaymentClick }) {
  const ORDER_STATUS = {
    0: 'Huỷ đơn',
    1: 'Nhận đơn',
    2: 'Giao hàng',
    3: 'Xác nhận thành công',
  };

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
          {order?.status !== 0 && (
            <Button variant='outline-danger'>
              <small>Huỷ đơn</small>
            </Button>
          )}
          <Button variant='outline-primary ms-3'>
            <small>{ORDER_STATUS[order?.state || 1]}</small>
          </Button>
          <Button
            variant='outline-success ms-3'
            onClick={() => onPaymentClick(order)}
          >
            <small>Thanh toán</small>
          </Button>
        </div>
      </Card.Footer>
    </Card>
  );
}

export default OrderItem;
