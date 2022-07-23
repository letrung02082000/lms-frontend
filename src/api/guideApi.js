import axiosClient from './axiosClient';

class GuideApi {
  getGuideById = async (id) => {
    return axiosClient.get(`/guide/${id}`);
  };

  getAllGuides = async (page, limit) => {
    return axiosClient.get('/guide', { params: { page, limit } });
  };
}

export default new GuideApi();
