import storeApi from 'api/storeApi';
import { PATH } from 'constants/path';
import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import StoreItem from '../components/StoreItem';
import useMediaQuery from 'hooks/useMediaQuery';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import { FreeMode, Pagination } from 'swiper';
import Loading from 'components/Loading';

function AllStorePage() {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [stores, setStores] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [categoryId, setCategoryId] = React.useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    storeApi
      .getStoreCategories()
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    if (!categoryId) {
      storeApi
        .getStores()
        .then((res) => {
          setStores(res.data);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      storeApi
        .getStoresByCategory(categoryId)
        .then((res) => {
          setStores(res.data);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [categoryId]);

  return (
    <>
      {loading && <Loading />}
      <StyledLayout isDesktop={isDesktop}>
        <Swiper
          modules={[Pagination, FreeMode]}
          slidesPerView={3.2}
          loop={false}
          spaceBetween={10}
          breakpoints={{
            0: {
              slidesPerView: 3.2,
            },
            700: {
              slidesPerView: 4.2,
            },
            1000: {
              slidesPerView: 4.2,
            },
            1500: {
              slidesPerView: 5.2,
            },
          }}
        >
          <SwiperSlide>
            <Button
              onClick={() => setCategoryId('')}
              variant={categoryId === '' ? 'secondary' : 'outline-secondary'}
              className='w-100 rounded-pill fw-bold my-1 p-1'
            >
              <small>Tất cả</small>
            </Button>
          </SwiperSlide>
          {categories.map((cat) => {
            return (
              <SwiperSlide key={cat._id}>
                <Button
                  onClick={() => setCategoryId(cat?._id)}
                  variant={
                    categoryId === cat?._id ? 'secondary' : 'outline-secondary'
                  }
                  className='w-100 rounded-pill fw-bold my-1 p-1'
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <small>{cat?.name}</small>
                </Button>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div className='d-flex flex-wrap justify-content-between w-100 my-3'>
          {stores.map((store) => {
            return (
              <div
                key={store?._id}
                className='store-item mb-3 d-flex flex-column justify-content-between'
              >
                <StoreItem store={store} />
              </div>
            );
          })}
          {stores.length === 0 && (
            <p className='text-center w-100'>Không có cửa hàng nào</p>
          )}
        </div>
      </StyledLayout>
    </>
  );
}

const StyledLayout = styled.div`
  .store-item {
    width: ${(props) => (props.isDesktop === true ? '22%' : '45%')};
  }
`;

export default AllStorePage;
