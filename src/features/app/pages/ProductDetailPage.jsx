import storeApi from 'api/storeApi';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Image, Row } from 'react-bootstrap';
import productApi from 'api/productApi';
import { BsCartPlus, BsPlus } from 'react-icons/bs';
import { formatCurrency } from 'utils/commonUtils';
import styled from 'styled-components';
import CartBar from '../components/CartBar';
import ServiceLayout from 'components/layout/ServiceLayout';
import { PATH } from 'constants/path';
import { useDispatch } from 'react-redux';
import { addToCart } from 'store/cart';
import { toastWrapper } from 'utils';
import useMediaQuery from 'hooks/useMediaQuery';
import Loading from 'components/Loading';
import { MdStoreMallDirectory } from 'react-icons/md';

function ProductDetailPage() {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const productId = useParams().productId;
  const [product, setProduct] = React.useState({});
  const [storeOptions, setStoreOptions] = React.useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    productApi
      .getProductById(productId)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    storeApi
      .getStoreOptions(product?.store?.options)
      .then((res) => {
        console.log(res.data);
        setStoreOptions(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [product]);

  const dispatch = useDispatch();
  const handleAddToCartButton = (item) => {
    dispatch(addToCart(item));
    toastWrapper('Đã thêm vào giỏ hàng', 'success');
  };

  return (
    <>
      {loading && <Loading />}
      <ServiceLayout
        backTo={PATH.APP.STORE_DETAIL.replace(':storeId', product?.store?._id)}
        pageTitle={`Thông tin ${
          storeOptions?.storeLabel?.toLowerCase() || 'sản phẩm'
        }`}
      >
        <StyledLayout isDesktop={isDesktop}>
          <Image src={product?.image} className='w-100' />
          <div className='my-3'>
            <h2 className='d-inline-block'>{product?.name}</h2>
            <div className=''>
              {product?.originalPrice > 0 &&
                product?.originalPrice !== product?.price && (
                  <span className='text-decoration-line-through text-primary me-2'>
                    <span>{formatCurrency(product?.originalPrice)} đ</span>
                  </span>
                )}
              <span className='text-danger'>
                {formatCurrency(product?.price)} đ
              </span>
            </div>
          </div>
          <Row className='mb-3'>
            <Col>
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
                <Row>
                  <Col xs={2}>
                    <MdStoreMallDirectory />
                  </Col>
                  <Col>
                    <small>Xem cửa hàng</small>
                  </Col>
                </Row>
              </Button>
            </Col>
            <Col xs={6}>
              <Button
                variant='outline-danger'
                className='cart-btn w-100 fw-bold'
                onClick={() => handleAddToCartButton(product)}
              >
                <Row>
                  <Col xs={2}>
                    <BsPlus color='red' />
                  </Col>
                  <Col>
                    <small>
                      {storeOptions?.cartButtonLabel || 'Thêm vào giỏ hàng'}
                    </small>
                  </Col>
                </Row>
              </Button>
            </Col>
          </Row>
          <div className='my-3'>
            <h4>Mô tả {storeOptions?.storeLabel?.toLowerCase() || 'sản phẩm'}</h4>
            <p>{product?.description}</p>
          </div>
        </StyledLayout>
      </ServiceLayout>
      <CartBar />
    </>
  );
}

const StyledLayout = styled.div`
  margin-bottom: 10rem;

  .product-item {
    width: ${(props) => (props.isDesktop === true ? '22%' : '45%')};
  }

  .cart-btn:hover svg {
    color: white !important;
  }
`;

export default ProductDetailPage;
