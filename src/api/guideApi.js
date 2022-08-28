import axiosClient from './axiosClient';

class GuideApi {
  getGuideById = async (id) => {
    return axiosClient.get(`/guide/${id}`);
  };

  getAllGuides = async (page, limit) => {
    return axiosClient.get('/guide/all', { params: { page, limit } });
  };

  getVisibleGuides = async (page, limit) => {
    return axiosClient.get('/guide', { params: { page, limit } });
  };

  createGuide = async (data) => {
    return axiosClient.post('/guide', data);
  }

  updateGuide = async (id, data) => {
    return axiosClient.patch(`/guide/${id}`, data);
  }
}

export default new GuideApi();
