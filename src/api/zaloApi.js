import axiosClient from './axiosClient';

const API_PATH = '/zalo';

class ZaloApi {
    sendTextMessage = async (center, uid, message) => {
        return axiosClient.post(`${API_PATH}/message`, { center, uid, message });
    }

    findUserbyPhoneNumber = async (center, phoneNumber) => {
        return axiosClient.post(`${API_PATH}/user`, { phoneNumber, center });
    };
}

export default new ZaloApi();
