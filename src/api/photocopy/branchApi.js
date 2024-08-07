import axiosClient from './axiosClient';

class Api {
  getBranchs = async (page, limit, search) => {
    return axiosClient.get('/branches', {
      params: { page, limit, search },
    });
  };

  createBranch = async (data) => {
    return axiosClient.post('/branches', data);
  };

  updateBranch = async (id, data) => {
    return axiosClient.patch(`/branches/${id}`, data);
  };
}

export default new Api();
