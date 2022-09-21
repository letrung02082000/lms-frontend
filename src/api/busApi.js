import axiosClient from './axiosClient'

class BusApi {
  createBusUser = async data => {
    return axiosClient.post('/bus-user', data)
  }
}

export default new BusApi()
