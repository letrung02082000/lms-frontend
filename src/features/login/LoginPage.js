import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import GoogleLogin from 'react-google-login';

import { IoMdClose } from 'react-icons/io';
import { BiUser, BiLockAlt } from 'react-icons/bi';

import styled from 'styled-components';

//redux
import { useDispatch, useSelector } from 'react-redux';
import { updateUser, selectUser } from 'store/userSlice';

export default function LoginPage(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);

  const dispatch = useDispatch();
  const clientId =
    '1068638586953-fgkf520a6sj0r4kv6epvmnppunfk2t1k.apps.googleusercontent.com';

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLogging, setIsLogging] = useState(user.isLoggedIn);

  const responseSuccessGoogle = (response) => {
    console.log(response);
    axios
      .post('/api/user/google-login', { tokenId: response.tokenId })
      .then((response) => {
        if (response.status === 200) {
          setIsLoggedIn(true);
          setIsLogging(false);

          const result = response.data;
          const userInfo = {
            id: result.data.id,
            email: result.data.email,
            avatarUrl: result.data.avatarUrl || 'avatar-default.png',
            name: result.data.name,
          };

          console.log(result);

          localStorage.setItem('user-info', JSON.stringify(userInfo));
          localStorage.setItem('user-jwt-tk', result.data.accessToken);
          localStorage.setItem('user-jwt-rftk', result.data.refreshToken);

          dispatch(
            updateUser({
              isLoggedIn: true,
              data: userInfo,
            })
          );
          navigate(-1);
        } else {
          setErrorMsg('Đăng nhập không thành công');
        }
      })
      .catch((err) => {
        console.log(err);
        setErrorMsg('Đăng nhập không thành công');
      });
  };

  const responseFailureGoogle = (response) => {
    console.log(response);
  };

  const goBack = () => {
    navigate(-1);
  };

  const handleEmailChange = (event) => {
    const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;

    if (emailRegex.test(event.target.value)) {
      setEmail(event.target.value);
      setErrorMsg(null);
    } else {
      setErrorMsg('Email không hợp lệ');
    }
  };

  const handlePasswordChange = (event) => {
    const passwordRegex = /^.*(?=.{8,30})(?=.*\d)(?=.*[a-zA-Z]).*$/;

    if (passwordRegex.test(event.target.value)) {
      setPassword(event.target.value);
      setErrorMsg(null);
    } else {
      setErrorMsg('Mật khẩu phải bao gồm chữ cái và số, độ dài: 8-30 ký tự');
    }
  };

  const handleLoginClick = async (event) => {
    setIsLogging(true);

    const user = {
      email: document.getElementById('formBasicEmail').value,
      password: document.getElementById('formBasicPassword').value,
    };

    try {
      const response = await axios.post('/api/user/login', user);

      if (response.status === 200) {
        setIsLoggedIn(true);
        setIsLogging(false);

        const result = response.data;
        const userInfo = result.data;

        localStorage.setItem('user-jwt-tk', result.data.accessToken);
        localStorage.setItem('user-jwt-rftk', result.data.refreshToken);

        delete userInfo.accessToken;
        delete userInfo.refreshToken;
        localStorage.setItem('user-info', JSON.stringify(userInfo));

        dispatch(
          updateUser({
            isLoggedIn: true,
            data: userInfo,
          })
        );
        navigate(-1);
      }
    } catch (error) {
      console.log(error);
      if (
        error.response &&
        (error.response.status === 400 ||
          error.response.status === 401 ||
          error.response.status === 404)
      ) {
        setErrorMsg('Email hoặc mật khẩu không đúng');
      } else {
        setErrorMsg('Không thể kết nối đến máy chủ. Vui lòng thử lại sau!');
      }

      setIsLoggedIn(false);
      setIsLogging(false);
    }
  };

  const handleSignUpClick = async (e) => {
    e.preventDefault();

    const user = {
      email: document.getElementById('formBasicEmail').value,
      password: document.getElementById('formBasicPassword').value,
    };

    try {
      const response = await axios.post('/api/user/signup', user);

      if (response.status === 201) {
        setErrorMsg('Đăng ký thành công! Đang đăng nhập lại...');

        const loginResponse = await axios.post('/api/user/login', user);

        if (loginResponse.status === 200) {
          const result = loginResponse.data;
          const userInfo = result.data;

          localStorage.setItem('user-jwt-tk', result.data.accessToken);
          localStorage.setItem('user-jwt-rftk', result.data.refreshToken);

          delete userInfo.accessToken;
          delete userInfo.refreshToken;
          localStorage.setItem('user-info', JSON.stringify(userInfo));

          dispatch(
            updateUser({
              isLoggedIn: true,
              data: userInfo,
            })
          );

          setTimeout(() => {
            navigate(-1);
          }, 1000);
        }
      }
    } catch (error) {
      console.log(error.response);

      if (error.response.status == 400 && error.response.data.errorCode == 0) {
        setErrorMsg(
          'Địa chỉ email đã tồn tại. Vui lòng liên hệ admin để khôi phục lại mật khẩu'
        );
      } else if (
        error.response.status == 400 &&
        error.response.data.errorCode == 1
      ) {
        setErrorMsg('Mật khẩu phải bao gồm chữ cái và số, độ dài: 8-30 ký tự');
      }
    }
  };

  return (
    <Styles>
      <div className='header'>
        <p>{location.state ? location.state.message : 'Xin chào!'}</p>
        <IoMdClose
          size={25}
          color='white'
          onClick={goBack}
          style={{ cursor: 'pointer' }}
        />
      </div>
      <form className='form-container'>
        <div>
          <label className='label' for='formBasicEmail'>
            Email của bạn
          </label>
          <div className='input-container'>
            <BiUser style={{ padding: '0.3rem' }} size={30} />
            <input
              id='formBasicEmail'
              type='email'
              placeholder='Nhập địa chỉ email'
              className='input'
              onChange={handleEmailChange}
            />
          </div>
        </div>
        <div>
          <label className='label' for='formBasicPassword'>
            Mật khẩu
          </label>
          <div className='input-container'>
            <BiLockAlt style={{ padding: '0.3rem' }} size={30} />
            <input
              id='formBasicPassword'
              type='password'
              placeholder='Nhập mật khẩu'
              className='input'
              onChange={handlePasswordChange}
            />
          </div>
        </div>
        <p className='error'>{errorMsg}</p>
        {!isLogging ? (
          <>
            <button
              className='login-btn'
              type='button'
              onClick={handleLoginClick}
            >
              Đăng nhập
            </button>
            <button
              className='signup-btn'
              type='button'
              onClick={handleSignUpClick}
            >
              Đăng ký tài khoản
            </button>
          </>
        ) : (
          <button className='login-btn' type='button'>
            Đang đăng nhập...
          </button>
        )}
        <div className='horizon-container'>
          <hr />
          <span>hoặc</span>
          <hr />
        </div>
        <div className='google-login-btn d-flex flex-column justify-content-center align-items-center'>
          <p style={{ textAlign: 'center' }}>
            Vui lòng mở trình duyệt (Chrome, Firefox, Safari) và truy cập
            website isinhvien.vn để sử dụng tính năng này.
          </p>
          <GoogleLogin
            clientId={clientId}
            buttonText='Đăng nhập bằng Google'
            onSuccess={responseSuccessGoogle}
            onFailure={responseFailureGoogle}
            cookiePolicy={'single_host_origin'}
          />
        </div>
      </form>
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

  .label {
    display: flex;
    align-items: center;
    color: var(--black);
    padding: 1rem;
  }

  .input-container {
    padding: 0 0.5rem;
    display: flex;
  }

  .input {
    border-width: 0px;
    width: 100%;
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

  .error {
    padding: 1rem;
  }

  .login-btn {
    background-color: var(--primary);
    color: var(--white);
    font-weight: bold;
    padding: 0.6rem 1rem;
    width: 100%;
    border-width: 0;
    border-radius: 5px;
  }

  .signup-btn {
    background-color: var(--white);
    color: var(--primary);
    font-weight: bold;
    padding: 0.6rem 1rem;
    margin-top: 1rem;
    width: 100%;
    border: 1px solid var(--primary);
    border-radius: 5px;
  }

  .horizon-container {
    display: flex;
    margin-top: 2rem;
    justify-content: space-around;
    align-items: center;

    hr {
      width: 35%;
    }

    p {
      color: var(--light-gray);
    }
  }

  .google-login-btn {
    padding: 2rem 0 7rem;
  }

  @media screen and (min-width: 768px) {
    padding-bottom: 5rem;

    .header {
      height: 10vh;
    }

    .form-container {
      border-radius: 25px;
    }

    .google-login-btn {
      padding: 1rem 0;
    }
  }
`;
