import axiosClient from "./axiosClient";

const API_PATH = "/ocr";

class OcrApi {
  getOcrImage = async (id) => {
    const url = `${API_PATH}/${id}/image`;
    return axiosClient.get(url);
  }

  getOcrInfo = async (id) => {
    const url = `${API_PATH}/${id}/info`;
    return axiosClient.get(url);
  }
}

export default new OcrApi();
