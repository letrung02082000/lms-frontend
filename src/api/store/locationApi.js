import axiosClient from "../axiosClient";

const API_PATH = "https://api.food.isinhvien.vn/location";

class LocationApi {
    getLocations = async () => {
        return axiosClient.get(`${API_PATH}`);
    };
}

export default new LocationApi();
