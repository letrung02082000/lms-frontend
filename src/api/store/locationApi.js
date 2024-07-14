import axiosClient from "../axiosClient";

const API_PATH = "/location";

class LocationApi {
    getLocations = async () => {
        return axiosClient.get(`${API_PATH}`);
    };
}

export default new LocationApi();
