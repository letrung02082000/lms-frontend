import axiosClient from "../axiosClient";

const API_PATH = "https://api.food.isinhvien.vn/category";

class CategoryApi {
    getCategoriesByStore = async (id) => {
        return axiosClient.get(`${API_PATH}/store/${id}`);
    };
}

export default new CategoryApi();
