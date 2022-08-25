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
}

export default new PhotocopyApi();
