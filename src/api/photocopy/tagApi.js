import axiosClient from './axiosClient';

class TagApi {
  getTags = async (page, limit, search) => {
    return axiosClient.get('/tags', {
      params: { page, limit, search },
    });
  };

  getTag = async (id) => {
    return axiosClient.get(`/tags/${id}`);
  };

  createTag = async (data) => {
    return axiosClient.post('/tags', data);
  };

  updateTag = async (id, data) => {
    return axiosClient.patch(`/tags/${id}`, data);
  };
}

export default new TagApi();
