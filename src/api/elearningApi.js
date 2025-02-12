import axiosClient from "./axiosClient";
import { authHeader } from "utils";

const API_PATH = "/elearning";

class ElearningApi {
  initCenterElearning = async (centerId) => {
    const url = `${API_PATH}`;
    return axiosClient.post(url, { centerId }, authHeader());
  }
}

export default new ElearningApi();
