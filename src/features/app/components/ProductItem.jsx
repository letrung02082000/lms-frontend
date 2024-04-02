import { PATH } from 'constants/path';
import React from 'react';
import { Button, Col, Image, Row } from 'react-bootstrap';
import { BsCartPlus } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from 'utils/commonUtils';

function ProductItem({ product, handleAddToCartButton }) {
  const navigate = useNavigate();

  return (
    <>
      <div
        onClick={() =>
          navigate(PATH.APP.PRODUCT_DETAIL.replace(':productId', product?._id))
        }
      >
        <div className='w-100 mb-2'>
          <Image src={product.image} className='w-100 rounded' />
        </div>
        <h6>{product.name}</h6>
      </div>
      <Row>
        <Col xs={4} className='align-self-center'>
          <Button
            variant='outline-danger'
            className='cart-btn'
            onClick={() => handleAddToCartButton(product)}
          >
            <BsCartPlus color='red' />
          </Button>
        </Col>
        <Col xs={8} className='align-self-center ps-3'>
          <Row className='text-danger'>{formatCurrency(product.price)} đ</Row>
          {product?.originalPrice > 0 &&
            product?.originalPrice !== product?.price && (
              <Row className='text-decoration-line-through'>
                {formatCurrency(product?.originalPrice)} đ
              </Row>
            )}
        </Col>
      </Row>
    </>
  );
}

export default ProductItem;
