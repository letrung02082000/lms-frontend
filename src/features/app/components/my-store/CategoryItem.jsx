import React from 'react';
import {Button, Card, Col, Image, Row } from 'react-bootstrap';
import { formatCurrency } from 'utils/commonUtils';

function CategoryItem({ category }) {
  const category_STATUS = {
    0: 'Đã hủy',
    1: 'Nhận đơn',
    2: 'Chuyển giao',
    3: 'Hoàn tất',
    4: 'Huỷ đơn',
  };

  return (
    <Card key={category.id} className='my-3 mx-2'>
      <Card.Body>
        <Row>
          <Col>
            <Image
              className='mb-2'
              src={category?.image}
              alt={category?.name}
              fluid
            />
            {category?.visible ? (
              <Button variant='outline-secondary'>
                <small>Ẩn thể loại</small>
              </Button>
            ) : (
              <Button variant='outline-primary'>
                <small>Hiện thể loại</small>
              </Button>
            )}
          </Col>
          <Col xs={7}>
            <p className='fw-bold mb-2'>{category?.name}</p>
            <p className='mb-2'>{category?.description}</p>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default CategoryItem;
