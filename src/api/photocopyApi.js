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

  addOrder = async (data) => {
    const url = '/photocopy/orders'
    return axiosClient.post(url, data);
  }
}

export default new PhotocopyApi();
