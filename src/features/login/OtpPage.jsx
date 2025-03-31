import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoMdClose } from 'react-icons/io';
import styled from 'styled-components';
import { PATH } from 'constants/path';
import { Button, Form } from 'react-bootstrap';
import InputField from 'components/form/InputField';
import { useForm } from 'react-hook-form';
import accountApi from 'api/accountApi';
import { toastWrapper } from 'utils';
import { updateUser } from 'store/userSlice';
import { useDispatch } from 'react-redux';
import { formatPhoneNumber } from 'utils/commonUtils';

export default function OtpPage() {
  const [loading, setLoading] = React.useState(false);
  const { state } = useLocation();
  const zalo = state?.zalo || '';
  const dispatch = useDispatch();
  const {
    control,
    setValue,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: undefined,
    context: undefined,
    shouldFocusError: true,
    shouldUnregister: true,
    shouldUseNativeValidation: false,
    delayError: false,
  });
  const navigate = useNavigate();

  const goBack = () => {
    navigate(PATH.ACCOUNT);
  };

  const handleVerifyButtonClick = async () => {
    setLoading(true);
    await handleSubmit((data) => {
      accountApi
        .verifyOtp(zalo, data.otp)
        .then((res) => {
          toastWrapper('Xác thực thành công', 'success');
          localStorage.setItem('user-jwt-tk', res?.data?.token);
          localStorage.setItem('user-jwt-rftk', res?.data?.refreshToken);
          localStorage.setItem(
            'user-info',
            JSON.stringify({
              zalo: res?.data?.zalo,
              role: res?.data?.role,
              store: res?.data?.store,
              source: res?.data?.source,
              center: res?.data?.center,
            })
          );
          dispatch(updateUser({ isLoggedIn: true, data: { zalo: data.zalo } }));
          window.location.href = state.from;
        })
        .catch((err) => {
          toastWrapper(err?.response?.data?.message, 'error');
        }).finally(() => {
            setLoading(false);
        });
    })();
  };

  return (
    <Styles>
      <div className='header'>
        <p>Xin chào!</p>
        <IoMdClose
          size={25}
          color='white'
          onClick={goBack}
          style={{ cursor: 'pointer' }}
        />
      </div>
      <Form className='form-container'>
        <Form.Label for='formZalo' className='my-3 h2'>
          Xác thực OTP
        </Form.Label>
        <InputField
          control={control}
          name='otp'
          type='number'
          rules={{
            maxLength: {
              value: 6,
              message: 'Mã OTP phải có 6 chữ số',
            },
            minLength: {
              value: 6,
              message: 'Mã OTP phải có 6 chữ số',
            },
            required: 'Vui lòng nhập trường này',
          }}
          onClear={() => setValue('otp', '')}
        />
        <Button
          variant='outline-primary'
          disabled={loading}
          onClick={handleVerifyButtonClick}
          className='w-100 fw-bold mt-3 mb-2'
        >
          Xác nhận mã OTP
        </Button>
        <Form.Text className='text-center'>
          Nhập mã OTP gồm 6 chữ số được gửi qua ứng dụng Zalo đăng ký bằng
          số điện thoại {formatPhoneNumber(zalo)}.
        </Form.Text>
      </Form>
    </Styles>
  );
}

const Styles = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: var(--primary);

  .header {
    background-color: var(--primary);
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    height: 20vh;

    p {
      font-size: 1.2rem;
      font-weight: bold;
      color: var(--white);
      margin: 0;
    }
  }

  .form-container {
    border-radius: 25px 25px 0 0;
    width: 100%;
    max-width: 50rem;
    min-height: 80vh;
    margin: 0 auto;
    padding: 1rem;
    background-color: var(--white);
  }
`;
