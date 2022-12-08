import axiosClient from "./axiosClient";
import { authHeader } from "utils";

const API_PATH = "/bike";

class BikeApi {
  getBike = async () => {
    const url = `${API_PATH}`;
    return axiosClient.get(url);
  };

  handleLogin = async (email, password) => {
    const url = `${API_PATH}-admin/login`;
    return axiosClient.post(url, { email, password });
  };

  handleRenew = async (refreshToken) => {
    const url = `${API_PATH}-admin/refresh`;
    return axiosClient.post(url, { refreshToken });
  };

  handleUpdateBike = async (info) => {
    const url = `${API_PATH}/${info._id}`;
    return axiosClient.patch(
      url,
      { isAvailable: !info.isAvailable },
      authHeader()
    );
  };
}

export default new BikeApi();
