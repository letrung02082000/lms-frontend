import React from 'react';
import LazyImage from 'components/LazyImage';
import styled from 'styled-components';
import { convertToDateTime, formatCurrency } from 'utils/commonUtils';

function CouponArea({ code, amount, unitDisplay, minValue, validUntil, count, maxQuantity }) {
  return (
    <Styles className='d-flex align-items-center'>
      <LazyImage src='/common/isinhvien.png' height={25} width='auto' />
      <div className='coupon-wrapper ms-2'>
        {/* <div className='code'>{code}</div> */}
        <div className='amount'>
          Giảm {formatCurrency(amount)}
          {unitDisplay}
        </div>
        <div className='small-text'>Áp dụng cho đơn hàng từ {formatCurrency(minValue)}đ</div>
        <div className='small-text'>Hiệu lực đến {convertToDateTime(validUntil)}</div>
        <div className='small-text'>Còn {maxQuantity - count} lượt sử dụng</div>
      </div>
    </Styles>
  );
}

export default CouponArea;

const Styles = styled.div`
  border: 1px solid #ccc;
  padding: 1rem;
  width: fit-content;
  border-radius: 5px;

  .amount {
    font-weight: bold;
    font-size: 1.1rem;
    color: #2e2e2e;
  }

  .small-text {
    font-size: 0.85rem;
    color: #3f3f3f;
  }
`;
