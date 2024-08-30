import React from 'react';
import {Button, Card, Col, Image, Row } from 'react-bootstrap';
import { formatCurrency } from 'utils/commonUtils';

function ProductItem({ product }) {
  const product_STATUS = {
    0: 'Đã hủy',
    1: 'Nhận đơn',
    2: 'Chuyển giao',
    3: 'Hoàn tất',
    4: 'Huỷ đơn',
  };

  return (
    <Card key={product.id} className='my-3 mx-2'>
      <Card.Body>
        <Row>
          <Col>
            <Image
              className='mb-2'
              src={product?.image}
              alt={product?.name}
              fluid
            />
            {product?.visible ? (
              <Button variant='outline-secondary'>
                <small>Ẩn sản phẩm</small>
              </Button>
            ) : (
              <Button variant='outline-primary'>
                <small>Hiện sản phẩm</small>
              </Button>
            )}
          </Col>
          <Col xs={7}>
            <p className='fw-bold mb-2'>{product?.name}</p>
            <p className='form-text'>{product?.category?.name}</p>
            <p>
              {product?.originalPrice && (
                <span className='mb-2 text-decoration-line-through'>
                  {formatCurrency(product?.originalPrice)}
                </span>
              )}{' '}
              <span className='mb-2'>{formatCurrency(product?.price)}</span> VNĐ
            </p>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default ProductItem;
