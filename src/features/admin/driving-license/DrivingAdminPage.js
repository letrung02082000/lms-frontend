import React, { useState } from "react";

import DrivingAdminLayout from "components/layouts/DrivingAdminLayout";
import A1Driving from "./A1Driving";
import DrivingDate from "./DrivingDate";
import A2Driving from "./A2Driving";
import B2Driving from "./B2Driving";

//redux
import { useDispatch } from "react-redux";
import { logoutUser } from "store/userSlice";

import AccountApi from "api/accountApi";

function DrivingAdminPage() {
  const dispatch = useDispatch();

  const [navigation, setNavigation] = useState("/all");

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
    window.location.reload();
  };

  return (
    <DrivingAdminLayout onNavigate={onNavigate} onLogout={handleLogout}>
      {navigation === "/a1" ? <A1Driving /> : null}
      {navigation === "/a2" ? <A2Driving /> : null}
      {navigation === "/b2" ? <B2Driving /> : null}
      {navigation === "/date" ? <DrivingDate /> : null}
    </DrivingAdminLayout>
  );
}

export default DrivingAdminPage;
