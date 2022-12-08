import axiosClient from "./axiosClient";

const API_PATH = "/photocopy";

class PhotocopyApi {
  getCategories = async () => {
    const url = `${API_PATH}/categories`;
    return axiosClient.get(url);
  };

  getOffices = async () => {
    const url = `${API_PATH}/offices`;
    return axiosClient.get(url);
  };

  searchOrder = async (term) => {
    const url = `${API_PATH}/orders/search`;
    return axiosClient.get(url, { params: { term } });
  };

  addOrder = async (data) => {
    const url = `${API_PATH}/orders`;
    return axiosClient.post(url, data);
  };

  applyCoupon = async (code) => {
    const url = `${API_PATH}/coupons/apply`;
    return axiosClient.get(url, { params: { code } });
  };

  getPhotocopy = async (id) => {
    const url = `${API_PATH}/${id}`;
    return axiosClient.get(url);
  };

  addPhotocopy = async (formData) => {
    const url = `${API_PATH}-user/add`;
    return axiosClient.post(url, formData);
  };

  uploadPhotocopy = async (formData) => {
    const url = `${API_PATH}-user/upload`;
    return axiosClient.post(url, formData);
  };

  queryPhotocopy = async (query) => {
    const url = `${API_PATH}-user/query`;
    return axiosClient.get(url, { params: { query } });
  };

  getPhotocopyList = async (limit, page) => {
    const url = `${API_PATH}`;
    return axiosClient.get(url, { params: { limit, page } });
  };
}

export default new PhotocopyApi();
