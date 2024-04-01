import storeApi from 'api/storeApi';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
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

function StoreDetailPage() {
  const storeId = useParams().storeId;
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [store, setStore] = React.useState(null);
  const [products, setProducts] = React.useState([]);

  useEffect(() => {
    storeApi
      .getStoreById(storeId)
      .then((res) => {
        setStore(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    productApi
      .getProductsByStoreId(storeId)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const dispatch = useDispatch();
  const handleAddToCartButton = (item) => {
    dispatch(addToCart(item));
    toastWrapper('Đã thêm vào giỏ hàng', 'success')
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
          <div className='d-flex justify-content-between my-3 align-items-end'>
            <h2 className='m-0'>Danh sách sản phẩm</h2>
          </div>
          <div className='d-flex flex-wrap w-100 mb-5 justify-content-between'>
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
