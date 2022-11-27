import axiosClient from "./axiosClient";
import { authHeader } from "utils";

class BikeApi {
  getBike = async () => {
    const url = "/api/bike";
    return axiosClient.get(url);
  };

  handleLogin = async (email, password) => {
    const url = "/api/bike-admin/login";
    return axiosClient.post(url, { email, password });
  };

  handleRenew = async (refreshToken) => {
    const url = "/api/bike-admin/refresh";
    return axiosClient.post(url, { refreshToken });
  };

  handleUpdateBike = async (info) => {
    const url = `/api/bike/${info._id}`;
    return axiosClient.patch(
      url,
      { isAvailable: !info.isAvailable },
      authHeader()
    );
  };
}

export default new BikeApi();
