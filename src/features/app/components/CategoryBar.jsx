import React, { useEffect } from 'react';
import { Image } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import { Pagination, Scrollbar } from 'swiper';
import storeApi from 'api/storeApi';
import { useNavigate } from 'react-router-dom';
import { PATH } from 'constants/path';

function CategoryBar() {
  const [categories, setCategories] = React.useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    storeApi
      .getStoreCategories()
      .then((res) => {
        setCategories(res?.data);
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
      <div className='d-flex w-100 flex-wrap justify-content-start'>
        {categories.map((category) => {
          return (
            <div
              onClick={() => handleStoreClick(category._id)}
              key={category._id}
              className='bg-white rounded m-1'
              style={{ width: '22%' }}
            >
              <div>
                <div style={{
                  backgroundColor: '#f5f5f5',
                  borderRadius: '15%',
                }}>
                  <Image className='p-2 w-100' src={category?.icon} />
                </div>
              </div>
              <h6 style={{
                fontSize: '0.9rem',
              }} className='text-center mt-1'>{category?.name}</h6>
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
}

export default CategoryBar;
