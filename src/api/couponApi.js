import axiosClient from "./axiosClient";
import { authHeader } from "utils";

const API_PATH = "/coupon";

class CouponApi {
  getCouponAvailable = (limit = 25) => {
    const url = `${API_PATH}/available`;
    return axiosClient.get(url, { params: { limit } });
  };

  getCouponWhiteList = (limit = 25) => {
    const url = `${API_PATH}/whitelist`;
    return axiosClient.get(url, { params: { limit } });
  };

  getCouponByType = (type, limit = 25) => {
    const url = `${API_PATH}`;
    return axiosClient.get(url, { params: { type, limit } });
  };

  getCouponById = (id) => {
    const url = `${API_PATH}/${id}`;
    return axiosClient.get(url);
  };

  getMyCoupon = (userId) => {
    const url = `${API_PATH}-user/my-coupon`;

    return axiosClient.get(url, {
      ...authHeader(),
      params: {
        userId,
      },
    });
  };

  getCouponUser = () => {
    const url = `${API_PATH}-user`;
    return axiosClient.get(url, { ...authHeader() });
  };

  postCouponUserSave = (data) => {
    const url = `${API_PATH}-user/save`;
    return axiosClient.post(url, data, { ...authHeader() });
  };

  getCouponUserUse = (couponId, userId) => {
    const url = `${API_PATH}-user/use`;
    return axiosClient.get(url, { params: { couponId, userId } });
  };

  getCouponUserCheck = (couponId) => {
    const url = `${API_PATH}-user/check`;
    return axiosClient.get(url, {
      ...authHeader(),
      params: {
        couponId,
      },
    });
  };

  patchCoupon = (coupon) => {
    const url = `${API_PATH}/${coupon._id}`;
    return axiosClient.patch(url, coupon, { ...authHeader() });
  };

  deleteCoupon = (couponId) => {
    const url = `${API_PATH}/${couponId}`;
    return axiosClient.delete(url, { ...authHeader() });
  };

  createCoupon = (coupon) => {
    const url = `${API_PATH}`;
    return axiosClient.post(url, coupon, { ...authHeader() });
  };
}

export default new CouponApi();
