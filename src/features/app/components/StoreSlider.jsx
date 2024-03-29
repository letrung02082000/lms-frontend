import React, { useEffect } from 'react';
import { Image } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import { Pagination, Autoplay, Scrollbar } from 'swiper';
import storeApi from 'api/storeApi';
import productApi from 'api/productApi';
import { useNavigate } from 'react-router-dom';
import { PATH } from 'constants/path';
import StoreItem from './StoreItem';

function StoreSlider() {
  const [stores, setStores] = React.useState([]);
  const [products, setProducts] = React.useState([]);
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

  const handleStoreClick = (id) => {
    navigate(PATH.APP.STORE_DETAIL.replace(':storeId', id));
  }

  return (
    <React.Fragment>
      <div className='d-flex justify-content-between my-4 align-items-end'>
        <h2 className='m-0'>Cửa hàng</h2>
        <button className='btn m-0 p-0' onClick={() => navigate(PATH.APP.STORE)}>Xem tất cả</button>
      </div>
      <Swiper
        modules={[Pagination, Scrollbar]}
        slidesPerView={3}
        loop={false}
        scrollbar={{ hide: false }}
        spaceBetween={10}
        breakpoints={{
          0: {
            slidesPerView: 2,
          },
          700: {
            slidesPerView: 3,
          },
          1000: {
            slidesPerView: 4,
          },
          1500: {
            slidesPerView: 5,
          },
        }}
      >
        {stores.map((store) => {
          return (
            <SwiperSlide key={store._id}>
              <StoreItem store={store}/>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </React.Fragment>
  );
}

export default StoreSlider;
