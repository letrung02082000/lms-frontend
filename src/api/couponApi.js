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

  getMyCoupon = () => {
    const url = `${API_PATH}-user/my-coupon`;
    return axiosClient.get(url, authHeader());
  };

  getCouponUser = () => {
    const url = `${API_PATH}-user`;
    return axiosClient.get(url, authHeader());
  };

  postCouponUserSave = (data) => {
    const url = `${API_PATH}-user/save`;
    return axiosClient.post(url, data, authHeader());
  };

  getCouponUserUse = (user, coupon) => {
    const url = `${API_PATH}-user/use`;
    return axiosClient.get(url, { params: { user, coupon } });
  };

  getCouponById = (id) => {
    const url = `${API_PATH}/${id}`;
    return axiosClient.get(url);
  };

  getCouponUserCheck = (couponId) => {
    const url = `${API_PATH}-user/check`;
    return axiosClient.get(url, { params: { couponId } }, authHeader());
  }
}

export default new CouponApi();
