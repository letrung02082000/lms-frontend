import React, { useState } from "react";

import CouponAdminMange from "./CouponAdminManage";
import CouponAdminQR from "./CouponAdminQR";
import CouponAdminLogin from "./CouponAdminLogin";
import CouponAdminLayout from "./CouponAdminLayout";

//redux
import { useSelector, useDispatch } from "react-redux";
import { selectUser, logoutUser } from "store/userSlice";

import AccountApi from "api/accountApi";

function CouponAdminPage() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const [navigation, setNavigation] = useState("/admin");

  const onNavigate = (value) => {
    setNavigation(value);
  };

  const handleLogout = () => {
    const refreshToken = localStorage.getItem("user-jwt-rftk");

    AccountApi.logoutUser(refreshToken)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
    localStorage.removeItem("user-info");
    localStorage.removeItem("user-jwt-tk");
    localStorage.removeItem("user-jwt-rftk");
    dispatch(logoutUser());
  };

  if (
    user.isLoggedIn &&
    (user.data.role === 1 ||
      user.data.role === 10 ||
      user.data.role === 11 ||
      user.data.role === 12 ||
      user.data.role === 13)
  ) {
    return (
      <CouponAdminLayout onNavigate={onNavigate} onLogout={handleLogout}>
        {navigation === "/admin" ? <CouponAdminMange /> : null}
        {navigation === "/QR" ? <CouponAdminQR /> : null}
      </CouponAdminLayout>
    );
  }

  return <CouponAdminLogin />;
}

export default CouponAdminPage;