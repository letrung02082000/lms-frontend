import storeApi from 'api/storeApi';
import React, { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import { Pagination, Autoplay, Scrollbar } from 'swiper';
import { Button, Col, Image, Row } from 'react-bootstrap';
import productApi from 'api/productApi';
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
import Loading from 'components/Loading';
import FilterSilder from '../components/FilterSilder';
import { MdMessage, MdPhone } from 'react-icons/md';
import ZaloImage from 'assets/images/ZaloImage';
import ZaloLink from 'components/link/ZaloLink';
import { formatPhoneNumber } from 'utils/commonUtils';
import { IoIosGlobe } from 'react-icons/io';

function StoreDetailPage() {
  const storeId = useParams()?.storeId;
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [store, setStore] = React.useState(null);
  const [products, setProducts] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [categoryId, setCategoryId] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [storeOptions, setStoreOptions] = React.useState(null);

  useEffect(() => {
    storeApi
      .getStoreById(storeId)
      .then((res) => {
        setStoreOptions(res?.data?.options);
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
      }).finally(() => {
        setLoading(false);
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
      {loading && <Loading />}
      <ServiceLayout
        backTo={PATH.APP.ROOT}
        pageTitle={storeOptions?.storeLabel || 'Cửa hàng'}
      >
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
            <div className='d-flex justify-content-between align-items-start'>
              <div>
                <div className='mb-2'>
                  {store?.tel && (
                    <a
                      href={`tel:${store.tel}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-decoration-none'
                    >
                      <MdPhone size={25} />
                      <span className='ms-2'>{formatPhoneNumber(store.tel)}</span>
                    </a>
                  )}
                </div>
                <div className='mb-2'>
                  {store?.zalo && (
                    <ZaloLink tel={store?.zalo} className='text-decoration-none'>
                      <ZaloImage />
                      <span className='ms-2'>{formatPhoneNumber(store.zalo)}</span>
                    </ZaloLink>
                  )}
                </div>
                <div>
                  {store?.website && (
                    <a
                    href={store.website}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-decoration-none'
                  >
                    <IoIosGlobe size={25} />
                    <span className='ms-2'>{store.website}</span>
                  </a>
                  )}
                </div>
              </div>
              {storeOptions?.actionButtonLink && (
                <a
                  className='btn btn-outline-primary'
                  href={storeOptions?.actionButtonLink}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {storeOptions?.actionButtonLabel || ''}
                </a>
              )}
            </div>
            <p>{store?.address}</p>
            <p>{store?.description}</p>
          </div>
          <div className='d-flex justify-content-between align-items-end'>
            <h2 className='m-0 mb-1'>
              Danh sách {storeOptions?.storeLabel?.toLowerCase() || 'sản phẩm'}
            </h2>
          </div>
          <FilterSilder
            categories={categories}
            setCategoryId={setCategoryId}
            categoryId={categoryId}
          />
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
                    hasCartButton={storeOptions?.hasCartButton}
                    handleAddToCartButton={handleAddToCartButton}
                  />
                </div>
              );
            })}
          </div>
        </StyledLayout>
      </ServiceLayout>
      <CartBar />
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
