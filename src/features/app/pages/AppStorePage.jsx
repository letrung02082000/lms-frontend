import React, { useEffect } from 'react';
import CategorySlider from '../components/CategorySlider';
import StoreSlider from '../components/StoreSlider';
import { Button, Col, Image, Row } from 'react-bootstrap';
import productApi from 'api/productApi';
import styled from 'styled-components';
import useMediaQuery from 'hooks/useMediaQuery';
import { BsCartPlus } from 'react-icons/bs';
import { formatCurrency } from 'utils/commonUtils';
import CartBar from '../components/CartBar';
import { ToastWrapper } from 'utils';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, selectCart } from 'store/cart';
import ProductItem from '../components/ProductItem';
import LocationSlider from '../components/LocationSlider';
import CategoryBar from '../components/CategoryBar';

function AppStorePage() {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [products, setProducts] = React.useState([]);
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);

  useEffect(() => {
    productApi
      .getProducts()
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleAddToCartButton = (item) => {
    dispatch(addToCart(item));
    ToastWrapper('Đã thêm vào giỏ hàng', 'success')
  }

  return (
    <>
      <StyledLayout isDesktop={isDesktop}>
        <CategoryBar />
        <StoreSlider />
        <LocationSlider />
        <div className='d-flex justify-content-between my-4 align-items-end'>
          <h2 className='m-0'>Sản phẩm nổi bật</h2>
        </div>
        <div className='d-flex flex-wrap w-100 mb-3 justify-content-between'>
          {products.map((product) => {
            return (
              <div
                key={product._id}
                className='product-item mb-3 d-flex flex-column justify-content-between'
              >
                <ProductItem product={product} handleAddToCartButton={handleAddToCartButton}/>
              </div>
            );
          })}
        </div>
      </StyledLayout>
      {
        cart?.data?.length > 0 && (
          <CartBar bottom={isDesktop ? 0 : 5} />
        )
      }
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
