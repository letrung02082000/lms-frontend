import React from "react";
import { useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import styled from "styled-components";
import { PATH } from "constants/path";
import { Button, Form } from "react-bootstrap";
import InputField from "components/form/InputField";
import { useForm } from "react-hook-form";
import accountApi from "api/accountApi";
import { toastWrapper } from "utils";

export default function LoginPage() {
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

  const handleOtpButtonClick = async () => {
    await handleSubmit((data) => {
      if (data?.zalo[0] !== '0') {
        return setError('zalo', {
          type: 'manual',
          message: 'Số điện thoại phải bắt đầu bằng 0',
        })
      }

      if (data?.zalo.length !== 10) {
        return setError('zalo', {
          type: 'manual',
          message: 'Số điện thoại phải có 10 chữ số',
        })
      }

      accountApi.sendOtp(data.zalo).then((res) => {
        toastWrapper(res?.message, 'success');
        navigate(PATH.AUTH.OTP, { state: { zalo: data.zalo } });
      }).catch((err) => {
        toastWrapper(err?.response?.data?.message, 'error');
      });
    })();
  };


  return (
    <Styles>
      <div className="header">
        <p>Xin chào!</p>
        <IoMdClose
          size={25}
          color="white"
          onClick={goBack}
          style={{ cursor: "pointer" }}
        />
      </div>
      <Form className="form-container">
        <Form.Label for="formZalo" className="my-3 h2">
          Đăng ký/Đăng nhập với số điện thoại
        </Form.Label>
        <InputField
          control={control}
          name='zalo'
          type='number'
          rules={{
            maxLength: {
              value: 10,
              message: 'Số điện thoại phải có 10 chữ số',
            },
            minLength: {
              value: 10,
              message: 'Số điện thoại phải có 10 chữ số',
            },
            required: 'Vui lòng nhập trường này',
          }}
          onClear={() => setValue('zalo', '')}
        />
        <Button
          onClick={handleOtpButtonClick}
          className="text-white w-100 fw-bold mt-3 mb-2"
          disabled={isSubmitting}
        >
          Gửi mã OTP qua Zalo
        </Button>
        <Form.Text className="text-center">Mã OTP sẽ được gửi qua ứng dụng Zalo đăng ký bằng số điện thoại của bạn.</Form.Text>
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
