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
      <div className='d-flex justify-content-between my-4 align-items-end'>
        <h2 className='m-0'>Danh mục sản phẩm</h2>
      </div>
      <div className='d-flex w-100 flex-wrap justify-content-start'>
        {categories.map((category) => {
          return (
            <div key={category._id} className='bg-white rounded m-1 p-1' style={{width: '22%'}}>
              <div onClick={() => handleStoreClick(category._id)}>
                <div>
                  <Image className='p-1 w-100' src={category?.icon} />
                </div>
                <h6 className='text-center'>{category?.name}</h6>
              </div>
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
}

export default CategoryBar;
