import axiosClient from './axiosClient';

class Api {
  getSignedUrl = async (fileId) => {
    return axiosClient.get(`/files/${fileId}`);
  };
}

export default new Api();
