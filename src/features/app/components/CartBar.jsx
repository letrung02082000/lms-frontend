import { PATH } from 'constants/path';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { selectCart } from 'store/cart';
import styled from 'styled-components';
import { formatCurrency } from 'utils/commonUtils';

function CartBar({bottom = 0}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const source = searchParams.get('src');
  const orderInfo = {
    address: searchParams.get('address'),
    tel: searchParams.get('tel'),
    name: searchParams.get('name'),
    note: searchParams.get('note'),
    src: searchParams.get('src'),
    hasDelivery: Boolean(searchParams.get('delivery')),
  }
  const SOURCES = {
    QR: 'qr',
    APP: 'app',
  }
  const navigate = useNavigate();
  const cart = useSelector(selectCart);
  const totalPrice = useMemo(()=>{
    return cart?.data?.reduce((acc, cur) => acc + cur.price * cur.quantity, 0)
  }, [cart])

  return (
    <StyledLayout bottom={bottom}>
      <div>
        <p className='m-0'>Cộng</p>
        <p className='m-0 text-center'>{cart?.data?.length || 0}</p>
      </div>
      <button
        className='btn text-white'
        onClick={() => {
          if (source === SOURCES.QR)
            return navigate(PATH.APP.CHECKOUT, { state: orderInfo });
          navigate(PATH.APP.CHECKOUT);
        }}
      >
        Xem giỏ hàng
      </button>
      <div>{formatCurrency(totalPrice)} đ</div>
    </StyledLayout>
  );
}

const StyledLayout = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  bottom: ${(props) => props.bottom}rem;
  height: 3.5rem;
  width: 100%;
  background-color: var(--primary);
  color: white;
  border-radius: 1rem;
  margin-bottom: 0.1rem;
  padding: 0 1rem;
  z-index: 10000000000;
`;

export default CartBar;
