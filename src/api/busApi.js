import axiosClient from './axiosClient';

class BusApi {
  createBusUser = async (data) => {
    return axiosClient.post('/api/bus-user', data);
  };
}

export default new BusApi();
