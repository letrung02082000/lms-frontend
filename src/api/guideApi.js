import axiosClient from "./axiosClient";

const API_PATH = "/guide";

class GuideApi {
  getGuideById = async (id) => {
    const url = `${API_PATH}/${id}`;
    return axiosClient.get(url);
  };

  getAllGuides = async (page, limit) => {
    const url = `${API_PATH}/all`;
    return axiosClient.get(url, { params: { page, limit } });
  };

  getVisibleGuides = async (page, limit) => {
    const url = `${API_PATH}/guide`;
    return axiosClient.get(url, { params: { page, limit } });
  };

  createGuide = async (data) => {
    const url = `${API_PATH}`;
    return axiosClient.post(url, data);
  };

  updateGuide = async (id, data) => {
    const url = `${API_PATH}/${id}`;
    return axiosClient.patch(url, data);
  };
}

export default new GuideApi();
