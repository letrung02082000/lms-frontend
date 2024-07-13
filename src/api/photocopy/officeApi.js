import axiosClient from './axiosClient';

class Api {
  getOffices = async (page, limit, search) => {
    return axiosClient.get('/offices', {
      params: { page, limit, search },
    });
  };

  createOffice = async (data) => {
    return axiosClient.post('/offices', data);
  };

  updateOffice = async (id, data) => {
    return axiosClient.patch(`/offices/${id}`, data);
  };
}

export default new Api();
