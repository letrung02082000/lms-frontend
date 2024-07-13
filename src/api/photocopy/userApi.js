import axiosClient from './axiosClient';

class UserApi {
  async getUser() {
    return axiosClient.get('/users');
  }

  async register(email, password, name) {
    return axiosClient.post('/users/register', { email, password, name });
  }

  async login(email, password) {
    return axiosClient.post('/users/login', { email, password });
  }

  async updateUser(name, password) {
    return axiosClient.patch('/users', { name, password });
  }

  async changePassword(password, newPassword) {
    return axiosClient.post('/users/password', { password, newPassword });
  }

  async requestPasswordReset(email) {
    return axiosClient.post('/password/request', { email });
  }

  async resetPassword(user_id, token, password) {
    return axiosClient.post('/password/reset', {
      user_id,
      token,
      password,
    });
  }
}

export default new UserApi();
