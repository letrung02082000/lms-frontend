import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GoogleLogin from "react-google-login";

import { IoMdClose } from "react-icons/io";
import { BiUser, BiLockAlt } from "react-icons/bi";

import styled from "styled-components";

//redux
import { useDispatch, useSelector } from "react-redux";
import { updateUser, selectUser } from "store/userSlice";

import AccountApi from "api/accountApi";
import { toastWrapper } from "utils";
import { PATH } from "constants/path";

export default function LoginPage(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);

  const dispatch = useDispatch();
  const clientId =
    "1068638586953-fgkf520a6sj0r4kv6epvmnppunfk2t1k.apps.googleusercontent.com";

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLogging, setIsLogging] = useState(false);

  const responseSuccessGoogle = (response) => {
    AccountApi.loginViaGoogle(response.tokenId)
      .then((response) => {
        console.log(response);

        if (response) {
          setIsLoggedIn(true);
          setIsLogging(false);

          const result = response;
          const userInfo = {
            id: result.id,
            email: result.email,
            avatarUrl: result.avatarUrl || "avatar-default.png",
            name: result.name,
          };

          console.log(result);

          localStorage.setItem("user-info", JSON.stringify(userInfo));
          localStorage.setItem("user-jwt-tk", result.accessToken);
          localStorage.setItem("user-jwt-rftk", result.refreshToken);
          localStorage.setItem("user-role", result.role);

          dispatch(
            updateUser({
              isLoggedIn: true,
              data: userInfo,
            })
          );
          navigate(-1);
        } else {
          setErrorMsg("Đăng nhập không thành công");
        }
      })
      .catch((err) => {
        console.log(err);
        setErrorMsg("Đăng nhập không thành công");
      });
  };

  const responseFailureGoogle = (response) => {
    console.log(response);
  };

  const goBack = () => {
    navigate(PATH.ACCOUNT);
  };

  const handleEmailChange = (event) => {
    const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;

    if (emailRegex.test(event.target.value)) {
      setEmail(event.target.value);
      setErrorMsg(null);
    } else {
      setErrorMsg("Email không hợp lệ");
    }
  };

  const handlePasswordChange = (event) => {
    const passwordRegex = /^.*(?=.{8,30})(?=.*\d)(?=.*[a-zA-Z]).*$/;

    if (passwordRegex.test(event.target.value)) {
      setPassword(event.target.value);
      setErrorMsg(null);
    } else {
      setErrorMsg("Mật khẩu phải bao gồm chữ cái và số, độ dài: 8-30 ký tự");
    }
  };

  const handleLoginClick = async (event) => {
    setIsLogging(true);

    const user = {
      email: document.getElementById("formBasicEmail").value,
      password: document.getElementById("formBasicPassword").value,
    };

    try {
      const response = await AccountApi.loginUser(user);

      setIsLoggedIn(true);
      setIsLogging(false);

      const userInfo = response.data;

      localStorage.setItem("user-jwt-tk", userInfo.accessToken);
      localStorage.setItem("user-jwt-rftk", userInfo.refreshToken);

      delete userInfo.accessToken;
      delete userInfo.refreshToken;
      localStorage.setItem("user-info", JSON.stringify(userInfo));
      localStorage.setItem("user-role", Number(userInfo.role) || 0);

      dispatch(
        updateUser({
          isLoggedIn: true,
          data: userInfo,
        })
      );
      navigate(-1);
    } catch (e) {
      console.log(e)
      toastWrapper(e?.response?.data?.message || 'Đăng nhập thất bại', 'error')
      setIsLoggedIn(false);
      setIsLogging(false);
    }
  };

  const handleSignUpClick = async (e) => {
    e.preventDefault();

    const user = {
      email: document.getElementById("formBasicEmail").value,
      password: document.getElementById("formBasicPassword").value,
    };

    const response = await AccountApi.signupUser(user);

    console.log(response);

    if (response.message === "success") {
      setErrorMsg("Đăng ký thành công! Đang đăng nhập lại...");
      try {
        const loginResponse = await AccountApi.loginUser(user);

        console.log(loginResponse);
        console.log(loginResponse.status);

        if (loginResponse.message === "Logined successfully") {
          const userInfo = loginResponse.data;

          localStorage.setItem("user-jwt-tk", userInfo.accessToken);
          localStorage.setItem("user-jwt-rftk", userInfo.refreshToken);

          delete userInfo.accessToken;
          delete userInfo.refreshToken;
          localStorage.setItem("user-info", JSON.stringify(userInfo));

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
      } catch (error) {
        console.log(error);
        const { status } = error.response;

        if (status === 400 || status === 401 || status === 403) {
          setErrorMsg("Email hoặc mật khẩu không đúng");
        } else {
          setErrorMsg("Không thể kết nối đến máy chủ. Vui lòng thử lại sau!");
        }
        setIsLoggedIn(false);
        setIsLogging(false);
      }
    }
  };

  return (
    <Styles>
      <div className="header">
        <p>{location.state ? location.state.message : "Xin chào!"}</p>
        <IoMdClose
          size={25}
          color="white"
          onClick={goBack}
          style={{ cursor: "pointer" }}
        />
      </div>
      <form className="form-container">
        <div>
          <label className="label" for="formBasicEmail">
            Email của bạn
          </label>
          <div className="input-container">
            <BiUser style={{ padding: "0.3rem" }} size={30} />
            <input
              id="formBasicEmail"
              type="email"
              placeholder="Nhập địa chỉ email"
              className="input"
              onChange={handleEmailChange}
            />
          </div>
        </div>
        <div>
          <label className="label" for="formBasicPassword">
            Mật khẩu
          </label>
          <div className="input-container">
            <BiLockAlt style={{ padding: "0.3rem" }} size={30} />
            <input
              id="formBasicPassword"
              type="password"
              placeholder="Nhập mật khẩu"
              className="input"
              onChange={handlePasswordChange}
            />
          </div>
        </div>
        <p className="error">{errorMsg}</p>
        {!isLogging ? (
          <>
            <button
              className="login-btn"
              type="button"
              onClick={handleLoginClick}
            >
              Đăng nhập
            </button>
            <button
              className="signup-btn"
              type="button"
              onClick={handleSignUpClick}
            >
              Đăng ký tài khoản
            </button>
          </>
        ) : (
          <button className="login-btn" type="button">
            Đang đăng nhập...
          </button>
        )}
        <div className="horizon-container">
          <hr />
          <span>hoặc</span>
          <hr />
        </div>
        <div className="google-login-btn d-flex flex-column justify-content-center align-items-center">
          <p style={{ textAlign: "center" }}>
            Vui lòng mở trình duyệt (Chrome, Firefox, Safari) và truy cập
            website isinhvien.vn để sử dụng tính năng này.
          </p>
          <GoogleLogin
            clientId={clientId}
            buttonText="Đăng nhập bằng Google"
            onSuccess={responseSuccessGoogle}
            onFailure={responseFailureGoogle}
            cookiePolicy={"single_host_origin"}
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
