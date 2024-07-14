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
import CouponByCategorySlider from '../components/CouponByCategorySlider';

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
        <div className='d-flex justify-content-between mt-4 mb-2 align-items-end'>
          <h2 className='m-0'>Ưu đãi</h2>
          <Button
            variant='white'
            className='fw-bold d-flex align-items-center rounded-pill text-success border-2 border-success px-2 py-1'
          >
            <small className='me-1'>{user?.points} điểm</small>
            <Image src={logo} width={25} className='rounded-circle bg-white' />
          </Button>
        </div>
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
        <FilterSilder
          categories={storeCategories}
          setCategoryId={setStoreCategory}
          categoryId={storeCategory}
        />
        <div className='d-flex justify-content-between mb-2 align-items-end'>
        </div>
        <CouponByCategorySlider storeCategory={storeCategory} />
      </StyledLayout>
    </>
  );
}

const StyledLayout = styled.div`
  margin: ${(props) => (props.isDesktop === true ? '0 15%' : '0 5%')};
  margin-bottom: 10rem;

  .product-item {
    width: ${(props) => (props.isDesktop === true ? '22%' : '45%')};
  }

  .cart-btn:hover svg {
    color: white !important;
  }
`;

export default CouponPage;
