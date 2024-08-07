import axiosClient from './axiosClient';

const API_PATH = '/user';

class UserApi {
  async getUser() {
    return axiosClient.get(`${API_PATH}`);
  }

  async register(email, password, name) {
    return axiosClient.post(`${API_PATH}/register`, { email, password, name });
  }

  async login(email, password) {
    return axiosClient.post(`${API_PATH}/login`, { email, password });
  }

  async updateUser(name, password) {
    return axiosClient.patch(`${API_PATH}`, { name, password });
  }

  async changePassword(password, newPassword) {
    return axiosClient.post(`${API_PATH}/password`, { password, newPassword });
  }

  async requestPasswordReset(email) {
    return axiosClient.post(`/password/request`, { email });
  }

  async resetPassword(user_id, token, password) {
    return axiosClient.post(`/password/reset`, {
      user_id,
      token,
      password,
    });
  }
}

export default new UserApi();
