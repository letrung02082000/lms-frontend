import React, { useEffect, useState } from 'react';
import { Image } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Grid, Pagination } from "swiper/modules";
import couponApi from 'api/couponApi';
import CouponItem from './CouponItem';
import Loading from 'components/Loading';
import styled from 'styled-components';

function CouponSlider({
  storeCategory,
  priority,
  visible = true,
  slidesPerColumn = 1,
  freeMode = false,
}) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    couponApi
      .queryCoupons({
        storeCategory,
        priority,
        visible,
      })
      .then((res) => {
        setCoupons(res?.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [storeCategory]);

  return (
    <Styles>
      <Swiper
        modules={[Pagination, FreeMode, Grid]}
        grid={{
          fill: 'row',
          rows: slidesPerColumn,
        }}
        slidesPerView={3.5}
        loop={false}
        spaceBetween={10}
        breakpoints={{
          0: {
            slidesPerView: 2.5,
          },
          700: {
            slidesPerView: 3.5,
          },
          1000: {
            slidesPerView: 4.5,
          },
          1500: {
            slidesPerView: 5.5,
          },
        }}
      >
        {coupons.map((coupon) => {
          return (
            <SwiperSlide key={coupon._id}>
              <CouponItem coupon={coupon} />
            </SwiperSlide>
          );
        })}
        {!loading && coupons.length === 0 && (
          <p className='text-center'>Không có ưu đãi nào</p>
        )}
      </Swiper>
      {loading && <Loading />}
    </Styles>
  );
}

export default CouponSlider;

const Styles = styled.div`
`;