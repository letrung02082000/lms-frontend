import axiosClient from "./axiosClient";

const API_PATH = "/guest-house";

class GuesthouseApi {
  // GET

  getRooms = async (page = 0, limit = 100) => {
    const url = `${API_PATH}/room`;
    return axiosClient.get(url, {
      params: {
        page,
        limit,
      },
    });
  };

  getCategories = async (page = 0, limit = 25) => {
    const url = `${API_PATH}/category`;
    return axiosClient.get(url, {
      params: {
        page,
        limit,
      },
    });
  };

  getVisibleCategories = async () => {
    const url = `${API_PATH}/category`;
    return axiosClient.get(url, {
      params: {
        search: { isVisible: true },
      },
    });
  };

  getRoomByCategoryId = async (id) => {
    const url = `${API_PATH}/room`;
    return axiosClient.get(url, {
      params: {
        category: id,
      }
    })
  };

  getCategoryVisibleById = async (id) => {
    const url = `${API_PATH}/category/${id}`;
    return axiosClient.get(url, {
      params: {
        search: { isVisible: true },
      },
    });
  };

  getListReport = (limit = 25, page = 0) => {
    const url = `${API_PATH}/report`;
    return axiosClient.get(url, { params: { limit, page } });
  };

  getListUser = (limit = 25, page = 0) => {
    const url = `${API_PATH}/user`;
    return axiosClient.get(url, { params: { limit, page } });
  };

  // POST

  postCategory = async (data) => {
    const url = `${API_PATH}/category`;
    return axiosClient.post(url, data);
  };

  postReportRoom = async (data) => {
    const url = `${API_PATH}/report`;
    return axiosClient.post(url, data);
  };

  postUser = async (data) => {
    const url = `${API_PATH}/user`;
    return axiosClient.post(url, data);
  };

  postRoom = async (data) => {
    const url = `${API_PATH}/room`;
    return axiosClient.post(url, data);
  };

  // PATCH

  patchRoom = async (id, data) => {
    const url = `${API_PATH}/room/${id}`;
    return axiosClient.patch(url, data);
  };

  patchCategory = async (id, data) => {
    const url = `${API_PATH}/category/${id}`;
    return axiosClient.patch(url, data);
  };

  patchReport = async (id, data) => {
    const url = `${API_PATH}/report/${id}`;
    return axiosClient.patch(url, data);
  }

  patchUser = async (id, data) => {
    const url = `${API_PATH}/user/${id}`;
    return axiosClient.patch(url, data);
  }
}

export default new GuesthouseApi();
