import React from "react";

import PropTypes from "prop-types";
import QRCode from "react-qr-code";
import { toastWrapper } from "utils";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";

import CouponApi from "api/couponApi";

const logoVoucher = "/logo5.png";

const CouponQR = ({ couponId, couponUse, currentUser }) => {
  const isLoggedIn = currentUser.isLoggedIn || false;
  const userId = currentUser.data.id || "";
  const isUseQR = couponUse === "QR";

  const QRValue = JSON.stringify({ couponId, userId });

  console.log("QRValue: ", QRValue, isLoggedIn, isUseQR);

  return isLoggedIn && isUseQR ? (
    <Styled>
      <QRCode
        style={{
          height: "auto",
          maxWidth: "100%",
          width: "100%",
          padding: "1rem",
        }}
        value={QRValue}
      />
    </Styled>
  ) : null;
};
CouponQR.propTypes = {
  couponId: PropTypes.string.isRequired,
  currentUser: PropTypes.object.isRequired,
  couponUse: PropTypes.string,
};

const CouponDetailModal = ({
  coupon,
  showCouponDetail,
  setShowCouponDetail,
}) => {
  const currentUser = useSelector((state) => state.user || {});

  const handleSaveCoupon = () => {
    navigator.clipboard.writeText(coupon.couponCode);
    toastWrapper(
      <span>
        Đã lưu <span style={{ fontWeight: "600" }}>{coupon.couponCode}</span>{" "}
        vào clipboard!
      </span>,
      "success",
      {
        position: "bottom-right",
      }
    );

    CouponApi.postCouponUserSave({ coupon: coupon._id })
      .then(() => {
        toastWrapper("Đã lưu mã giảm giá vào Coupon của tôi", "success", {
          position: "bottom-right",
        });
        setShowCouponDetail(false);
      })
      .catch((err) => {
        let errMessage = err.response.data.message || "Lỗi không xác định";

        switch (errMessage) {
          case "coupon user existed":
            // errMessage = "Mã giảm giá đã được lưu";
            return;
          case "coupon is expired":
            errMessage = "Mã giảm giá đã hết hạn";
            break;
          case "no coupon":
            errMessage = "Mã giảm giá không tồn tại";
            break;
          default:
            break;
        }

        toastWrapper(
          `Đã có lỗi xảy ra khi thêm vào Coupon của tôi: ${errMessage}`,
          "error",
          {
            position: "bottom-right",
          }
        );
      });
  };

  const handleUseCoupon = ({ coupon }) => {
    const extractNavigatePath = (data) => {
      const regex = /\(([^)]+)\)/;
      const match = regex.exec(data);
      const path = match[1];

      return path;
    };

    const navigatePath =
      extractNavigatePath(coupon.useCoupon) + `?couponId=${coupon._id}`;

    if (navigatePath) {
      window.location.replace(navigatePath);
    } else {
      toastWrapper("Đã có lỗi xảy ra khi sử dụng mã giảm giá này", "error", {
        position: "bottom-right",
      });
    }
  };

  const checkCouponValid = (coupon) => {
    if (!currentUser.isLoggedIn) return false;
    if (coupon.useCoupon === "QR") return false;

    return true;
  };

  return (
    <Modal
      show={showCouponDetail}
      onHide={() => setShowCouponDetail(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{coupon.couponCode || ""}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Styled>
          <div className="modalTitle">{coupon.couponCode || ""}</div>
          <div className="modalImage">
            <img src={logoVoucher} alt={`Coupon ${coupon.couponCode}`} />
          </div>
          <div className="modalDescription">
            Thanh toán hoá đơn giảm{" "}
            {(coupon.unit === 0 ? `${coupon.value}%` : `${coupon.value}k`) ||
              ""}
            {currentUser.isLoggedIn ? null : (
              <div className="modalDescription">
                <span style={{ color: "red" }}>
                  Bạn cần đăng nhập để sử dụng mã này
                </span>
              </div>
            )}
          </div>
          <CouponQR
            couponId={coupon._id}
            couponUse={coupon.useCoupon}
            currentUser={currentUser}
          />
        </Styled>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn btn-outline-primary"
          onClick={() => setShowCouponDetail(false)}
        >
          Đóng
        </button>
        <button
          className={`btn ${
            checkCouponValid(coupon) ? "btn-outline-primary" : "btn-primary"
          }`}
          onClick={handleSaveCoupon}
        >
          Lưu / Sao chép mã
        </button>
        {checkCouponValid(coupon) ? (
          <button
            className="btn btn-primary"
            onClick={() => handleUseCoupon({ coupon })}
          >
            Sử dụng
          </button>
        ) : null}
      </Modal.Footer>
    </Modal>
  );
};

CouponDetailModal.propTypes = {
  coupon: PropTypes.object.isRequired,
  showCouponDetail: PropTypes.bool,
  setShowCouponDetail: PropTypes.func,
};

const Styled = styled.div`
  .modalTitle {
    font-size: 1.5rem;
    font-weight: 600;
    text-align: center;
  }

  .modalImage img {
    width: 100%;
    padding: 1rem;
  }

  .modalDescription {
    text-align: center;
    margin-bottom: 1rem;
  }
`;

export default CouponDetailModal;
