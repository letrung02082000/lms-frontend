import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import CouponApi from "api/couponApi";

export function CouponScannedPage(props) {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const user = query.get("user");
  const coupon = query.get("coupon");
  const [msg, setMsg] = useState("");

  const handleConfirmButton = () => {
    CouponApi.getCouponUserUse(user, coupon)
      .then((res) => {
        if (res.status === 200) {
          setMsg("Sử dụng mã ưu đãi thành công <3");
        } else {
          setMsg("Không thể sử dụng mã ưu đãi này");
        }
      })
      .catch((error) => {
        console.log(error);
        setMsg(
          "Không thể sử dụng mã ưu đãi này. Lỗi: " + error.response.message
        );
      });
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <p style={{ margin: "1rem 0" }}>{msg}</p>
      <button onClick={handleConfirmButton} style={{ padding: "0.5rem 1rem" }}>
        Xác nhận
      </button>
    </div>
  );
}

export default CouponScannedPage;
