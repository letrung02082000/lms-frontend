import axiosClient from "./axiosClient";

const API_PATH = "/product";

class StoreApi {
    getProducts = async () => {
        return axiosClient.get(API_PATH, {
            params: {
                visible: true,
            },
        });
    };

    getProductById = async (id) => {
        const url = `${API_PATH}/${id}`;
        return axiosClient.get(url);
    };

    getProductsByStoreId = async (storeId) => {
        const url = `${API_PATH}/store/${storeId}`;
        return axiosClient.get(url,
            {
                params: {
                    visible: true,
                },
            });
    };

    getProductsByCategory = async (categoryId, storeId) => {
        const url = `${API_PATH}/q`;
        return axiosClient.get(url, {
            params: {
                visible: true,
                category: categoryId,
                store: storeId,
            },
        });
    };

    getProductCategories = async () => {
        const url = `${API_PATH}/category`;
        return axiosClient.get(url);
    };
}

export default new StoreApi();
