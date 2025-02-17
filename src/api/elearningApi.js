import axiosClient from "./axiosClient";

const API_PATH = "/elearning";

class ElearningApi {
  initCenterElearning = async (centerId) => {
    const url = `${API_PATH}/driving`;
    return axiosClient.post(url, { centerId },);
  }

  getCenterCourses = async (centerId) => {
    const url = `${API_PATH}/course`;
    return axiosClient.get(url, { params: {
      field: 'category',
      value: centerId,
    } });
  }

  getStudentCourses = async (elearningUserId) => {
    const url = `${API_PATH}/my/course`;
    return axiosClient.get(url, { params: { elearningUserId } });
  }

  getCategoryByIds = async (categoryIds) => {
    const url = `${API_PATH}/category`;
    return axiosClient.get(url, { params: { categoryIds } });
  }

  getCourseContent = async (courseId) => {
    console.log('courseId: ', courseId);
    const url = `${API_PATH}/course/content`;
    return axiosClient.get(url, { params: { courseId } });
  }

  getCohortUsers = async (cohortId) => {
    const url = `${API_PATH}/cohort/user`;
    return axiosClient.get(url, { params: { cohortId } });
  }
}

export default new ElearningApi();
