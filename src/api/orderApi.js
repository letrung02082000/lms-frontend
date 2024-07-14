import axiosClient from './axiosClient';

const API_PATH = "/order";

class Api {
  getOrders = async (page, limit, search) => {
    return axiosClient.get(API_PATH, {
      params: {
        search,
        page,
        limit,
      },
    });
  };

  getOrderById = async (id) => {
    return axiosClient.get(`${API_PATH}/${id}`);
  }

  searchOrders = async (term) => {
    return axiosClient.get(`${API_PATH}/search`, {
      params: {
        term
      },
    });
  };

  getOrderHistory = async (page, limit, search) => {
    return axiosClient.get(`${API_PATH}/histories`, {
      params: {
        page,
        limit,
        search
      }
    })
  }

  getOrder = async (id) => {
    return axiosClient.get(`${API_PATH}/${id}`);
  }

  getOrderByToken = async (token) => {
    return axiosClient.get(`${API_PATH}/token`, { params: { token } });
  }

  createOrder = async (data) => {
    return axiosClient.post(API_PATH, data);
  };

  queryOrder = async (data) => {
    return axiosClient.get(`${API_PATH}/query`, { params: data });
  };
}

export default new Api();
