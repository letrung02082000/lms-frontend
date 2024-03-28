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
import { useDispatch } from 'react-redux';
import { addToCart } from 'store/cart';

function AppStorePage() {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [products, setProducts] = React.useState([]);
  const dispatch = useDispatch();

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
        <CategorySlider />
        <StoreSlider />
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
                <div>
                  <div className='w-100 mb-2'>
                    <Image src={product.image} className='w-100 rounded' />
                  </div>
                  <h6>{product.name}</h6>
                </div>
                <Row>
                  <Col xs={4}>
                    <Button
                      variant='outline-danger'
                      className='cart-btn'
                      onClick={() => handleAddToCartButton(product)}
                    >
                      <BsCartPlus color='red' />
                    </Button>
                  </Col>
                  <Col xs={8} className='align-self-center'>
                    <span className='text-danger'>
                      {formatCurrency(product.price)} đ
                    </span>
                  </Col>
                </Row>
              </div>
            );
          })}
        </div>
      </StyledLayout>
      <CartBar bottom={5} />
    </>
  );
}

const StyledLayout = styled.div`
  margin: ${(props) => (props.isDesktop === true ? '0 15%' : '0 5%')};
  margin-bottom: 10rem;

  .product-item {
    width: ${(props) => (props.isDesktop === true ? '20%' : '45%')};
  }

  .cart-btn:hover svg {
    color: white !important;
  }
`;

export default AppStorePage;
