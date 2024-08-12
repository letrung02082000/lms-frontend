import React, { useEffect } from 'react';
import { Image } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import { Pagination, FreeMode, Grid } from 'swiper';
import storeApi from 'api/storeApi';
import productApi from 'api/productApi';
import { useNavigate } from 'react-router-dom';
import { PATH } from 'constants/path';
import StoreItem from './StoreItem';
import styled from 'styled-components';

function StoreSlider({ slidesPerColumn = 1, freeMode = false }) {
  const [stores, setStores] = React.useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    storeApi
      .getStores()
      .then((res) => {
        setStores(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Styles>
      <div className='d-flex justify-content-between mt-4 mb-2 align-items-end'>
        <h2 className='m-0'>Cửa hàng</h2>
        <button
          className='btn m-0 p-0'
          onClick={() => navigate(PATH.APP.STORE)}
        >
          Xem tất cả
        </button>
      </div>
      <Swiper
        modules={[Grid, Pagination, FreeMode]}
        grid={{
          fill: 'row',
          rows: slidesPerColumn,
        }}
        freeMode={freeMode}
        slidesPerView={3.2}
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
        {stores.map((store) => {
          return (
            <SwiperSlide key={store._id}>
              <StoreItem store={store} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Styles>
  );
}

export default StoreSlider;

const Styles = styled.div`
`;