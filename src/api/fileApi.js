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

  uploadDrivingFile = async (file) => {
    const url = `${API_PATH}/upload/driving`;
    let formData = new FormData();
    const newFile = new File([file], file.name, { type: file.type });
    formData.append("file", newFile);

    return axiosClient.post(url, formData);
  }
}

export default new FileApi();
