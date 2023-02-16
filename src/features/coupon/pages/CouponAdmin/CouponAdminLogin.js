import React, { useState } from "react";
// import styles from "./drivingLogin.module.css";
import styled from "styled-components";

import { useNavigate, useLocation } from "react-router-dom";

import { IoMdClose } from "react-icons/io";
import { BiUser, BiLockAlt } from "react-icons/bi";

import { useDispatch } from "react-redux";
import { updateUser } from "store/userSlice";

import AccountApi from "api/accountApi";

const CouponAdminLogin = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLogging, setIsLogging] = useState(false);

  const goBack = () => {
    navigate(-1);
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
      setErrorMsg("Mật khẩu chỉ chứa chữ cái và số, độ dài: 8-30 ký tự");
    }
  };

  const handleLoginClick = async () => {
    setIsLogging(true);

    const user = {
      email: document.getElementById("formBasicEmail").value,
      password: document.getElementById("formBasicPassword").value,
    };

    try {
      const response = await AccountApi.loginAdminDriving(user);

      setIsLoggedIn(true);
      setIsLogging(false);

      const result = response.data;
      const userInfo = {
        id: result.id,
        email: result.email,
        avatarUrl: result.avatarUrl || "avatar-default.png",
        name: result.name,
        role: result.role,
      };

      localStorage.setItem("user-info", JSON.stringify(userInfo));
      localStorage.setItem("user-jwt-tk", result.accessToken);
      localStorage.setItem("user-jwt-rftk", result.refreshToken);

      dispatch(
        updateUser({
          isLoggedIn: true,
          data: userInfo,
        })
      );

      navigate("/coupon-admin");
    } catch (error) {
      const { status } = error.response;

      if (status === 400 || status === 401 || status === 403) {
        setErrorMsg("Email hoặc mật khẩu không đúng");
      } else {
        setErrorMsg("Không thể kết nối đến máy chủ. Vui lòng thử lại sau!");
      }
    }

    setIsLoggedIn(false);
    setIsLogging(false);
  };

  return (
    <Styled>
      <div className="loginContainer">
        <div className="header">
          <p>{location.state ? location.state.message : "Xin chào!"}</p>
          <IoMdClose
            size={25}
            color="white"
            onClick={goBack}
            style={{ cursor: "pointer" }}
          />
        </div>
        <form className="formContainer">
          <div>
            <label className="label" for="formBasicEmail">
              Email của bạn
            </label>
            <div className="inputContainer">
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
            <div className="inputContainer">
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
            <button
              className="loginBtn"
              type="button"
              onClick={handleLoginClick}
            >
              Đăng nhập
            </button>
          ) : (
            <button className="loginBtn" type="button">
              Đang đăng nhập...
            </button>
          )}
        </form>
      </div>
    </Styled>
  );
};

const Styled = styled.div`
  .loginContainer {
    width: 100%;
    min-height: 100vh;
    background-color: var(--primary);
  }

  .header {
    background-color: var(--primary);
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    height: 20vh;
  }

  .header p {
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--white);
    margin: 0;
  }

  .label {
    display: flex;
    align-items: center;
    color: var(--black);
    padding: 1rem;
  }

  .inputContainer {
    padding: 0 0.5rem;
    display: flex;
  }

  .input {
    border-width: 0px;
    width: 100%;
  }

  .formContainer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 25px;
    width: 90%;
    max-width: 25rem;
    min-height: 50vh;
    margin: 0 auto;
    padding: 1rem;
    background-color: var(--white);
  }

  .error {
    padding: 1rem;
  }

  .loginBtn {
    background-color: var(--primary);
    color: var(--white);
    font-weight: bold;
    padding: 0.6rem 1rem;
    width: 100%;
    border-width: 0;
    border-radius: 5px;
  }

  .signupBtn {
    background-color: var(--white);
    color: var(--primary);
    font-weight: bold;
    padding: 0.6rem 1rem;
    margin-top: 1rem;
    width: 100%;
    border: 1px solid var(--primary);
    border-radius: 5px;
  }

  .horizonContainer {
    display: flex;
    margin-top: 2rem;
    justify-content: space-around;
    align-items: center;
  }

  .horizonContainer hr {
    width: 35%;
  }

  .horizonContainer p {
    color: var(--light-gray);
  }
`;

export default CouponAdminLogin;
