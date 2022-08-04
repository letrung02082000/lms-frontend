import axiosClient from './axiosClient';

class HealthApi {
  getHealthById = async (id) => {
    return axiosClient.get(`/health/${id}`);
  };

  getAllHealths = async (page, limit) => {
    return axiosClient.get('/health', { params: { page, limit } });
  };
}

export default new HealthApi();
