import axiosClient from "./axiosClient";

const API_PATH = "https://api.food.isinhvien.vn/product";

class StoreApi {
    getProducts = async () => {
        return axiosClient.get(API_PATH);
    };

    getProductById = async (id) => {
        const url = `${API_PATH}/${id}`;
        return axiosClient.get(url);
    };

    getProductsByStoreId = async (storeId) => {
        const url = `${API_PATH}/store/${storeId}`;
        return axiosClient.get(url);
    };

    getProductsByCategory = async (categoryId) => {
        const url = `${API_PATH}/q?category=${categoryId}`;
        console.log(url);
        return axiosClient.get(url);
    };
}

export default new StoreApi();
