import React, { useEffect, useState } from 'react';
import { Image } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import { FreeMode, Pagination, Scrollbar } from 'swiper';
import { useNavigate } from 'react-router-dom';
import { PATH } from 'constants/path';
import couponApi from 'api/couponApi';
import CouponItem from './CouponItem';

function CouponByCategorySlider({storeCategory}) {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log(coupons)
  const handleStoreClick = (id) => {
    navigate(PATH.APP.STORE_BY_CATEGORY.replace(':categoryId', id));
  }

  useEffect(() => {
    couponApi
      .queryCoupons({
        storeCategory,
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
              <CouponItem coupon={coupon}/>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </React.Fragment>
  );
}

export default CouponByCategorySlider;
