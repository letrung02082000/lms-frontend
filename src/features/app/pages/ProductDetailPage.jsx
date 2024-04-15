import storeApi from 'api/storeApi';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Image, Row } from 'react-bootstrap';
import productApi from 'api/productApi';
import { BsCartPlus } from 'react-icons/bs';
import { formatCurrency } from 'utils/commonUtils';
import styled from 'styled-components';
import CartBar from '../components/CartBar';
import ServiceLayout from 'components/layout/ServiceLayout';
import { PATH } from 'constants/path';
import { useDispatch } from 'react-redux';
import { addToCart } from 'store/cart';
import { toastWrapper } from 'utils';
import useMediaQuery from 'hooks/useMediaQuery';

function ProductDetailPage() {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const productId = useParams().productId;
  const [product, setProduct] = React.useState({});
  const navigate = useNavigate();

  useEffect(() => {
    productApi
      .getProductById(productId)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const dispatch = useDispatch();
  const handleAddToCartButton = (item) => {
    dispatch(addToCart(item));
    toastWrapper('Đã thêm vào giỏ hàng', 'success');
  };

  return (
    <>
      <ServiceLayout backTo={PATH.APP.ROOT} pageTitle='Thông tin sản phẩm'>
        <StyledLayout isDesktop={isDesktop}>
          <Image src={product?.image} className='w-100' />
          <div className='my-3'>
            <h2>{product?.name}</h2>
          </div>
          <Row className='mb-3'>
            <Col xs={8} className='align-self-center'>
              <Button
                variant='outline-primary'
                className='w-100'
                onClick={() =>
                  navigate(
                    PATH?.APP?.STORE_DETAIL.replace(
                      ':storeId',
                      product?.store?._id
                    )
                  )
                }
              >
                Xem cửa hàng
              </Button>
            </Col>
            <Col xs={4} className='align-self-center'>
              <Row className='text-danger'>
                {formatCurrency(product?.price)} đ
              </Row>
              {product?.originalPrice > 0 &&
                product?.originalPrice !== product?.price && (
                  <Row className='text-decoration-line-through'>
                    {formatCurrency(product?.originalPrice)} đ
                  </Row>
                )}
            </Col>
          </Row>
          <Row>
            <Col className='align-self-center'>
              <Button
                variant='outline-danger'
                className='cart-btn w-100'
                onClick={() => handleAddToCartButton(product)}
              >
                <BsCartPlus color='red' />
                <span className='ms-2'>Thêm vào giỏ hàng</span>
              </Button>
            </Col>
          </Row>
          <div className='my-3'>
            <h4>Mô tả sản phẩm</h4>
            <p>{product?.description}</p>
          </div>
        </StyledLayout>
      </ServiceLayout>
      <CartBar />
    </>
  );
}

const StyledLayout = styled.div`
  margin-bottom: ${(props) => (props.isDesktop === true ? '5rem' : '0')};

  .product-item {
    width: ${(props) => (props.isDesktop === true ? '22%' : '45%')};
  }

  .cart-btn:hover svg {
    color: white !important;
  }
`;

export default ProductDetailPage;
