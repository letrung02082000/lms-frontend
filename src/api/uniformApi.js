import axiosClient from './axiosClient';

class UniformApi {
  register = async (data) => {
    const url = '/uniform/users'
    return axiosClient.post(url, data);
  }
}

export default new UniformApi();
