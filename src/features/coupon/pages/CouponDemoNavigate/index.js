import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import couponApi from "api/couponApi";
import { toastWrapper } from "utils";

const extractCoupon = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const couponId = urlParams.get("couponId");
  return couponId;
};

const CouponDemoNavigate = () => {
  const couponId = extractCoupon();
  const currentUser = useSelector((state) => state.user || {});
  const currentUserId = currentUser.data._id || "";

  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const checkCouponValid = async ({ couponId }) => {
      const isValid = await couponApi
        .getCouponUserCheck(couponId)
        .then((res) => {
          return !res.data.isUsed;
        })
        .catch((err) => {
          let errMessage = err.response.data.message || "Lỗi không xác định";

          switch (errMessage) {
            case "coupon user not found":
              errMessage = "Người dùng chưa lưu mã giảm giá này.";
              break;
            default:
              break;
          }

          toastWrapper(`Đã có lỗi xảy ra! ${errMessage}`, "error", {
            position: "bottom-right",
          });
          return false;
        });
      return isValid;
    };

    checkCouponValid({ couponId }).then((isValid) => setIsValid(isValid));
  }, [couponId]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <p>
        <strong>Coupon id is: </strong>
        {couponId ? couponId : "No coupon id found"}
      </p>

      <p>
        <strong>User id is: </strong>
        {currentUserId ? currentUserId : "No user id found"}
      </p>

      <p>
        <strong>Does this user have the right to use coupon?: </strong>
        {isValid ? "Yes" : "No"}
      </p>
    </div>
  );
};

export default CouponDemoNavigate;