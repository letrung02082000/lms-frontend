import axiosClient from "./axiosClient";

const API_PATH = "/health";

class HealthApi {
  getHealthById = async (id) => {
    const url = `${API_PATH}/${id}`;
    return axiosClient.get(url);
  };

  getAllHealths = async (page, limit) => {
    const url = `${API_PATH}/all`;
    return axiosClient.get(url, { params: { page, limit } });
  };

  getVisibleHealths = async (page, limit) => {
    const url = `${API_PATH}`;
    return axiosClient.get(url, { params: { page, limit } });
  };

  updateHealth = async (id, data) => {
    const url = `${API_PATH}/${id}`;
    return axiosClient.patch(url, data);
  };

  createHealth = async (data) => {
    const url = `${API_PATH}`;
    return axiosClient.post(url, data);
  };
}

export default new HealthApi();
