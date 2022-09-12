import axiosClient from './axiosClient';

class PhotocopyApi {
  getCategories = async () => {
    const url = '/photocopy/categories';
    return axiosClient.get(url);
  };

  getOffices = async () => {
    const url = '/photocopy/offices';
    return axiosClient.get(url);
  };

  searchOrder = async (term) => {
    const url = '/photocopy/orders/search';
    return axiosClient.get(url, { params: { term } });
  };

  addOrder = async (data) => {
    const url = '/photocopy/orders'
    return axiosClient.post(url, data);
  }

  applyCoupon = async (code) => {
    const url = '/photocopy/coupons/apply'
    return axiosClient.get(url, { params: { code } });
  }
}

export default new PhotocopyApi();
