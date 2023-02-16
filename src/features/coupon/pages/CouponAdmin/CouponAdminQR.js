import React, { useState, useEffect } from "react";
import { QrReader } from "react-qr-reader";
import Button from "react-bootstrap/Button";
import { toastWrapper } from "utils";

import couponApi from "api/couponApi";

const handleUseCoupon = async (couponId, userId) => {
  // await couponApi.getCouponUserUse(couponId, userId);

  couponApi
    .getCouponUserUse(couponId, userId)
    .then(() => {
      toastWrapper("success", "Sử dụng mã thành công");
    })
    .catch((err) => {
      const errMessage = err.response.data.message;
      toastWrapper("error", errMessage);
    });

  // window.location.reload();
};

const handleCancel = () => {
  window.location.reload();
};

const UseCoupon = ({ couponId, userId }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <h2>Quét mã thành công 🎉</h2>
      <h3 style={{ textAlign: "center" }}>
        Bạn có muốn sử dụng mã {couponId} cho {userId} không?
      </h3>
      <Button
        variant="primary"
        onClick={() => handleUseCoupon(couponId, userId)}
      >
        Sử dụng
      </Button>
      <Button variant="danger" onClick={() => handleCancel()}>
        Hủy
      </Button>
    </div>
  );
};

const CouponAdmin = () => {
  const [dataQR, setQRData] = useState("No result");
  const [validQR, setValidQR] = useState(false);

  useEffect(() => {
    if (dataQR !== "No result") {
      const data = JSON.parse(dataQR);

      if (data) {
        setValidQR(true);
      }

      console.log(data, validQR);
    }
  }, [dataQR, validQR]);

  return (
    <>
      {!validQR ? (
        <QrReader
          onResult={(result, error) => {
            if (!!result) {
              setQRData(result?.text);
            }

            if (!!error) {
              console.info(error);
            }
          }}
          style={{ width: "100%" }}
        />
      ) : (
        <UseCoupon
          couponId={JSON.parse(dataQR).couponId}
          userId={JSON.parse(dataQR).userId}
        />
      )}
    </>
  );
};

export default CouponAdmin;