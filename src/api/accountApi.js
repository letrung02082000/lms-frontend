import axiosClient from "./axiosClient";

class AccountApi {
  signupUser = (user) => {
    const url = "/api/user/signup";
    return axiosClient.post(url, user);
  };

  loginUser = (user) => {
    const url = "/api/user/login";
    return axiosClient.post(url, user);
  };

  logoutUser = async (refreshToken) => {
    const url = "/api/user/logout";
    return axiosClient.post(url, { refreshToken });
  };

  loginAdminDriving = async (user) => {
    const url = "/api/admin/driving-login";
    return axiosClient.post(url, user);
  };

  getProlfile = async (token) => {
    const url = "/api/user/profile";
    return axiosClient.get(url, { headers: { token } });
  };

  refreshToken = async (refreshToken) => {
    const url = "/api/user/refresh-token";
    return axiosClient.post(url, { refreshToken });
  };
}

export default new AccountApi();
