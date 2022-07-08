import axiosClient from './axiosClient';

class HealthApi {
  getHealthById = async (id) => {
    return axiosClient.get(`/api/health/${id}`);
  };

  getAllHealths = async (page, limit) => {
    return axiosClient.get('/api/health', { params: { page, limit } });
  };
}

export default new HealthApi();
