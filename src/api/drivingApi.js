import axiosClient from "./axiosClient";
import { authHeader } from "utils";

const API_PATH = "/driving";

class DrivingApi {
  getAllDrivings = async (state) => {
    const url = `${API_PATH}/all`;
    return axiosClient.get(url, {
      ...authHeader(),
      params: {
        state,
      },
    });
  };

  updateDriving = async (_id, data) => {
    const url = `${API_PATH}/${_id}`;
    return axiosClient.patch(url, data, authHeader());
  };

  getDateVisible = async () => {
    const url = `${API_PATH}/date`;
    return axiosClient.get(url, {
      ...authHeader(),
      params: {
        isVisible: true,
      },
    });
  };

  queryDrivings = async (date, state) => {
    const url = `${API_PATH}/query`;
    return axiosClient.get(url, {
      ...authHeader(),
      params: {
        date,
        state,
      },
    });
  };

  countDrivings = async (state) => {
    const url = `${API_PATH}/count`;
    return axiosClient.get(url, {
      ...authHeader(),
      params: {
        state,
      },
    });
  };

  getDrivingByType = async (type) => {
    const url = `${API_PATH}/type`;
    return axiosClient.get(url, {
      ...authHeader(),
      params: {
        type,
      },
    });
  };

  updateDrivingDate = async (_id, date) => {
    const url = `${API_PATH}/update`;
    return axiosClient.put(url, { _id, date }, authHeader());
  };

  updateDrivingFeedback = async (_id, feedback) => {
    const url = `${API_PATH}/update`;
    return axiosClient.put(url, { _id, feedback }, authHeader());
  };

  updateProcessState = async (_id, state) => {
    const url = `${API_PATH}/state`;
    return axiosClient.put(url, { _id, state }, authHeader());
  };

  updateMessageSent = async (_id, messageSent) => {
    const url = `${API_PATH}/sent`;
    return axiosClient.put(url, { _id, messageSent }, authHeader());
  };

  getImage = async (name) => {
    const url = `${API_PATH}/image`;
    return axiosClient.get(url, {
      params: { name },
      ...authHeader(),
    });
  };

  getAllDrivingsDate = async () => {
    const url = `${API_PATH}/date`;
    return axiosClient.get(url, {
      params: {
        all: true,
      },
      ...authHeader(),
    });
  };

  handleVisibleButton = async (_id, date, isVisible, formVisible = false) => {
    const url = `${API_PATH}/date`;
    return axiosClient.put(
      url,
      { _id, date, isVisible, formVisible },
      authHeader()
    );
  };

  handleAddDateButton = async (date, isVisible, description) => {
    const url = `${API_PATH}/date`;
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
    const url = `${API_PATH}/date`;
    return axiosClient.get(url, {
      params: {
        formVisible: true,
      },
      ...authHeader(),
    });
  };

  addDriving = async (data) => {
    const url = `${API_PATH}/add`;
    return axiosClient.post(url, data, {
      headers: { "Content-Type": "multipart/form-data" },
      ...authHeader(),
    });
  };

  searchDriving = async (tel) => {
    const url = `${API_PATH}/search`;
    return axiosClient.get(url, {
      params: { tel },
      ...authHeader(),
    });
  };

  getFile = async (name) => {
    console.log(name)
    const url = `/upload/${name}`;
    return axiosClient.get(url, {
      ...authHeader(),
    });
  };
}

export default new DrivingApi();
