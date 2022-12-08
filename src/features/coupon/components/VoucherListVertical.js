import React, { useEffect, useState } from "react";
import { authHeader } from "utils";

import VoucherCardVertical from "./VoucherCardVertical";

import CouponApi from "api/couponApi";

import styles from "./voucherList.module.css";
function VoucherListVertical(props) {
  const [data, setData] = useState([]);

  useEffect(() => {
    CouponApi.getCouponUser()
      .then((res) => {
        setData(res.data);
      })
      .catch((e) => {
        console.log(e);
        alert(
          "Không thể tải danh sách ưu đãi của bạn. Vui lòng liên hệ admin để được hỗ trợ nhanh nhất"
        );
      });
  }, []);

  return (
    <div className={styles.voucherList}>
      <div className={styles.listVertical}>
        {data.map((child) => {
          console.log(child);
          return (
            <VoucherCardVertical
              key={child._id}
              coupon={child.coupon}
              isUsed={child.isUsed ? 1 : 0}
            />
          );
        })}
      </div>
    </div>
  );
}

export default VoucherListVertical;
