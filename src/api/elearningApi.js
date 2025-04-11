import axiosClient from "./axiosClient";

const API_PATH = "/elearning";

class ElearningApi {
  initCenterElearning = async (centerId) => {
    const url = `${API_PATH}/driving`;
    return axiosClient.post(url, { centerId },);
  }

  getCoursesByCatId = async (catId, page, limit) => {
    const url = `${API_PATH}/course`;
    return axiosClient.get(url, { params: {
      field: 'category',
      value: catId,
      page: page,
      limit: limit,
    } });
  }

  getCoursesByCenter = async (center, page, limit) => {
    const url = `${API_PATH}/center/course`;
    return axiosClient.get(url, {
      params: {
        center
      }
    });
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

  getCourseUsers = async (courseId, groupId) => {
    const url = `${API_PATH}/course/user`;
    return axiosClient.get(url, { params: { courseId, groupId } });
  }

  createCourseUsers = async (courseId, groupId, users) => {
    const url = `${API_PATH}/course/user`;
    return axiosClient.post(url, { courseId, groupId, users });
  }

  getGroupUsers = async (groupId) => {
    const url = `${API_PATH}/group/user`;
    return axiosClient.get(url, { params: { groupId } });
  }

  getCourseReport = async (courseId) => {
    const url = `${API_PATH}/course/report`;
    return axiosClient.get(url, { params: { courseId } });
  }

  getUserByMoodleToken = async (moodleToken) => {
    const url = `${API_PATH}/user/moodle`;
    return axiosClient.get(url, { params: { moodleToken } });
  }

  changeUserPasswordByMoodleToken = async (moodleToken, newPassword) => {
    const url = `${API_PATH}/user/change-password`;
    return axiosClient.post(url, { moodleToken, newPassword });
  }
}

export default new ElearningApi();
