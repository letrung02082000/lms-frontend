import axiosClient from "./axiosClient";

const API_PATH = "/pool";

class PoolApi {
  registerPoolTutor = async (data) => {
    const url = `${API_PATH}/tutor-user`;
    return axiosClient.post(url, data);
  };

  postPoolTicket = async (data) => {
    const url = `${API_PATH}/ticket-user`;
    const headers = { 'Content-Type': 'multipart/form-data' };
    return axiosClient.post(url, data, headers);
  }
}

export default new PoolApi();
