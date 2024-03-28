import React, { useEffect } from 'react';
import { Image } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import { Pagination, Scrollbar } from 'swiper';
import storeApi from 'api/storeApi';
import { useNavigate } from 'react-router-dom';
import { PATH } from 'constants/path';

function CategorySlider() {
  const [categories, setCategories] = React.useState([]);
  console.log(categories);
  const navigate = useNavigate();

  useEffect(() => {
    storeApi
      .getStoreCategories()
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleStoreClick = (id) => {
    navigate(PATH.APP.STORE_BY_CATEGORY.replace(':categoryId', id));
  }

  return (
    <React.Fragment>
      <div className='d-flex justify-content-between my-4 align-items-end'>
        <h2 className='m-0'>Loại hình</h2>
      </div>
      <Swiper
        modules={[Pagination, Scrollbar]}
        slidesPerView={4}
        loop={false}
        scrollbar={{ hide: false }}
        spaceBetween={10}
        breakpoints={{
          0: {
            slidesPerView: 4,
          },
          700: {
            slidesPerView: 8,
          },
          1000: {
            slidesPerView: 8,
          },
          1500: {
            slidesPerView: 8,
          },
        }}
      >
        {categories.map((category) => {
          return (
            <SwiperSlide key={category._id}>
              <div onClick={() => handleStoreClick(category._id)}>
                <div>
                  <Image className='p-3' src={category?.icon} />
                </div>
                <h6 className='pb-2'>{category?.name}</h6>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </React.Fragment>
  );
}

export default CategorySlider;
