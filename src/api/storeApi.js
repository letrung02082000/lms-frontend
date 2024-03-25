import axiosClient from "./axiosClient";

const API_PATH = "https://api.food.isinhvien.vn/store";

class StoreApi {
    getStores = async () => {
        return axiosClient.get(API_PATH);
    };

    getStoreById = async (id) => {
        const url = `${API_PATH}/${id}`;
        return axiosClient.get(url);
    };
}

export default new StoreApi();
