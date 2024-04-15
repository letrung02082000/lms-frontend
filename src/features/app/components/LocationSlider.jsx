import React, { useEffect } from 'react';
import { Image } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import { Pagination, Autoplay, Scrollbar } from 'swiper';
import storeApi from 'api/storeApi';
import productApi from 'api/productApi';
import { useNavigate } from 'react-router-dom';
import { PATH } from 'constants/path';
import StoreItem from './StoreItem';
import locationApi from 'api/store/locationApi';
import LocationItem from './LocationItem';

function LocationSlider() {
  const [stores, setStores] = React.useState([]);
  const [locations, setLocations] = React.useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    locationApi.getLocations().then((res) => {
      setLocations(res?.data);
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  const handleStoreClick = (id) => {
    navigate(PATH.APP.STORE_DETAIL.replace(':storeId', id));
  }

  return (
    <React.Fragment>
      <div className='d-flex justify-content-between my-4 align-items-end'>
        <h2 className='m-0'>Theo khu vực</h2>
        {/* <button className='btn m-0 p-0' onClick={() => navigate(PATH.APP.STORE)}>Xem tất cả</button> */}
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
        {locations.map((location) => {
          return (
            <SwiperSlide key={location._id}>
              <LocationItem location={location}/>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </React.Fragment>
  );
}

export default LocationSlider;
