import React from 'react';
import LazyImage from 'components/LazyImage';
import couponBanner from 'assets/images/coupon-banner.jpg';

function CouponImage() {
  return <LazyImage src={couponBanner} />;
}

export default CouponImage;
