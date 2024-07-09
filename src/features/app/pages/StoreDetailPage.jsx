import storeApi from 'api/storeApi';
import React, { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import { Pagination, Autoplay, Scrollbar } from 'swiper';
import { Button, Col, Image, Row } from 'react-bootstrap';
import productApi from 'api/productApi';
import { BsCartPlus } from 'react-icons/bs';
import { formatCurrency } from 'utils/commonUtils';
import styled from 'styled-components';
import CartBar from '../components/CartBar';
import ServiceLayout from 'components/layout/ServiceLayout';
import { PATH } from 'constants/path';
import { useDispatch } from 'react-redux';
import { addToCart } from 'store/cart';
import { toastWrapper } from 'utils';
import useMediaQuery from 'hooks/useMediaQuery';
import ProductItem from '../components/ProductItem';
import categoryApi from 'api/store/categoryApi';

function StoreDetailPage() {
  const storeId = useParams()?.storeId;
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [store, setStore] = React.useState(null);
  const [products, setProducts] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [categoryId, setCategoryId] = React.useState('');

  useEffect(() => {
    storeApi
      .getStoreById(storeId)
      .then((res) => {
        setStore(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });

    categoryApi
      .getProductCategories(storeId)
      .then((res) => {
        setCategories(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (!categoryId) {
      productApi
        .getProductsByStoreId(storeId)
        .then((res) => {
          setProducts(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      productApi
        .getProductsByCategory(categoryId, storeId)
        .then((res) => {
          setProducts(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [categoryId]);

  const dispatch = useDispatch();
  const handleAddToCartButton = (item) => {
    dispatch(addToCart(item));
    toastWrapper('Đã thêm vào giỏ hàng', 'success');
  };

  return (
    <>
      <ServiceLayout backTo={PATH.APP.ROOT} pageTitle='Xem cửa hàng'>
        <StyledLayout isDesktop={isDesktop}>
          <Swiper
            className='m-2'
            modules={[Pagination, Scrollbar]}
            slidesPerView={1}
            loop={false}
            scrollbar={{ hide: true }}
          >
            {store?.images?.map((image, idx) => {
              return (
                <SwiperSlide key={idx}>
                  <Image src={image} className='w-100' />
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div className='mt-3 mb-2'>
            <h2>{store?.name}</h2>
            <p>{store?.address}</p>
            <p>{store?.phone}</p>
            <p>{store?.description}</p>
          </div>
          <div className='d-flex justify-content-between align-items-end'>
            <h2 className='m-0'>Danh sách sản phẩm</h2>
          </div>
          <Swiper
            modules={[Pagination]}
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
                className='w-100 rounded-pill fw-bold  my-1 p-1'
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
                      categoryId === cat?._id
                        ? 'secondary'
                        : 'outline-secondary'
                    }
                    className='w-100 rounded-pill fw-bold  my-1 p-1'
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    <small>{cat?.name}</small>
                  </Button>
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div className='d-flex flex-wrap w-100 mt-3 mb-5 justify-content-between'>
            {products.length === 0 && (
              <p className='w-100 my-5 text-center'>Không có sản phẩm nào</p>
            )}
            {products.map((product) => {
              return (
                <div
                  key={product._id}
                  className='product-item mb-3 d-flex flex-column justify-content-between'
                >
                  <ProductItem
                    product={product}
                    handleAddToCartButton={handleAddToCartButton}
                  />
                </div>
              );
            })}
          </div>
        </StyledLayout>
      </ServiceLayout>
      <CartBar/>
    </>
  );
}

const StyledLayout = styled.div`
  .product-item {
    width: ${(props) => (props.isDesktop === true ? '22%' : '45%')};
  }

  .cart-btn:hover svg {
    color: white !important;
  }
`;

export default StoreDetailPage;
