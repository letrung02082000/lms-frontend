import axiosClient from './axiosClient';

class HealthApi {
  getHealthById = async (id) => {
    return axiosClient.get(`/health/${id}`);
  };

  getAllHealths = async (page, limit) => {
    return axiosClient.get('/health/all', { params: { page, limit } });
  };

  getVisibleHealths = async (page, limit) => {
    return axiosClient.get('/health', { params: { page, limit } });
  };

  updateHealth = async (id, data) => {
    return axiosClient.patch(`/health/${id}`, data);
  };

  createHealth = async (data) => {
    return axiosClient.post('/health', data);
  }
}

export default new HealthApi();
