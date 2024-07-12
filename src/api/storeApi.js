import axiosClient from "./axiosClient";

const API_PATH = "https://api.food.isinhvien.vn/store";

class StoreApi {
    getStores = async () => {
        return axiosClient.get(API_PATH, {
            params: {
                visible: true,
            },
        });
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
                visible: true,
            },
        });
    };

    getStoresByLocation = async (id) => {
        const url = `${API_PATH}`;
        return axiosClient.get(url, {
            params: {
                location: id,
                visible: true,
            },
        });
    };

    getStoreOptions = async (id) => {
        const url = `${API_PATH}/option/${id}`;
        return axiosClient.get(url);
    }
}

export default new StoreApi();
