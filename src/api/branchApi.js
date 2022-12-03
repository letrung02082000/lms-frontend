import axiosClient from './axiosClient'

const API_PATH = '/branch'

class Api {
  getBranchs = async (page, limit) => {
    const url = `${API_PATH}`
    return axiosClient.get(url, {
      params: { page, limit }
    })
  }

  createBranch = async data => {
    const url = `${API_PATH}`
    return axiosClient.post(url, data)
  }

  updateBranch = async (id, data) => {
    const url = `${API_PATH}/${id}`
    return axiosClient.patch(url, data)
  }
}

export default new Api()
