import React, { useEffect } from 'react';
import StoreSlider from '../components/StoreSlider';
import { Button, Col, Image, Row } from 'react-bootstrap';
import styled from 'styled-components';
import useMediaQuery from 'hooks/useMediaQuery';
import CartBar from '../components/CartBar';
import { ToastWrapper } from 'utils';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, selectCart } from 'store/cart';
import ProductItem from '../components/ProductItem';
import LocationSlider from '../components/LocationSlider';
import CategoryBar from '../components/CategoryBar';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import { Pagination, Scrollbar } from 'swiper';
import storeApi from 'api/storeApi';
import productApi from 'api/productApi';
import categoryApi from 'api/store/categoryApi';
import Loading from 'components/Loading';
import ServiceBar from '../components/ServiceBar';
import FilterSilder from '../components/FilterSilder';

function AppStorePage() {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [loading, setLoading] = React.useState(true);
  const [products, setProducts] = React.useState([]);
  const [productCategories, setProductCategories] = React.useState([]);
  const [storeCategories, setStoreCategories] = React.useState([]);
  const [productCategory, setProductCategory] = React.useState('');
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);
  const date = new Date().getHours();
  const welcomeMsg =
    date < 12
      ? 'Chào ngày mới, bạn đang cần gì?'
      : date < 18
      ? 'Chiều nay bạn cần gì?'
      : 'Chúc bạn buổi tối tốt lành!';

  useEffect(() => {
    if (productCategory) {
      productApi
        .getProductsByCategory(productCategory)
        .then((res) => {
          setProducts(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      productApi
        .getProducts()
        .then((res) => {
          setProducts(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [productCategory]);

  useEffect(() => {
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

    categoryApi
      .getProductCategories()
      .then((res) => {
        setProductCategories(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleAddToCartButton = (item) => {
    dispatch(addToCart(item));
    ToastWrapper('Đã thêm vào giỏ hàng', 'success');
  };

  return (
    <>
      {loading && <Loading />}
      <StyledLayout isDesktop={isDesktop}>
        <Swiper modules={[Pagination]} slidesPerView={1} loop={true}>
          <SwiperSlide>
            <Image
              src='https://istudentspace.sgp1.digitaloceanspaces.com/public/banner-2.jpg'
              fluid
              className='mt-3'
            />
          </SwiperSlide>
        </Swiper>
        <div className='d-flex justify-content-between my-4 align-items-end'>
          <h5 className='m-0'>{welcomeMsg}</h5>
        </div>
        {/* <div className='d-flex justify-content-between mt-4 mb-2 align-items-end'>
          <h2 className='m-0'>Dịch vụ sinh viên</h2>
        </div> */}
        <ServiceBar />
        <div className='d-flex justify-content-between mt-4 mb-2 align-items-end'>
          <h2 className='m-0'>Ưu đãi</h2>
        </div>
        <CategoryBar categories={storeCategories} />
        <StoreSlider />
        <LocationSlider />
        <div className='d-flex justify-content-between mt-4 mb-2 align-items-end'>
          <h2 className='m-0'>Sản phẩm nổi bật</h2>
        </div>
        <FilterSilder
          categories={storeCategories}
          setCategoryId={setProductCategory}
          categoryId={productCategory}
        />
        <div className='d-flex flex-wrap w-100 my-3 justify-content-between'>
          {products?.map((product) => {
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
          {products.length === 0 && (
            <p className='text-center w-100'>Không có sản phẩm nào</p>
          )}
        </div>
      </StyledLayout>
      {cart?.data?.length > 0 && <CartBar bottom={isDesktop ? 0 : 5} />}
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

export default AppStorePage;
