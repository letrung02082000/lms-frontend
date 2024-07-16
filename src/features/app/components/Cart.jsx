import React, { useEffect, useMemo, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import CartItem from './CartItem';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { selectCart } from 'store/cart';
import { formatCurrency } from 'utils/commonUtils';
import { useLocation } from 'react-router-dom';
import { couponUnit } from 'constants/coupon';
import { MdDiscount } from 'react-icons/md';

function Cart({ couponByStoreId, setCouponByStoreId }) {
  const cart = useSelector(selectCart);
  const location = useLocation();
  const [coupons, setCoupons] = useState(
    location?.state?.coupon ? [location?.state?.coupon] : []
  );
  const [discount, setDiscount] = useState({});
  const total = cart?.data?.reduce(
    (acc, cur) => acc + cur.price * cur.quantity,
    0
  );

  const productByStoreId = useMemo(() => {
    const productByStoreId = {};
    cart?.data?.forEach((item) => {
      const currentStores = Object.keys(productByStoreId);

      if (!currentStores.includes(item?.store?._id)) {
        productByStoreId[item?.store?._id] = [item];
      } else {
        productByStoreId[item?.store?._id].push(item);
      }
    });
    return productByStoreId;
  }, [cart]);

  useEffect(() => {
    Object.keys(productByStoreId).map((storeId) => {
      const storeCoupon = couponByStoreId[storeId];
      const storeTotal = productByStoreId[storeId].reduce(
        (acc, cur) => acc + cur.price * cur.quantity,
        0
      );

      let msg = '',
        valid = false;

      if (storeCoupon?._id) {
        if (storeCoupon?.amount) {
          msg = `Giảm ${storeCoupon?.amount}${
            storeCoupon?.unit === couponUnit.PERCENT ? '%' : 'đ'
          } cho đơn cửa hàng từ ${formatCurrency(storeCoupon?.minValue)}đ. `;
        }

        if (storeCoupon?.minValue > storeTotal) {
          msg = `Đơn cửa hàng phải từ ${formatCurrency(
            storeCoupon?.minValue
          )}đ trở lên để sử dụng mã ${storeCoupon?.code}.`;
        }

        if (!storeCoupon?.available) {
          msg = `Mã ${storeCoupon?.code} không hợp lệ`;
        }

        if (new Date(storeCoupon?.validFrom) > Date.now()) {
          msg = `Mã ${storeCoupon?.code} chưa có hiệu lực`;
        }

        if (new Date(storeCoupon?.validUntil) < Date.now()) {
          msg = `Mã ${storeCoupon?.code} đã hết hạn`;
        }

        if (
          storeCoupon?.amount &&
          storeCoupon?.minValue <= storeTotal &&
          storeCoupon?.available &&
          new Date(storeCoupon?.validFrom) <= Date.now() &&
          new Date(storeCoupon?.validUntil) >= Date.now()
        ) {
          valid = true;
        }

        setDiscount((prev) => ({
          ...prev,
          [storeId]: {
            value:
              storeCoupon?.unit === couponUnit.PERCENT
                ? (storeCoupon?.amount * storeTotal) / 100
                : storeCoupon?.amount,
            msg,
            valid,
          },
        }));
      }
    });
  }, [productByStoreId, cart, couponByStoreId]);

  const totalDiscount = Object.keys(discount).reduce(
    (acc, cur) => (acc + discount[cur]?.valid ? discount[cur]?.value : 0),
    0
  );

  useEffect(() => {
    coupons.map((coupon) => {
      const storeId = coupon?.store?._id;
      setCouponByStoreId((prev) => ({
        ...prev,
        [storeId]: coupon,
      }));
    });
  }, [coupons?.length, cart]);

  const handleUpdateCouponButton = () => {
    console.log('update coupon');
  };

  return (
    <Styles>
      <Row>
        <Col>
          {productByStoreId &&
            Object.keys(productByStoreId).map((storeId) => {
              const couponByStore = couponByStoreId[storeId];
              return (
                <div key={storeId}>
                  <h5 className='mt-3 mb-0'>
                    {productByStoreId[storeId][0]?.store?.name}
                  </h5>
                  {couponByStore ? (
                    <>
                      <small className='text-primary'>
                        <MdDiscount /> {discount[storeId]?.msg}
                      </small>
                      <small
                        className='text-primary fw-bold'
                        onClick={handleUpdateCouponButton}
                      >
                        {' '}Cập nhật
                      </small>
                    </>
                  ) : (
                    <>
                      <small className='text-primary'>
                        Bạn có mã giảm giá?{' '}
                      </small>
                      <small
                        className='text-primary fw-bold'
                        onClick={handleUpdateCouponButton}
                      >
                        Nhập mã ngay
                      </small>
                    </>
                  )}
                  {productByStoreId[storeId].map((product, idx) => (
                    <CartItem key={product?._id} {...product} idx={idx} />
                  ))}
                </div>
              );
            })}
        </Col>
      </Row>

      <Row className='my-2'>
        <Col>
          <Row>
            <Col xs={7}>
              <div>Giảm giá</div>
            </Col>
            <Col xs={5}>
              <p className='text-end w-100 p-0 m-0'>
                - {formatCurrency(totalDiscount)} ₫
              </p>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row className='my-2'>
        <Col xs={7}>
          <div>Tổng cộng</div>
        </Col>
        <Col xs={5}>
          <div>
            <p className='fw-bold text-end w-100 p-0 m-0'>{formatCurrency(total - totalDiscount)} ₫</p>
          </div>
        </Col>
      </Row>

      {/* <Row>
        <Col>
          <p className='text-primary'>
            Bạn sẽ có{' '}
            <strong>
              {formatCurrency(Math.floor((total - discount) / 1000))}
            </strong>{' '}
            điểm tích luỹ theo số điện thoại đặt hàng khi đơn hàng hoàn tất.
          </p>
        </Col>
      </Row> */}
    </Styles>
  );
}

export default Cart;

const Styles = styled.div`
  border: ${(props) => `1px solid ${props.theme.colors.teal}`};
  height: 100%;
  border-radius: 0.5rem;

  .cart-title {
    height: 10%;
    padding: 0.5rem;
    text-transform: uppercase;
    color: ${(props) => props.theme.colors.gray};
    font-weight: bold;
    border-bottom: ${(props) => `1px solid ${props.theme.colors.gainsboro}`};
  }

  .cart-footer {
    max-height: 10%;
  }

  .product-list {
    max-height: 80%;
    overflow-y: scroll;
    overflow-x: hidden;
    /* border-bottom: ${(props) =>
      `1px solid ${props.theme.colors.gainsboro}`}; */
  }
`;
