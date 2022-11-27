import axiosClient from "./axiosClient";
import { authHeader } from "utils";

class DrivingApi {
  getAllDrivings = async (state) => {
    const url = "/driving/all";
    return axiosClient.get(url, {
      ...authHeader(),
      params: {
        state,
      },
    });
  };

  getDateVisible = async () => {
    const url = "/driving/date";
    return axiosClient.get(url, {
      ...authHeader(),
      params: {
        isVisible: true,
      },
    });
  };

  queryDrivings = async (date, state) => {
    const url = "/driving/query";
    return axiosClient.get(url, {
      ...authHeader(),
      params: {
        date,
        state,
      },
    });
  };

  countDrivings = async (state) => {
    const url = "/driving/count";
    return axiosClient.get(url, {
      ...authHeader(),
      params: {
        state,
      },
    });
  };

  getDrivingByType = async (type) => {
    const url = "/driving/type";
    return axiosClient.get(url, {
      ...authHeader(),
      params: {
        type,
      },
    });
  };

  updateDrivingDate = async (_id, date) => {
    const url = "/api/driving/update";
    return axiosClient.put(url, { _id, date }, authHeader());
  };

  updateDrivingFeedback = async (_id, feedback) => {
    const url = "/api/driving/update";
    return axiosClient.put(url, { _id, feedback }, authHeader());
  };

  updateProcessState = async (_id, state) => {
    const url = "/api/driving/state";
    return axiosClient.put(url, { _id, state }, authHeader());
  };

  getImage = async (name) => {
    const url = "/api/driving/image";
    return axiosClient.get(url, {
      params: { name },
      ...authHeader(),
    });
  };

  handleMessageSent = async (_id, messageSent) => {
    const url = "/api/driving/sent";
    return axiosClient.put(url, { _id, messageSent }, authHeader());
  };

  getAllDrivingsDate = async () => {
    const url = "/api/driving/date";
    return axiosClient.get(url, {
      params: {
        all: true,
      },
      ...authHeader(),
    });
  };

  handleVisibleButton = async (_id, date, isVisible, formVisible = false) => {
    const url = "/api/driving/date";
    return axiosClient.put(
      url,
      { _id, date, isVisible, formVisible },
      authHeader()
    );
  };

  handleAddDateButton = async (date, isVisible, description) => {
    const url = "/api/driving/date";
    return axiosClient.post(
      url,
      {
        date,
        isVisible,
        description,
      },
      authHeader()
    );
  };

  getFormVisible = async () => {
    const url = "/api/driving/date";
    return axiosClient.get(url, {
      params: {
        formVisible: true,
      },
      ...authHeader(),
    });
  };

  addDriving = async (data) => {
    const url = "/api/driving/add";
    return axiosClient.post(url, data, {
      headers: { "Content-Type": "multipart/form-data" },
      ...authHeader(),
    });
  };

  searchDriving = async (category) => {
    const url = "/api/driving/search";
    return axiosClient.get(url, {
      params: { category },
      ...authHeader(),
    });
  };
}

export default new DrivingApi();
