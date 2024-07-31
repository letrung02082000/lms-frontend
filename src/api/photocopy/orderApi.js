import axiosClient from './axiosClient';

class Api {
  getOrders = async (page, limit, search) => {
    return axiosClient.get('/orders', {
      params: {
        search,
        page,
        limit,
      },
    });
  };

  searchOrders = async (term) => {
    return axiosClient.get('/orders/search', {
      params: {
        term
      },
    });
  };

  getOrderHistory = async (page, limit, search) => {
    return axiosClient.get('orders/histories', {
      params: {
        page,
        limit,
        search
      }
    })
  }

  getOrder = async (id) => {
    return axiosClient.get(`/orders/${id}`);
  }

  getOrderByToken = async (token) => {
    return axiosClient.get(`/orders/token`, { params: { token } });
  }

  createOrder = async (data) => {
    return axiosClient.post('/orders', data);
  };

  updateState = async (id, state, timeline) => {
    if (!timeline) {
      timeline = [];
    }
    timeline[state] = Date.now();

    return axiosClient.patch(`/orders/${id}`, { state, timeline });
  };

  updateBranch = async (id, branch) => {
    return axiosClient.patch(`/orders/${id}`, { branch });
  };

  updateOrder = async (id, data) => {
    return axiosClient.patch(`/orders/${id}`, data);
  };

  createQuotationToken = async (id) => {
    return axiosClient.patch(`/orders/${id}/quotation`);
  };

  getQuotationById = async (id, token) => {
    return axiosClient.get(`/orders/${id}/quotation`, {
      params: {
        token,
      },
    });
  };

  getStatistics = (startTime, endTime) => {
    return axiosClient.get('/orders/statistics', {
      params: {
        startTime,
        endTime
      }
    })
  }

  updateTimeline = (id, timeline) => {
    return axiosClient.patch(`/orders/${id}`, { timeline })
  }
}

export default new Api();
