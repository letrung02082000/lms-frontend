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

    getStoreCategories = async (id) => {
        const url = `${API_PATH}/category`;
        return axiosClient.get(url);
    };

    getStoresByCategory = async (id) => {
        const url = `${API_PATH}`;
        return axiosClient.get(url, {
            params: {
                category: id,
            },
        });
    };

    getStoresByLocation = async (id) => {
        const url = `${API_PATH}`;
        return axiosClient.get(url, {
            params: {
                location: id,
            },
        });
    };
}

export default new StoreApi();
