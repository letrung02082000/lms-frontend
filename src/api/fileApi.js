import axiosClient from "./axiosClient";

const API_PATH = "/file";

class FileApi {
  getSignedUrl = async (fileUrl) => {
    const url = `${API_PATH}/signed`;
    return axiosClient.get(url, {
        params: {
            fileUrl,
        },
    });
  }
}

export default new FileApi();
