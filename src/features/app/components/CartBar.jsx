import { PATH } from 'constants/path';
import useMediaQuery from 'hooks/useMediaQuery';
import React, { useMemo } from 'react';
import { Button, Col, Image, Offcanvas, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { selectCart } from 'store/cart';
import styled from 'styled-components';
import { formatCurrency } from 'utils/commonUtils';
import { IoMdBasket } from 'react-icons/io';
import Cart from './Cart';
import EmptyCartImage from 'assets/images/food/empty-cart.jpg'

function CartBar({ bottom = 0 }) {
  const { state } = useLocation();
  const [show, setShow] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const source = searchParams.get('src');
  const orderInfo = {
    address: searchParams.get('address'),
    tel: searchParams.get('tel'),
    name: searchParams.get('name'),
    note: searchParams.get('note'),
    src: searchParams.get('src'),
    hasDelivery: Boolean(searchParams.get('delivery')),
  };
  const SOURCES = {
    QR: 'qr',
    APP: 'app',
  };
  const navigate = useNavigate();
  const cart = useSelector(selectCart);
  const totalPrice = useMemo(() => {
    return cart?.data?.reduce((acc, cur) => acc + cur.price * cur.quantity, 0);
  }, [cart]);
  const [couponsByStoreId, setCouponsByStoreId] = React.useState({});

  return (
    <Styles>
      <Offcanvas
        show={show}
        onHide={() => setShow(false)}
        placement='end'
        style={{ zIndex: 10000 }}
      >
        <Offcanvas.Header closeButton>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Row>
            <Col xs={12}>
              {cart?.data?.length === 0 ? (
                <Row>
                  <h2 className='text-center mb-3'>Giỏ hàng trống</h2>
                  <div className='d-flex justify-content-center'>
                    <Image src={EmptyCartImage} alt='empty-cart' height={200} />
                  </div>
                </Row>
              ) : (
                <>
                  <Cart
                    products={state?.buyNow ? [cart.product] : []}
                    couponsByStoreId={couponsByStoreId}
                    setCouponsByStoreId={setCouponsByStoreId}
                  />
                  <Button
                    className='w-100 my-3'
                    variant='primary text-white'
                    onClick={() => {
                      if (source === SOURCES.QR)
                        return navigate(PATH.APP.CHECKOUT, {
                          state: {
                            ...orderInfo,
                            coupon: location?.state?.coupon,
                          },
                        });
                      navigate(PATH.APP.CHECKOUT, {
                        state: {
                          coupon: location?.state?.coupon,
                        },
                      });
                    }}
                  >
                    Tiến hành đặt hàng
                  </Button>
                </>
              )}
              <Button
                className='w-100'
                variant='outline-primary'
                onClick={() => setShow(false)}
              >
                Đóng
              </Button>
            </Col>
          </Row>
        </Offcanvas.Body>
      </Offcanvas>
      <div
        className='position-fixed d-flex flex-column align-items-center justify-content-center'
        style={{
          right: isDesktop ? '7rem' : '1rem',
          bottom: '5rem',
          zIndex: 1000,
        }}
      >
        <Button
          variant='primary'
          className='rounded-circle'
          style={{ width: '3.9rem', height: '3.9rem' }}
          onClick={() => setShow(true)}
        >
          <IoMdBasket size={35} />
          <span
            className='position-absolute fw-bold'
            style={{ top: 6, right: 20 }}
          >
            {cart?.data?.length || 0}
          </span>
        </Button>
        {/* <span className='fw-bold text-primary bg-white rounded px-2 mt-2'>
          Giỏ hàng
        </span> */}
      </div>
    </Styles>
  );
}

const Styles = styled.div`
  margin-bottom: 2rem;

  .checkout-title {
    margin: 1rem 0;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 1.2rem;
  }

  .product-area {
    margin-bottom: 15rem;
  }

  .cart-area {
    position: sticky;
    top: 0;
    height: 100vh;
  }

  .cart-body {
    height: 85%;
  }

  .cart-btn {
    height: 15%;
    align-items: center;
  }

  @media screen and (max-width: 768px) {
    .cart-area {
      height: 100%;
    }

    .cart-body {
      height: 100%;
    }
  }
`;

export default CartBar;
