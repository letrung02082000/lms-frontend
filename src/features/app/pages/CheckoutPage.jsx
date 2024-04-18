import React, { useEffect } from 'react';
import { Button, Col, Container, Form, Image, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Cart from '../components/Cart';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import orderApi from 'api/orderApi';
import { ToastWrapper } from 'utils';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart, selectCart } from 'store/cart';
import EmptyCartImage from 'assets/images/food/empty-cart.jpg'
import InputField from 'components/form/InputField';
import { PATH } from 'constants/path';

function CheckoutPage() {
  const SOURCES = {
    QR: 'qr',
    APP: 'app',
  }
  const { state } = useLocation();
  const [loading, setLoading] = React.useState(false);
  const order = JSON.parse(localStorage.getItem('order') || '{}');
  const navigate = useNavigate();
  const cart = useSelector(selectCart);
  const dispatch = useDispatch();
  const {
    control,
    setValue,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
    watch,
    setFocus,
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      formAddress: state?.address || order?.address || '',
      formName: state?.name || order?.name || '',
      formTel: state?.tel || order?.tel || '',
      formEmail: state?.email || order?.email || '',
      formNote: state?.note || '',
    },
    resolver: undefined,
    context: undefined,
    shouldFocusError: true,
    shouldUnregister: true,
    shouldUseNativeValidation: false,
    delayError: false,
  });

  const handleClearButton = (name) => {
    setValue(name, '');
    setFocus(name);
  };

  const onSubmit = async () => {
    setLoading(true);
    await handleSubmit((formData) => {
      const productByStoreId = {};
      cart?.data?.forEach((item) => {
        const currentStores = Object.keys(productByStoreId);

        if (!currentStores.includes(item?.store?._id)) {
          productByStoreId[item?.store?._id] = [item];
        } else {
          productByStoreId[item?.store?._id].push(item);
        }
      });

      const data = {
        address: formData.formAddress || 'Không có',
        name: formData.formName || 'Không có',
        tel: formData.formTel || 'Không có',
        email: formData.formEmail || 'Không có',
        note: formData.formNote || 'Không có',
        products: cart?.data || [],
        productByStoreId,
      };
      
      if (state?.src != SOURCES.QR) {
        localStorage.setItem('order', JSON.stringify(data));
      }
      
      orderApi
        .createOrder(data)
        .then((res) => {
          setLoading(false);
          dispatch(clearCart());
          navigate(PATH.APP.ORDER_SUCCESS);
        })
        .catch((err) => {
          setLoading(false);
          ToastWrapper('Không thể tạo đơn hàng', 'error');
        });
    }, () => {
      setLoading(false);
    })();
  };

  if(cart?.data?.length === 0) {
    return (
      <>
        <Row>
          <Col xs={12}>
            <h1 className='text-center my-5 fw-bold'>Giỏ hàng trống</h1>
          </Col>
        </Row>
        <Row>
          <div className='d-flex justify-content-center'>
            <Image src={EmptyCartImage} alt='empty-cart' height={200} />
          </div>
        </Row>
        <Row>
          <Col>
            <Button
              className='w-100 my-3 text-white'
              onClick={() => navigate(-1)}
            >
              Quay lại cửa hàng
            </Button>
            <Button
              className='w-100 mb-4'
              variant='outline-danger'
              onClick={() => navigate(PATH.APP.ORDER_HISTORY)}
            >
              Xem đơn hàng đã đặt
            </Button>
          </Col>
        </Row>
      </>
    );
  }

  return (
    <Styles>
      <Row>
        <Col xs={12} md={7}>
          <div className='cart-area'>
            <Row className='cart-body'>
              <Cart />
            </Row>
          </div>
        </Col>
        <Col xs={12} md={5}>
          <Row>
            <div className='checkout-title'>Thông tin đặt hàng</div>
          </Row>
          <Row className='mb-3'>
            <InputField
              onClear={handleClearButton}
              control={control}
              label='Địa chỉ'
              name='formAddress'
              hasAsterisk
              rules={{
                required: 'Vui lòng nhập trường này',
                minLength: {
                  value: 5,
                  message: 'Địa chỉ phải có ít nhất 5 ký tự',
                },
                maxLength: {
                  value: 100,
                  message: 'Địa chỉ không được vượt quá 100 ký tự',
                },
              }}
            />
          </Row>
          <Row className='mb-3'>
            <Col>
              <InputField
                onClear={handleClearButton}
                control={control}
                label='Họ tên'
                name='formName'
                hasAsterisk
                rules={{
                  required: 'Vui lòng nhập trường này',
                  minLength: {
                    value: 2,
                    message: 'Họ tên phải có ít nhất 2 ký tự',
                  },
                  maxLength: {
                    value: 50,
                    message: 'Họ tên không được vượt quá 50 ký tự',
                  },
                }}
              />
            </Col>
          </Row>
          <Row className='mb-3'>
            <Col>
              <InputField
                onClear={handleClearButton}
                control={control}
                label='Số điện thoại'
                name='formTel'
                hasAsterisk
                type='number'
                rules={{
                  required: 'Vui lòng nhập trường này',
                  minLength: {
                    value: 10,
                    message: 'Số điện thoại phải có 10 số',
                  },
                  maxLength: {
                    value: 10,
                    message: 'Số điện thoại phải có 10 số',
                  },
                }}
              />
            </Col>
          </Row>
          <Row>
            <InputField
              onClear={handleClearButton}
              control={control}
              label='Ghi chú đơn hàng (tuỳ chọn)'
              name='formNote'
              as='textarea'
              rows={5}
              rules={{
                required: false,
                minLength: {
                  value: 5,
                  message: 'Ghi chú phải có ít nhất 5 ký tự',
                },
                maxLength: {
                  value: 500,
                  message: 'Ghi chú không được vượt quá 500 ký tự',
                },
              }}
            />
          </Row>
          <Button
            className='w-100 my-3'
            onClick={onSubmit}
            variant='primary text-white'
            disabled={loading}
          >
            {loading ? 'Đang tạo đơn hàng của bạn...' : 'Đặt hàng'}
          </Button>
          <Button
            className='w-100 mb-4'
            variant='outline-danger'
            onClick={() => navigate(PATH.APP.ORDER_HISTORY)}
          >
            Xem đơn hàng đã đặt
          </Button>
        </Col>
      </Row>
    </Styles>
  );
}

export default CheckoutPage;

const Styles = styled.div`
  margin-bottom: 2rem;

  .checkout-title {
    margin: 1.5rem 0 1rem;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 1.2rem;
  }

  .product-area {
    margin-bottom: 15rem;
  }

  .cart-area {
    position: sticky;
    top: 0;
    height: 100vh;
  }

  .cart-body {
    height: 85%;
  }

  .cart-btn {
    height: 15%;
    align-items: center;
  }

  @media screen and (max-width: 768px) {
    .cart-area {
      height: 100%;
    }

    .cart-body {
      height: 100%;
    }
  }
`;
