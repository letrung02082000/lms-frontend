import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import moment from "moment";
import styled from "styled-components";

import CouponApi from "api/couponApi";
import { deafaultCoupon } from "features/coupon/shared/constant";

const Coupon = ({ coupon }) => {
  const codeRef = useRef();
  const valueRef = useRef();
  const serviceTypeRef = useRef();
  const unitRef = useRef();
  const descriptionRef = useRef();
  const maxQuantityRef = useRef();
  const couponCountRef = useRef();
  const startTimeRef = useRef();
  const expiryTimeRef = useRef();
  const isAvailableRef = useRef();
  const requireWhitelistRef = useRef();
  const useCouponRef = useRef();

  const handleUpdateCoupon = async () => {
    const format = "YYYY-MM-DDTHH:mm:ss.SSSZ";

    let updatedCoupon = deafaultCoupon;
    updatedCoupon = {
      _id: coupon._id,
      couponCode: codeRef.current.value,
      value: valueRef.current.value,
      serviceType: serviceTypeRef.current.value,
      unit: unitRef.current.value,
      description: descriptionRef.current.value,
      maxQuantity: maxQuantityRef.current.value,
      count: couponCountRef.current.value,
      startTime: startTimeRef.current.value,
      expiryTime: expiryTimeRef.current.value,
      isAvailable: isAvailableRef.current.value === "0",
      requireWhiteList:
        requireWhitelistRef.current.value === "on" ? true : false,
      useCoupon: useCouponRef.current.value,
      createdAt: moment(coupon.createdAt).format(format),
      updatedAt: moment().format(format),
    };

    console.log("updatedCoupon", updatedCoupon);

    await CouponApi.patchCoupon(updatedCoupon);
    // window.location.reload();
  };

  const handleDeleteCoupon = async () => {
    await CouponApi.deleteCoupon(coupon._id);
    window.location.reload();
  };

  return (
    <CouponStyled>
      <Form.Label>Mã Coupon</Form.Label>
      <Form.Control
        type="text"
        placeholder="Mã Coupon"
        defaultValue={`${coupon.couponCode}`}
        ref={codeRef}
      />
      <Form.Label>Giá trị</Form.Label>
      <Form.Control
        type="number"
        placeholder="Giá trị"
        defaultValue={`${coupon.value}`}
        ref={valueRef}
      />
      <Form.Label>Loại</Form.Label>
      <Form.Control
        as="select"
        defaultValue={`${coupon.type}`}
        ref={serviceTypeRef}
      >
        <option value="0">Tất cả</option>
        <option value="1">Dịch vụ ăn uống</option>
        <option value="2">Khóa học</option>
        <option value="3">In ấn</option>
        <option value="4">Đồng phục</option>
      </Form.Control>
      <Form.Label>Đơn vị</Form.Label>
      <Form.Control as="select" defaultValue={`${coupon.unit}`} ref={unitRef}>
        <option value="0">%</option>
        <option value="1">Nghìn VNĐ</option>
      </Form.Control>
      <Form.Label>Mô tả</Form.Label>
      <Form.Control
        type="text"
        placeholder="Mô tả"
        defaultValue={`${coupon.description}`}
        ref={descriptionRef}
      />
      <Form.Label>Số lượng Coupon</Form.Label>
      <Form.Control
        type="number"
        placeholder="Số lượng"
        defaultValue={`${coupon.maxQuantity}`}
        ref={maxQuantityRef}
      />
      <Form.Label>Số lượng đã sử dụng</Form.Label>
      <Form.Control
        type="number"
        placeholder="Số lượng đã sử dụng"
        defaultValue={`${coupon.count}`}
        ref={couponCountRef}
      />

      <Form.Label>Thời gian bắt đầu</Form.Label>
      <Form.Control
        type="date"
        placeholder="Thời gian bắt đầu"
        defaultValue={moment(coupon.startTime).format("YYYY-MM-DD")}
        ref={startTimeRef}
      />

      <Form.Label>Thời gian kết thúc</Form.Label>
      <Form.Control
        type="date"
        placeholder="Thời gian kết thúc"
        defaultValue={moment(coupon.expiryTime).format("YYYY-MM-DD")}
        ref={expiryTimeRef}
      />

      <Form.Label>Trạng thái</Form.Label>
      <Form.Control
        as="select"
        defaultValue={`${coupon.status}`}
        ref={isAvailableRef}
      >
        <option value="0">Hiển thị</option>
        <option value="1">Ẩn</option>
      </Form.Control>
      <Form.Check
        type="checkbox"
        label="Chỉ áp dụng cho tài khoảng được whitelist"
        checked={coupon.requireWhitelist}
        ref={requireWhitelistRef}
      />
      <Form.Label>Cách sử dụng</Form.Label>
      <Form.Control
        as="select"
        defaultValue={`${coupon.usage}`}
        ref={useCouponRef}
      >
        <option value="0">QR</option>
        <option value="1">Chuyển trang</option>
      </Form.Control>
      <div className="buttons">
        <Button variant="primary" onClick={() => handleUpdateCoupon()}>
          Cập nhật
        </Button>

        <Button variant="danger" onClick={() => handleDeleteCoupon()}>
          Xóa
        </Button>
      </div>
    </CouponStyled>
  );
};

const CouponAdminMange = () => {
  const handleAddNewCoupon = async () => {
    await CouponApi.createCoupon(deafaultCoupon);
    window.location.reload();
  };

  const [couponData, setCouponData] = useState({});

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await CouponApi.getCouponAvailable();
        console.log("Fetch coupons successfully: ", response.data);
        setCouponData(response.data);
      } catch (error) {
        console.log("Failed to fetch coupons: ", error);
      }
    };

    fetchCoupons();
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          margin: "1rem",
        }}
      >
        Hiện đang có {couponData.length ? couponData.length : 0} coupon trên hệ
        thống.
      </div>
      <Button
        variant="primary"
        style={{ margin: "0rem 1rem" }}
        onClick={() => handleAddNewCoupon()}
      >
        Thêm Coupon
      </Button>
      {couponData.length > 0
        ? couponData.map((coupon) => (
            <Coupon key={coupon.couponCode} coupon={coupon} />
          ))
        : null}
    </div>
  );
};

const CouponStyled = styled.div`
  border: 1px solid #aaa;
  padding: 1rem;
  margin: 1rem;
  background-color: white;
  border-radius: 0.5rem;

  .buttons {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
    justify-content: flex-end;
  }
`;

export default CouponAdminMange;