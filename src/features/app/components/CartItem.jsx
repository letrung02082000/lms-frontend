import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addToCart, deleteFromCart, removeFromCart } from 'store/cart';
import styled from 'styled-components';
import { formatCurrency } from 'utils/commonUtils';
import { CiCircleMinus, CiCirclePlus, CiSquareMinus, CiSquarePlus, CiTrash } from 'react-icons/ci';
import theme from 'constants/theme';

function CartItem(props) {
  const { idx, name, price, quantity } = props;
  const dispatch = useDispatch();

  const handleMinusButton = () => {
    if(quantity === 1) return;
    dispatch(removeFromCart(props));
  };

  const handleAddButton = () => {
    dispatch(addToCart(props));
  };

  const handleDeleteButton = () => {
    const confirm = window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?');
    if (confirm) dispatch(deleteFromCart(props));
  };

  return (
    <Styles>
      <Row className='product-line align-items-center'>
        <Col xs={1}>
          <div className='product-no'>{idx + 1}</div>
        </Col>
        <Col xs={6}>
          <div className='product-name'>{name}</div>
        </Col>
        <Col>
          <Row>
            <span>
              {formatCurrency(price)} ₫ x {quantity}
            </span>
          </Row>
          <Row className='align-items-center'>
            <Col xs={3}>
              <Button
                variant='white'
                className='p-0'
                onClick={handleMinusButton}
              >
                <CiSquareMinus color={theme.colors.teal} size={21}/>
              </Button>
            </Col>
            <Col xs={2}>
              <small>{quantity}</small>
            </Col>
            <Col xs={3}>
              <Button variant='white' className='p-0' onClick={handleAddButton}>
                <CiSquarePlus color={theme.colors.teal} size={21}/>
              </Button>
            </Col>
            <Col xs={4}>
              <Button variant='white' className='p-0' onClick={handleDeleteButton}>
                <CiTrash color={theme.colors.vividRed} size={21}/>
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Styles>
  );
}

export default CartItem;

const Styles = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
  padding: 0.5rem 0;
  .product-no {
    background-color: ${({ theme }) => theme.colors.teal};
    color: ${({ theme }) => theme.colors.white};
    border-radius: 50%;
    height: 1.3rem;
    width: 1.3rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .product-name {
    color: ${(props) => props.theme.colors.gray};
    padding: 0 0.5rem;
  }

  .bi-dash,
  .bi-plus {
    color: ${({ theme }) => theme.colors.blueGray};
    background-color: ${({ theme }) => theme.colors.lightGray};
    border-radius: 3px;
  }
`;
