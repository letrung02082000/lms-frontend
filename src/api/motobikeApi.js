import axiosClient from "./axiosClient";

const API_PATH = "/motobike";

class MotobikeApi {
    getMotobikeList = async (page = 0) => {
        const url = `${API_PATH}/available`;
        return axiosClient.get(url, { params: { page } });
    };

    createMotobikeRequest = async (formData) => {
        const url = `${API_PATH}`;
        return axiosClient.post(url, formData);
    }

    updateMotobikeRequest = async (id, formData) => {
        const url = `${API_PATH}/${id}`;
        return axiosClient.patch(url, formData);
    }
}

export default new MotobikeApi();
