import React, { useEffect, useState } from 'react';
import { Image } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import { FreeMode, Pagination } from 'swiper';
import couponApi from 'api/couponApi';
import CouponItem from './CouponItem';
import Loading from 'components/Loading';

function CouponSlider({ storeCategory, priority, visible = true }) {
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
    <React.Fragment>
      <Swiper
        modules={[Pagination, FreeMode]}
        freeMode={true}
        slidesPerView={3.2}
        loop={false}
        spaceBetween={10}
        breakpoints={{
          0: {
            slidesPerView: 2.2,
          },
          700: {
            slidesPerView: 3.2,
          },
          1000: {
            slidesPerView: 4.2,
          },
          1500: {
            slidesPerView: 5.2,
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
        {loading && <Loading />}
        {!loading && coupons.length === 0 && (
          <p className='text-center'>Không có ưu đãi nào</p>
        )}
      </Swiper>
    </React.Fragment>
  );
}

export default CouponSlider;
