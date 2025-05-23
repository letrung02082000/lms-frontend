import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import MainLayout from "../../layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateUser, selectUser } from "../../store/userSlice";

import AccountApi from "api/accountApi";

const SignUpPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignUpClick = async (e) => {
    e.preventDefault();

    const user = {
      email: document.getElementById("formBasicEmail").value,
      password: document.getElementById("formBasicPassword").value,
    };

    try {
      const response = await AccountApi.signupUser(user);

      if (response.status === 201) {
        setErrorMsg("Đăng ký thành công! Đang đăng nhập lại...");

        const loginResponse = await AccountApi.loginUser(user);

        if (loginResponse.status === 200) {
          const result = loginResponse.data;
          const userInfo = {
            id: result.id,
            email: result.email,
          };

          localStorage.setItem("user-info", JSON.stringify(userInfo));
          localStorage.setItem(
            "user-jwt-tk",
            JSON.stringify(result.accessToken)
          );
          localStorage.setItem(
            "user-jwt-rftk",
            JSON.stringify(result.refreshToken)
          );

          dispatch(
            updateUser({
              isLoggedIn: true,
              data: userInfo,
            })
          );
          navigate("/profile");
        }
      }
    } catch (error) {
      console.log(error.response);

      if (error.response.status == 400) {
        setErrorMsg(
          "Địa chỉ email đã đăng ký. Nếu bạn không nhớ mật khẩu, vui lòng khôi phục lại"
        );
      }
    }
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
    const passwordRegex = /^[a-zA-Z0-9]{3,30}$/;

    if (passwordRegex.test(event.target.value)) {
      setPassword(event.target.value);
      setErrorMsg(null);
    } else {
      setErrorMsg("Mật khẩu chỉ chứa chữ cái và số, độ dài: 3-30 ký tự");
    }
  };

  return (
    <MainLayout>
      <div className={styles.signUpContainer}>
        <h1>Đăng ký</h1>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder=""
              onChange={handleEmailChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control
              type="password"
              placeholder=""
              onChange={handlePasswordChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit" onClick={handleSignUpClick}>
            Tạo tài khoản
          </Button>
        </Form>
        <Form.Text>{errorMsg}</Form.Text>
      </div>
    </MainLayout>
  );
};

export default SignUpPage;
