import axiosClient from "./axiosClient";
import { authHeader } from "utils";

const API_PATH = "/user";

class AccountApi {
  sendOtp = async (zaloNumber) => {
    const url = `${API_PATH}/send-otp`;
    return axiosClient.post(url, { zaloNumber });
  }

  verifyOtp = async (zaloNumber, otp) => {
    const url = `${API_PATH}/check-otp`;
    return axiosClient.post(url, { zaloNumber, otp });
  }

  signupUser = (user) => {
    const url = `${API_PATH}/signup`;
    return axiosClient.post(url, user);
  };

  loginUser = (user) => {
    const url = `${API_PATH}/login`;
    return axiosClient.post(url, user);
  };

  logoutUser = async (refreshToken) => {
    const url = `${API_PATH}/logout`;
    return axiosClient.post(url, { refreshToken });
  };

  getProlfile = async () => {
    const url = `${API_PATH}/profile`;
    return axiosClient.get(url, authHeader());
  };

  getUserCard = async () => {
    const url = `${API_PATH}/card`;
    return axiosClient.get(url, authHeader());
  };

  refreshToken = async (refreshToken) => {
    const url = `${API_PATH}/refresh-token`;
    return axiosClient.post(url, { refreshToken });
  };

  loginViaGoogle = async (tokenId) => {
    const url = `${API_PATH}/google-login`;
    return axiosClient.post(url, { tokenId });
  };

  postUserUpdateProfile = async (data) => {
    const url = `${API_PATH}/update-profile`;
    return axiosClient.post(url, data, authHeader());
  };

  postUserUpdatePsw = async (data) => {
    const url = `${API_PATH}/update-psw`;
    return axiosClient.post(url, data, authHeader());
  };

  postUserUpdateCard = async (data) => {
    const url = `${API_PATH}/card`;
    return axiosClient.post(url, data, authHeader());
  };

  // TODO: extract to another admin api
  loginAdminDriving = async (user) => {
    const url = "/admin/driving-login";
    return axiosClient.post(url, user);
  };
}

export default new AccountApi();
