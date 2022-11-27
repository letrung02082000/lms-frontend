import axiosClient from "./axiosClient";

class GuesthouseApi {
  getRooms = async (page, limit) => {
    const url = "/api/guest-house/room";
    return axiosClient.get(url, {
      params: {
        page,
        limit,
      },
    });
  };

  getCategories = async (page, limit) => {
    const url = "/api/guest-house/category";
    return axiosClient.get(url, {
      params: {
        page,
        limit,
      },
    });
  };

  patchRoom = async (id, data) => {
    const url = `/api/guest-house/room/${id}`;
    return axiosClient.patch(url, data);
  };

  patchCategory = async (id, data) => {
    const url = `/api/guest-house/category/${id}`;
    return axiosClient.patch(url, data);
  };
}

export default new GuesthouseApi();
