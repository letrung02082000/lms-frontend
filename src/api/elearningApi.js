import axiosClient from "./axiosClient";

const API_PATH = "/elearning";

class ElearningApi {
  initCenterElearning = async (centerId) => {
    const url = `${API_PATH}/driving`;
    return axiosClient.post(url, { centerId },);
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
}

export default new ElearningApi();
