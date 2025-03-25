import { serializeQuery } from "utils/request.utils";
import axiosClient from "./axiosClient";

const API_PATH = "/driving";

class DrivingApi {
  getDrivings = async (params) => {
    const url = `${API_PATH}`;
    return axiosClient.get(url, {
      params
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
      params: {
        state,
      },
    });
  };

  updateDriving = async (_id, data) => {
    const url = `${API_PATH}/${_id}`;
    return axiosClient.patch(url, data);
  };

  query = async (query) => {
    const url = `${API_PATH}/q`;
    return axiosClient.get(url, {
      params: query,
    });
  }

  queryDrivings = async (date, processState, drivingType) => {
    const url = `${API_PATH}/q`;
    return axiosClient.get(url, {
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
      params: {
        state,
      },
    });
  };

  getDrivingByType = async (type) => {
    const url = `${API_PATH}/type`;
    return axiosClient.get(url, {
      params: {
        type,
      },
    });
  };

  updateDrivingDate = async (_id, body) => {
    const url = `${API_PATH}/date/${_id}`;
    return axiosClient.patch(url, body);
  };

  updateDrivingCourse = async (_id, body) => {
    const url = `${API_PATH}/course/${_id}`;
    return axiosClient.patch(url, body);
  };

  updateDrivingFeedback = async (_id, feedback) => {
    const url = `${API_PATH}/update`;
    return axiosClient.put(url, { _id, feedback });
  };

  updateProcessState = async (_id, state) => {
    const url = `${API_PATH}/state`;
    return axiosClient.put(url, { _id, state });
  };

  updateMessageSent = async (_id, messageSent) => {
    const url = `${API_PATH}/sent`;
    return axiosClient.put(url, { _id, messageSent });
  };

  getImage = async (name) => {
    const url = `${API_PATH}/image`;
    return axiosClient.get(url, {
      params: { name },
    });
  };

  getAllDrivingsDate = async () => {
    const url = `${API_PATH}/date`;
    return axiosClient.get(url, {
      params: {
        all: true,
      },
    });
  };

  getDrivingDate = async (params) => {
    const url = `${API_PATH}/date`;
    return axiosClient.get(url, {
      params,
    });
  };

  getDate = async (params) => {
    const url = `${API_PATH}/date`;
    return axiosClient.get(url, {
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
    return axiosClient.patch(url, data);
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

    );
  };

  addDrivingDate = async (body) => {
    const url = `${API_PATH}/date`;
    return axiosClient.post(
      url,
      body,

    );
  };

  getFormVisible = async (center) => {
    const url = `${API_PATH}/date`;
    return axiosClient.get(url, {
      params: {
        formVisible: true,
        center,
      },
    });
  };

  addDriving = async (data) => {
    const url = `${API_PATH}/add`;
    return axiosClient.post(url, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  searchDriving = async (tel) => {
    const url = `${API_PATH}/search`;
    return axiosClient.get(url, {
      params: { tel },
    });
  };

  getFile = async (name) => {
    const url = `/upload/${name}`;
    return axiosClient.get(url, {
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

  clipPortrait = async (id, _url, field, isHealth = false) => {
    const url = `/driving/clipping/${id}`;
    return axiosClient.post(url, { id, url: _url, field, isHealth });
  }

  extractIdentity = async (id, frontUrl, backUrl) => {
    const url = `/driving/extract/${id}`;
    return axiosClient.get(url, {
      params: { frontUrl, backUrl },
    });
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

  updateDrivingCenterType = async (id, data) => {
    const url = `${API_PATH}/center/type/${id}`;
    return axiosClient.patch(url, data);
  }

  queryDrivingTeacher = async (q) => {
    const url = `${API_PATH}/teacher`;
    return axiosClient.get(url, {
      params: q,
    });
  }

  sendZaloMessage = async (tel, message) => {
    const url = `${API_PATH}/message`;
    return axiosClient.post(url, { tel, message });
  }

  queryDrivingCenterSetting = async (center) => {
    const url = `${API_PATH}/setting`;
    return axiosClient.get(url, {
      params: { center },
    });
  }

  queryDrivingCourse = async (q) => {
    const url = `${API_PATH}/course`;
    return axiosClient.get(url, {
      params: q,
    });
  }

  queryDrivingVehicle = async (q) => {
    const url = `${API_PATH}/vehicle`;
    return axiosClient.get(url, {
      params: q,
    });
  }
}

export default new DrivingApi();
