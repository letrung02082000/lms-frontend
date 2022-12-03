import axiosClient from "./axiosClient";

const API_PATH = "/bus";

class BusApi {
  createBusUser = async (data) => {
    const url = `${API_PATH}-user`;
    return axiosClient.post(url, data);
  };

  postBusSurvey = async (data) => {
    const url = `${API_PATH}-survey`;
    return axiosClient.post(url, data);
  };
}

export default new BusApi();
