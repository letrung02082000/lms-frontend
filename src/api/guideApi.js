import axiosClient from './axiosClient';

class GuideApi {
  getGuideById = async (id) => {
    return axiosClient.get(`/api/guide/${id}`);
  };

  getAllGuides = async (page, limit) => {
    return axiosClient.get('/api/guide', { params: { page, limit } });
  };
}

export default new GuideApi();
