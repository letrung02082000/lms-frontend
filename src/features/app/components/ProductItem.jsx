import { PATH } from 'constants/path';
import React from 'react';
import { Button, Col, Image, Row } from 'react-bootstrap';
import { BsCartPlus } from 'react-icons/bs';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatCurrency } from 'utils/commonUtils';

function ProductItem({ product, handleAddToCartButton, hasCartButton = true}) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <Row
        onClick={() =>
          navigate(PATH.APP.PRODUCT_DETAIL.replace(':productId', product?._id), {
            state: { coupon: location?.state?.coupon },
          })
        }
      >
        <Col>
          <div className='w-100 mb-2'>
            <Image src={product.image} className='w-100 rounded' />
          </div>
          <h6>{product.name}</h6>
        </Col>
      </Row>
      <Row>
        {hasCartButton && (
          <Col xs={4} className='align-self-center'>
            <Button
              variant='outline-danger'
              className='cart-btn'
              onClick={() => handleAddToCartButton(product)}
            >
              <BsCartPlus color='red' />
            </Button>
          </Col>
        )}
        <Col xs={hasCartButton ? 8 : 12} className='align-self-center'>
          <Row className='text-danger'>
            <small>{formatCurrency(product.price)} đ</small>
          </Row>
          {product?.originalPrice > 0 &&
            product?.originalPrice !== product?.price && (
              <Row className='text-decoration-line-through'>
                <small>{formatCurrency(product?.originalPrice)} đ</small>
              </Row>
            )}
        </Col>
      </Row>
    </>
  );
}

export default ProductItem;
