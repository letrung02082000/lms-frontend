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

  getCoursesContents = async (courseIds = null) => {
    const allContents = {};
    
    for (const id of courseIds) {
      try {
        const courseContentRes = await this.getCourseContent(id);
        allContents[id] = courseContentRes?.data;
      } catch (error) {
        allContents[id] = { error: `Lỗi: ${error.message}` };
      }
    }

    return allContents;
  };

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

  getModuleTime = async (moduleId) => {
    const url = `${API_PATH}/module/setting`;
    return axiosClient.get(url, { params: { moduleId } });
  }

  getUserCourseGrade = async (userIds) => {
    const url = `${API_PATH}/course/grade`;
    return axiosClient.get(url, { params: { userIds } });
  }

  getElearningActivityReport = async (lessonIds, userIds) => {
    const url = `${API_PATH}/activity/report`;
    return axiosClient.get(url, { params: { lessonIds, userIds } });
  }

  getElearningSetting = async (moodleCourseId, drivingType) => {
    const url = `${API_PATH}/setting`;
    return axiosClient.get(url, { params: { moodleCourseId, ...(drivingType && { drivingType }) } });
  }

  getCoursesByCenter = async (center, page, limit) => {
    const url = `${API_PATH}/center/course`;
    return axiosClient.get(url, {
      params: {
        center
      }
    });
  }
}

export default new ElearningApi();
