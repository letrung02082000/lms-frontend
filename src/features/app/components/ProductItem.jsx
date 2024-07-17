import { PATH } from 'constants/path';
import React from 'react';
import { Button, Col, Image, Row } from 'react-bootstrap';
import { BsCartPlus } from 'react-icons/bs';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatCurrency } from 'utils/commonUtils';

function ProductItem({
  product,
  handleAddToCartButton,
  hasCartButton = true,
  displayPrice = true,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div>
      <div
        onClick={() =>
          navigate(
            PATH.APP.PRODUCT_DETAIL.replace(':productId', product?._id),
            {
              state: { coupon: location?.state?.coupon },
            }
          )
        }
      >
        <div className='p-0'>
          <div className='w-100 mb-2'>
            <Image src={product.image} className='w-100 rounded' />
          </div>
          <h6>{product.name}</h6>
        </div>
      </div>
      <div className='d-flex justify-content-between align-items-end'>
        {displayPrice && (
          <div>
            {product?.originalPrice > 0 &&
              product?.originalPrice !== product?.price && (
                <div className='text-decoration-line-through'>
                  <small>{formatCurrency(product?.originalPrice)} đ</small>
                </div>
              )}
            <div className='text-danger'>
              <small>{formatCurrency(product.price)} đ</small>
            </div>
          </div>
        )}
        {hasCartButton && (
          <div>
            <Button
              variant='outline-danger'
              onClick={() => handleAddToCartButton(product)}
            >
              <BsCartPlus color='red' />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductItem;
