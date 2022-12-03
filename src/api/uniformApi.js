import axiosClient from "./axiosClient";

const API_PATH = "/uniform";

class UniformApi {
  register = async (data) => {
    const url = "/uniform/users";
    return axiosClient.post(url, data);
  };

  getUniformList = async (limit = 10, page = 0) => {
    const url = `${API_PATH}`;
    return axiosClient.get(url, { params: { limit, page } });
  };

  getUniformByTel = async (tel) => {
    const url = `${API_PATH}/query`;
    return axiosClient.get(url, { params: { tel } });
  };

  getUniformById = async (id) => {
    const url = `${API_PATH}/${id}`;
    return axiosClient.get(url);
  };

  postUniformImage = async (data) => {
    const url = `${API_PATH}-user/upload`;
    return axiosClient.post(url, data);
  };

  postUniformOrder = async (formData) => {
    const url = `${API_PATH}-user`;
    return axiosClient.post(url, formData);
  }
}

export default new UniformApi();
