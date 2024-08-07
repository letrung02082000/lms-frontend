import storeApi from 'api/storeApi';
import React, { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Image, Row } from 'react-bootstrap';
import productApi from 'api/productApi';
import { BsCartPlus, BsPlus } from 'react-icons/bs';
import { formatCurrency } from 'utils/commonUtils';
import styled from 'styled-components';
import CartBar from '../components/CartBar';
import ServiceLayout from 'components/layout/ServiceLayout';
import { PATH } from 'constants/path';
import { useDispatch } from 'react-redux';
import { addProduct } from 'store/cart';
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
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    productApi
      .getProductById(productId)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
  }, []);

  useEffect(() => {
    storeApi
      .getStoreOptions(product?.store?.options)
      .then((res) => {
        setStoreOptions(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [product]);

  const handleAddToCartButton = (product) => {
    dispatch(addProduct({ ...product, quantity: 1 }));
    navigate(PATH.APP.CHECKOUT, {
      state: {
        coupon: location?.state?.coupon,
        buyNow: true,
      },
    });
  };

  return (
    <>
      {loading && <Loading />}
      <ServiceLayout
        state={{
          coupon: location?.state?.coupon,
        }}
        backTo={PATH.APP.STORE_DETAIL.replace(':storeId', product?.store?._id)}
        pageTitle={`Thông tin ${
          storeOptions?.storeLabel?.toLowerCase() || 'sản phẩm'
        }`}
      >
        <StyledLayout isDesktop={isDesktop}>
          <Row className='position-relative'>
            <Col
              xs={12}
              md={6}
              className={isDesktop ? 'position-sticky sticky-top h-100' : ''}
            >
              <Image src={product?.image} className='w-100' />
            </Col>
            <Col>
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
              <div className='my-3'>
                <h4>
                  Thông tin{' '}
                  {storeOptions?.storeLabel?.toLowerCase() || 'sản phẩm'}
                </h4>
                <p>{product?.description}</p>
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
                      <Col>
                        <small>
                          {storeOptions?.cartButtonLabel || 'Mua ngay'}
                        </small>
                      </Col>
                    </Row>
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </StyledLayout>
      </ServiceLayout>
      <CartBar />
    </>
  );
}

const StyledLayout = styled.div`
  margin: 0 auto;
  margin-bottom: 10rem;

  .cart-btn:hover svg {
    color: white !important;
  }
`;

export default ProductDetailPage;
