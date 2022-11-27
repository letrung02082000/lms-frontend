import axiosClient from "./axiosClient";

class PhotocopyApi {
  getCategories = async () => {
    const url = "/photocopy/categories";
    return axiosClient.get(url);
  };

  getOffices = async () => {
    const url = "/photocopy/offices";
    return axiosClient.get(url);
  };

  searchOrder = async (term) => {
    const url = "/photocopy/orders/search";
    return axiosClient.get(url, { params: { term } });
  };

  addOrder = async (data) => {
    const url = "/photocopy/orders";
    return axiosClient.post(url, data);
  };

  applyCoupon = async (code) => {
    const url = "/photocopy/coupons/apply";
    return axiosClient.get(url, { params: { code } });
  };

  getPhotocopy = async (id) => {
    const url = `/photocopy/${id}`;
    return axiosClient.get(url);
  };

  addPhotocopy = async (formData) => {
    const url = "/api/photocopy-user/add";
    return axiosClient.post(url, formData);
  };

  uploadPhotocopy = async (formData) => {
    const url = "/api/photocopy-user/upload";
    return axiosClient.post(url, formData);
  };

  queryPhotocopy = async (query) => {
    const url = "/api/photocopy-user/query";
    return axiosClient.get(url, { params: { query } });
  };

  getPhotocopyList = async (limit, page) => {
    const url = "/api/photocopy";
    return axiosClient.get(url, { params: { limit, page } });
  };
}

export default new PhotocopyApi();
