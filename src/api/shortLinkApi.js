import axiosClient from "./axiosClient";

const API_PATH = "https://api.food.isinhvien.vn/short";

class ShortLinkApi {
    getShortLink = async (short) => {
        return axiosClient.get(`${API_PATH}/${short}`);
    };
}

export default new ShortLinkApi();
