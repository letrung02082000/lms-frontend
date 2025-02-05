import { serializeQuery } from "utils/request.utils";
import axiosClient from "./axiosClient";
import { authHeader } from "utils";

const API_PATH = "/driving";

class DrivingApi {
  getDrivings = async (query, search, page) => {
    const url = `${API_PATH}`;
    return axiosClient.get(url, {
      params: {
        query,
        search,
        page
      }
    });
  }

  updateDriving = async (_id, data) => {
    const url = `${API_PATH}/${_id}`;
    return axiosClient.patch(url, data);
  }

  updateDrivingHealth = async (_id, data) => {
    const url = `${API_PATH}/health/${_id}`;
    return axiosClient.patch(url, data);
  }

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

  query = async (query) => {
    const url = `${API_PATH}/q`;
    return axiosClient.get(url, {
      ...authHeader(),
      params: query,
    });
  }

  queryDrivings = async (date, processState, drivingType) => {
    const url = `${API_PATH}/q`;
    return axiosClient.get(url, {
      ...authHeader(),
      params: {
        date,
        processState,
        drivingType,
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

  updateDrivingDate = async (_id, body) => {
    const url = `${API_PATH}/date`;
    return axiosClient.put(url, { _id, ...body }, authHeader());
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

  getDrivingDate = async (params) => {
    const url = `${API_PATH}/date`;
    return axiosClient.get(url, {
      params,
      ...authHeader(),
    });
  };
  
  getDate = async (params) => {
    const url = `${API_PATH}/date`;
    return axiosClient.get(url, {
      ...authHeader(),
      params,
    });
  };

  getDrivingCenter = async (params) => {
    const url = `${API_PATH}/center`;
    return axiosClient.get(url, {
      params,
    });
  };

  getDrivingCenterById = async (id) => {
    const url = `${API_PATH}/center/${id}`;
    return axiosClient.get(url);
  };

  queryDrivingCenters = async (q) => {
    const url = `${API_PATH}/center`;
    return axiosClient.get(url, {
      params: q,
    });
  };

  updateDrivingCenter = async (_id, data) => {
    const url = `${API_PATH}/center/${_id}`;
    return axiosClient.patch(url, data, authHeader());
  }

  queryDrivingCenterPrice = async (q) => {
    const url = `${API_PATH}/center/price`;
    return axiosClient.get(url, {
      params: q,
    });
  }

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

  addDrivingDate = async (body) => {
    const url = `${API_PATH}/date`;
    return axiosClient.post(
      url,
      body,
      authHeader()
    );
  };

  getFormVisible = async (center) => {
    const url = `${API_PATH}/date`;
    return axiosClient.get(url, {
      params: {
        formVisible: true,
        center,
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
    const url = `/upload/${name}`;
    return axiosClient.get(url, {
      ...authHeader(),
    });
  };

  getTest = async (type) => {
    const url = `/driving-test`;
    return axiosClient.get(url, {
      params: { type },
    });
  };

  getHealthDates = async (drivingDate) => {
    const url = `/driving/health/date`;
    return axiosClient.get(url, {
      params: { drivingDate, visible: true },
    });
  };

  clipPortrait = async (id) => {
    const url = `/driving/clipping/${id}`;
    return axiosClient.post(url, { id });
  }

  extractIdentity = async (id) => {
    const url = `/driving/extract/${id}`;
    return axiosClient.get(url);
  }

  getDrivingCenter = async (params) => {
    const url = `${API_PATH}/center`;
    return axiosClient.get(url, {
      params,
    });
  }

  queryDrivingType = async (q) => {
    const url = `${API_PATH}/type`;
    return axiosClient.get(url, {
      params: q,
    });
  }

  queryDrivingCenterType = async (q) => {
    const url = `${API_PATH}/center/type`;
    return axiosClient.get(url, {
      params: q,
    });
  }
}

export default new DrivingApi();
