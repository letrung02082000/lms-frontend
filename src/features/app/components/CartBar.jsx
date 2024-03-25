import { PATH } from 'constants/path';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

function CartBar() {
  const navigate = useNavigate();

  return (
    <StyledLayout>
      <div>
        <p className='m-0'>Cộng</p>
        <p className='m-0 text-center'>0</p>
      </div>
      <button className='btn text-white' onClick={() => navigate(PATH.APP.CHECKOUT)}>Xem giỏ hàng</button>
      <div>100,000đ</div>
    </StyledLayout>
  );
}

const StyledLayout = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  bottom: 0;
  height: 3.5rem;
  width: 100%;
  background-color: var(--primary);
  color: white;
  border-radius: 1rem;
  margin-bottom: 0.1rem;
  padding: 0 1rem;
  z-index: 1000;
`;

export default CartBar;
