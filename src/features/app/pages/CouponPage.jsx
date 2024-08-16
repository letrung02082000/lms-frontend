import userApi from 'api/userApi';
import Loading from 'components/Loading';
import React, { useEffect } from 'react';
import { Button, Image } from 'react-bootstrap';
import styled from 'styled-components';
import logo from 'assets/square-logo.png'
import FilterSilder from '../components/FilterSilder';
import categoryApi from 'api/store/categoryApi';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import { Pagination } from 'swiper';
import CouponSlider from '../components/CouponSlider';
import CartBar from '../components/CartBar';

function CouponPage() {
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);
  const [storeCategory, setStoreCategory] = React.useState('');
  const [storeCategories, setStoreCategories] = React.useState([]);

  useEffect(() => {
    userApi
      .getUser()
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });

      categoryApi
        .getStoreCategories()
        .then((res) => {
          setStoreCategories(res?.data);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
  }, []);

  return (
    <>
      {loading && <Loading />}
      <StyledLayout>
        {/* <div className='d-flex justify-content-between mt-4 mb-2 align-items-end'>
          <h2 className='m-0'>Ưu đãi</h2>
          <Button
            variant='outline-success'
            className='d-flex align-items-center px-2 py-1'
          >
            {user?.points && <small className='me-1'>{user?.points} điểm</small>}
            <Image src={logo} width={15} className='rounded-circle bg-white' />
          </Button>
        </div> */}
        <Swiper
          modules={[Pagination]}
          slidesPerView={1}
          loop={true}
          className='mb-3'
        >
          <SwiperSlide>
            <Image
              src='https://istudentspace.sgp1.digitaloceanspaces.com/public/banner-2.jpg'
              fluid
              className='mt-3'
            />
          </SwiperSlide>
        </Swiper>
        <div className='d-flex justify-content-between my-2 align-items-end'>
          <h2>Ưu đãi mới</h2>
        </div>
        <CouponSlider slidesPerColumn={2}/>
        <div className='d-flex justify-content-between my-2 align-items-end'>
          <h2>Danh mục</h2>
        </div>
        <FilterSilder
          categories={storeCategories}
          setCategoryId={setStoreCategory}
          categoryId={storeCategory}
        />
        <div className='d-flex justify-content-between mb-2 align-items-end'></div>
        <CouponSlider storeCategory={storeCategory}/>
        <div className='d-flex justify-content-between my-2 align-items-end'>
          <h2>Dành cho bạn</h2>
        </div>
        <CouponSlider priority={-1} />
      </StyledLayout>
      <CartBar/>
    </>
  );
}

const StyledLayout = styled.div`
  margin: 0 auto;
  margin-bottom: 10rem;
  width: ${({theme}) => (theme.isDesktop === true ? '60%' : '95%')};
`;

export default CouponPage;
