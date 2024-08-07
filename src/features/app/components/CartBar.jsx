import { PATH } from 'constants/path';
import useMediaQuery from 'hooks/useMediaQuery';
import React, { useMemo } from 'react';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { selectCart } from 'store/cart';
import styled from 'styled-components';
import { formatCurrency } from 'utils/commonUtils';
import { FaBasketShopping } from "react-icons/fa6";

function CartBar({ bottom = 0 }) {
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

  return (
    <>
      {isDesktop && (
        <>
          <div
            className='position-fixed d-flex align-items-center justify-content-center flex-column'
            style={{ right: '3rem', bottom: '5rem', height: '3.5rem' }}
          >
            {/* <Button variant='outline-danger mb-2 rounded-pill fw-bold'>
              <small>Giỏ hàng</small>{' '}
            </Button> */}
            <Button
              onClick={() => {
                if (source === SOURCES.QR)
                  return navigate(PATH.APP.CHECKOUT, {
                    state: { ...orderInfo, coupon: location?.state?.coupon },
                  });
                navigate(PATH.APP.CHECKOUT, {
                  state: {
                    coupon: location?.state?.coupon,
                  },
                });
              }}
            >
              <FaBasketShopping color='white' size={35} />
              <span className='badge'>{cart?.data?.length || 0}</span>
            </Button>
            <p>Mua ngay</p>

          </div>
        </>
      )}
      {!isDesktop && (
        <StyledLayout
          isDesktop={isDesktop}
          bottom={bottom}
          className='d-flex align-items-center justify-content-between rounded'
        >
          <div className='' style={{ flex: 3 }}>
            <small className='d-block'>{cart?.data?.length || 0} món</small>
          </div>
          <button
            style={{ flex: 4 }}
            className='btn text-white text-center'
            onClick={() => {
              if (source === SOURCES.QR)
                return navigate(PATH.APP.CHECKOUT, {
                  state: { ...orderInfo, coupon: location?.state?.coupon },
                });
              navigate(PATH.APP.CHECKOUT, {
                state: {
                  coupon: location?.state?.coupon,
                },
              });
            }}
          >
            <strong>Xem giỏ hàng</strong>
          </button>
          <div style={{ flex: 3 }} className='text-end'>
            <small>{formatCurrency(totalPrice)} đ</small>
          </div>
        </StyledLayout>
      )}
    </>
  );
}

const StyledLayout = styled.div`
  position: fixed;
  bottom: ${(props) => props.bottom}rem;
  height: 3.5rem;
  width: 100%;
  background-color: var(--primary);
  color: white;
  margin-bottom: 0.1rem;
  padding: 0 1rem;
  z-index: 10000000000;
`;

export default CartBar;
