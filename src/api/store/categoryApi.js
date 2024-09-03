import axiosClient from "../axiosClient";

const API_PATH = "/category";

class CategoryApi {
    getProductCategories = async (id) => {
        return axiosClient.get(`${API_PATH}/product`, {
            params: {
                storeId: id,
            },
        });
    };

    getStoreCategories = async () => {
        return axiosClient.get(`${API_PATH}/store`);
    };

    getMyCategories = async () => {
        return axiosClient.get(`${API_PATH}/my`);
    }
}

export default new CategoryApi();
