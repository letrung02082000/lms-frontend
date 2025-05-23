import axios from 'axios';
const currentPath = window.location.hostname;
const MOODLE_URL = currentPath?.split('.')?.includes('lms2') ? 'https://moodle2.uniapp.vn' : 'https://moodle.uniapp.vn';
const MOODLE_TOKEN = localStorage.getItem('moodleToken');
const MOODLE_SERVICE_SHORTNAME = 'react_app';

if (!MOODLE_URL || !MOODLE_TOKEN) {
    console.warn(
        'Cảnh báo: Vui lòng cấu hình MOODLE_URL và MOODLE_TOKEN trong file src/services/moodleApi.js'
    );
}

const apiClient = axios.create({
    baseURL: `${MOODLE_URL}/webservice/rest/server.php`,
    params: {
        wstoken: MOODLE_TOKEN,
        moodlewsrestformat: 'json',
    },
});

export const getSiteInfo = async (token) => {
    try {
        const response = await apiClient.post('', null, {
            params: {
                ...apiClient.defaults.params,
                wstoken: token || MOODLE_TOKEN,
                wsfunction: 'core_webservice_get_site_info',
            },
        });

        if (response.data && response.data.exception) {
            console.error('Lỗi API Moodle:', response.data);
            throw new Error(response.data.message || 'Lỗi không xác định từ Moodle API');
        }
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi getSiteInfo:', error.response?.data || error.message);
        throw error;
    }
};

const getQuizzesByCourses = async (courseIds = []) => {
    if (!Array.isArray(courseIds)) {
        throw new Error('courseIds phải là một mảng.');
    }

    const courseParams = courseIds.reduce((acc, id, index) => {
        acc[`courseids[${index}]`] = id;
        return acc;
    }, {});

    try {
        const response = await apiClient.post('', null, {
            params: {
                ...apiClient.defaults.params,
                wsfunction: 'local_quizinfo_get_quizzes_by_courses',
                ...courseParams,
            },
        });
        if (response.data && response.data.exception) {
            console.error('Lỗi API Moodle:', response.data);
            throw new Error(response.data.message || 'Lỗi không xác định từ Moodle API');
        }
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi getQuizzesByCourses:', error.response?.data || error.message);
        throw error;
    }
};

export const startQuizAttempt = async (quizId) => {
    if (!quizId) throw new Error('quizId là bắt buộc.');

    try {
        const response = await apiClient.post('', null, {
            params: {
                ...apiClient.defaults.params,
                wsfunction: 'mod_quiz_start_attempt',
                quizid: quizId,
            },
        });
        if (response.data && response.data.exception) {
            console.error('Lỗi API Moodle:', response.data);
            throw new Error(response.data.message || 'Lỗi không xác định từ Moodle API');
        }

        if (response.data && response.data.errorcode) {
            console.error('Lỗi khi bắt đầu attempt:', response.data);
            throw new Error(response.data.message || response.data.errorcode);
        }

        if (response.data.warnings && response.data.warnings.length > 0) {
            console.warn('Cảnh báo từ startQuizAttempt:', response.data.warnings);
        }
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi startQuizAttempt:', error.response?.data || error.message);
        throw error;
    }
};

export const getAttemptData = async (attemptId, page = 0) => {
    console.log(`Gọi API: mod_quiz_get_attempt_data với attemptId: ${attemptId}, page: ${page}`);
    if (!attemptId) throw new Error('attemptId là bắt buộc.');

    try {
        const response = await apiClient.post('', null, {
            params: {
                ...apiClient.defaults.params,
                wsfunction: 'mod_quiz_get_attempt_data',
                attemptid: attemptId,
                page: page,
            },
        });
        if (response.data && response.data.exception) {
            console.error('Lỗi API Moodle:', response.data);
            throw new Error(response.data.message || 'Lỗi không xác định từ Moodle API');
        }
        console.log('Kết quả getAttemptData:', response.data);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi getAttemptData:', error.response?.data || error.message);
        throw error;
    }
};

export const processAttempt = async (attemptId, data = [], finishAttempt = false) => {
    const action = finishAttempt ? 'Nộp bài' : 'Lưu tạm';
    console.log(`Gọi API: mod_quiz_process_attempt (${action}) với attemptId: ${attemptId}`);
    if (!attemptId) throw new Error('attemptId là bắt buộc.');
    if (!Array.isArray(data)) throw new Error('data phải là một mảng.');

    const dataParams = data.reduce((acc, item, index) => {
        acc[`data[${index}][name]`] = item.name;
        acc[`data[${index}][value]`] = item.value;
        return acc;
    }, {});

    try {
        const response = await apiClient.post('', null, {
            params: {
                ...apiClient.defaults.params,
                wsfunction: 'mod_quiz_process_attempt',
                attemptid: attemptId,
                finishattempt: finishAttempt ? 1 : 0,
                ...dataParams,
            },
        });
        if (response.data && response.data.exception) {
            console.error('Lỗi API Moodle:', response.data);
            throw new Error(response.data.message || 'Lỗi không xác định từ Moodle API');
        }
        console.log(`Kết quả processAttempt (${action}):`, response.data); // Thường là { state: 'inprogress' | 'finished', warnings: [] }
        if (response.data.warnings && response.data.warnings.length > 0) {
            console.warn(`Cảnh báo từ processAttempt (${action}):`, response.data.warnings);
        }
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi gọi processAttempt (${action}):`, error.response?.data || error.message);
        throw error;
    }
};

export const saveAttemptData = async (attemptId, data = []) => {
    return processAttempt(attemptId, data, false);
};

export const getAttemptReview = async (attemptId, page = -1) => {
    console.log(`Gọi API: mod_quiz_get_attempt_review với attemptId: ${attemptId}, page: ${page}`);
    if (!attemptId) throw new Error('attemptId là bắt buộc.');

    try {
        const response = await apiClient.post('', null, {
            params: {
                ...apiClient.defaults.params,
                wsfunction: 'mod_quiz_get_attempt_review',
                attemptid: attemptId,
                page: page,
            },
        });
        if (response.data && response.data.exception) {
            console.error('Lỗi API Moodle:', response.data);
            throw new Error(response.data.message || 'Lỗi không xác định từ Moodle API');
        }

        if (response.data && response.data.errorcode) {
            console.error('Lỗi khi lấy review:', response.data);
            throw new Error(response.data.message || response.data.errorcode);
        }
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi getAttemptReview:', error.response?.data || error.message);
        throw error;
    }
};

export const getUserAttempts = async (quizId, status = 'unfinished', includePreviews = false) => {
    if (!quizId) throw new Error('quizId là bắt buộc cho getUserAttempts.');

    try {
        const response = await apiClient.post('', null, {
            params: {
                ...apiClient.defaults.params,
                wsfunction: 'mod_quiz_get_user_attempts',
                quizid: quizId,
                status: status,
                includepreviews: includePreviews ? 1 : 0,
            },
        });
        if (response.data && response.data.exception) {
            console.error('Lỗi API Moodle (getUserAttempts):', response.data);
            throw new Error(response.data.message || 'Lỗi không xác định từ Moodle API');
        }

        if (response.data && response.data.errorcode) {
            console.error('Lỗi khi lấy user attempts:', response.data);
            throw new Error(response.data.message || response.data.errorcode);
        }
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi getUserAttempts:', error.response?.data || error.message);
        throw error;
    }
};

const getToken = async (username, password) => {
    if (!MOODLE_URL || !MOODLE_SERVICE_SHORTNAME) {
        console.error('Lỗi: MOODLE_URL hoặc MOODLE_SERVICE_SHORTNAME chưa được cấu hình trong moodleApi.js');
        throw new Error('Cấu hình Moodle API chưa hoàn chỉnh.');
    }

    const tokenUrl = `${MOODLE_URL}/login/token.php`;

    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    params.append('service', MOODLE_SERVICE_SHORTNAME);

    try {
        const response = await axios.post(tokenUrl, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (response.data && response.data.token) {
            return response.data.token;
        } else if (response.data && (response.data.error || response.data.exception)) {
            console.error('Lỗi API Moodle (getToken):', response.data);
            throw new Error(response.data.error || response.data.exception || 'Thông tin đăng nhập không hợp lệ hoặc lỗi dịch vụ Moodle.');
        } else {
            console.error('Phản hồi không mong đợi từ getToken:', response.data);
            throw new Error('Không thể lấy token. Phản hồi không hợp lệ từ Moodle.');
        }
    } catch (error) {
        console.error('Lỗi mạng hoặc lỗi khác khi gọi getToken:', error.response?.data || error.message);
        if (error.response && error.response.status === 404) {
            throw new Error(`Không tìm thấy endpoint đăng nhập Moodle tại ${tokenUrl}. Vui lòng kiểm tra lại MOODLE_URL.`);
        }
        throw new Error(error.response?.data?.error || error.message || 'Không thể kết nối đến máy chủ Moodle hoặc đã xảy ra lỗi.');
    }
};

const getMyEnrolledCourses = async (classification = 'inprogress', limit = 0, offset = 0) => {
    console.log(`Gọi API: core_course_get_enrolled_courses_by_timeline_classification với classification: ${classification}`);

    const currentToken = localStorage.getItem('moodleToken');
    if (!currentToken) {
        console.error("Lỗi: Không tìm thấy token trong localStorage để gọi getMyEnrolledCourses.");
        throw new Error("Người dùng chưa đăng nhập hoặc token không tồn tại.");
    }

    try {
        const response = await apiClient.post('', null, {
            params: {
                wstoken: currentToken,       // <<<--- Sử dụng token hiện tại
                wsfunction: 'core_course_get_enrolled_courses_by_timeline_classification',
                classification: classification,
                limit: limit,
                offset: offset,
                // sort: 'fullname' // Có thể thêm sắp xếp nếu muốn
            },
        });

        // Xử lý phản hồi
        if (response.data && response.data.exception) {
            if (response.data.errorcode === 'invalidtoken') {
                console.error("Lỗi token không hợp lệ khi gọi getMyEnrolledCourses.");
            }
            throw new Error(response.data.message || 'Lỗi không xác định từ Moodle API khi lấy khóa học.');
        }

        if (response.data && Array.isArray(response.data.courses)) {
            return response.data.courses;
        } else {
            console.error('Phản hồi không mong đợi từ getMyEnrolledCourses:', response.data);
            throw new Error('Không thể lấy danh sách khóa học. Phản hồi không hợp lệ từ Moodle.');
        }
    } catch (error) {
        console.error('Lỗi khi gọi getMyEnrolledCourses:', error.response?.data || error.message);
        throw error;
    }
};

const getCourseContents = async (courseId) => {
    console.log(`Gọi API: core_course_get_contents cho courseId: ${courseId}`);

    // Lấy token từ localStorage
    const currentToken = localStorage.getItem('moodleToken');
    if (!currentToken) {
        console.error("Lỗi: Không tìm thấy token trong localStorage để gọi getCourseContents.");
        throw new Error("Người dùng chưa đăng nhập hoặc token không tồn tại.");
    }

    if (!courseId || typeof courseId !== 'number' || courseId <= 0) {
        throw new Error("courseId không hợp lệ.");
    }

    try {
        const response = await apiClient.post('', null, {
            params: {
                wstoken: currentToken,
                wsfunction: 'core_course_get_contents',
                courseid: courseId,
                // options: [] // Có thể thêm options nếu cần lọc nội dung cụ thể
            },
        });

        // Xử lý phản hồi
        if (response.data && response.data.exception) {
            if (response.data.errorcode === 'invalidtoken') {
                console.error(`Lỗi token không hợp lệ khi gọi getCourseContents cho courseId: ${courseId}.`);
                // Xử lý đặc biệt nếu cần (vd: logout)
            }
            throw new Error(response.data.message || `Lỗi API khi lấy nội dung khóa học ID ${courseId}.`);
        }

        if (response.data && Array.isArray(response.data)) {
            // Thành công, trả về mảng các sections
            console.log(`Lấy nội dung thành công cho courseId: ${courseId}`);
            return response.data;
        } else {
            console.error(`Phản hồi không mong đợi từ getCourseContents cho courseId ${courseId}:`, response.data);
            throw new Error(`Phản hồi không hợp lệ từ Moodle khi lấy nội dung khóa học ID ${courseId}.`);
        }
    } catch (error) {
        console.error(`Lỗi khi gọi getCourseContents cho courseId ${courseId}:`, error.response?.data || error.message);
        // Ném lại lỗi để hàm gọi chính xử lý
        throw error;
    }
};


// --- HÀM CHÍNH: Lấy nội dung cho nhiều khóa học ---
/**
 * Lấy nội dung (sections và modules) cho một danh sách khóa học ID cụ thể,
 * hoặc cho tất cả các khóa học đang tham gia của người dùng hiện tại.
 *
 * @param {number[] | null} [courseIds=null] Mảng các ID khóa học muốn lấy nội dung.
 * Nếu là null hoặc mảng rỗng, hàm sẽ tự động lấy ID các khóa học đang tham gia ('inprogress').
 * @returns {Promise<object>} Promise chứa một object với key là courseId và value là mảng các section của khóa học đó.
 * Ví dụ: { courseId1: [section1, section2,...], courseId2: [...] }. Trả về object rỗng nếu không có khóa học nào.
 */
const getCoursesContents = async (courseIds = null) => {
    console.log('Bắt đầu lấy nội dung cho các khóa học:', courseIds ? `IDs cụ thể: ${courseIds.join(', ')}` : 'Các khóa đang tham gia');

    let targetCourseIds = [];

    // --- Bước 1: Xác định danh sách Course ID cần lấy nội dung ---
    try {
        if (Array.isArray(courseIds) && courseIds.length > 0) {
            // Sử dụng danh sách ID được cung cấp
            targetCourseIds = courseIds.filter(id => typeof id === 'number' && id > 0); // Lọc ID hợp lệ
            console.log('Sử dụng danh sách courseIds được cung cấp:', targetCourseIds);
        } else {
            // Nếu không có courseIds, lấy danh sách khóa học đang tham gia
            console.log('Không có courseIds, đang lấy danh sách khóa học đang tham gia...');
            // Đảm bảo getMyEnrolledCourses đã được sửa để lấy token động
            const enrolledCourses = await getMyEnrolledCourses('inprogress');
            targetCourseIds = enrolledCourses.map(course => course.id);
            console.log('Các khóa học đang tham gia:', targetCourseIds);
        }
    } catch (error) {
        console.error('Lỗi khi xác định danh sách khóa học:', error);
        // Ném lỗi ra ngoài để component gọi xử lý
        throw new Error(`Không thể xác định danh sách khóa học cần lấy nội dung: ${error.message}`);
    }


    // Nếu không có ID khóa học nào để xử lý, trả về object rỗng
    if (targetCourseIds.length === 0) {
        console.log('Không có khóa học nào để lấy nội dung.');
        return {};
    }

    // --- Bước 2: Lặp qua từng Course ID và gọi hàm phụ trợ để lấy nội dung ---
    const allContents = {}; // Object để lưu kết quả cuối cùng
    console.log(`Bắt đầu lấy nội dung cho ${targetCourseIds.length} khóa học...`);

    // Sử dụng vòng lặp for...of để gọi tuần tự (tránh làm quá tải API nếu nhiều khóa học)
    for (const id of targetCourseIds) {
        try {
            // Gọi hàm phụ trợ cho từng ID
            const courseContent = await getCourseContents(id);
            // Lưu kết quả vào object, key là courseId
            allContents[id] = courseContent;
        } catch (error) {
            // Nếu lỗi khi lấy nội dung của MỘT khóa học, ghi lại lỗi và tiếp tục với khóa học khác
            console.error(`Không thể lấy nội dung cho khóa học ID ${id}:`, error.message);
            // Có thể đánh dấu lỗi cho khóa học này trong kết quả nếu muốn
            allContents[id] = { error: `Lỗi: ${error.message}` }; // Hoặc gán null, hoặc bỏ qua
        }
    }

    return allContents; // Trả về object chứa nội dung của các khóa học đã lấy thành công
};

const getVideoInstance = async (id) => {
    const response = await apiClient.post('', null, {
        params: {
            wstoken: MOODLE_TOKEN,
            wsfunction: 'local_supervideoapi_get_supervideo_by_id',
            id
        },
    });

    if (response.data && response.data.exception) {
        throw new Error(response.data.message || `Lỗi API khi lấy video${id}.`);
    }

    return response.data;
}

const getVideoView = async (id) => {
    const response = await apiClient.post('', null, {
        params: {
            wstoken: MOODLE_TOKEN,
            wsfunction: 'local_supervideoapi_get_views_by_cm_id',
            cm_id: id,
        },
    });

    if (response.data && response.data.exception) {
        throw new Error(response.data.message || `Lỗi API khi lấy video${id}.`);
    }

    return response.data;
}

const updateVideoView = async (viewId, currentTime, duration, percent, mapa) => {
    const response = await apiClient.post('', null, {
        params: {
            wstoken: MOODLE_TOKEN,
            wsfunction: 'mod_supervideo_progress_save',
            view_id: viewId,
            currenttime: currentTime,
            duration,
            percent,
            mapa: JSON.stringify(mapa),
        },
    });

    if (response.data && response.data.exception) {
        throw new Error(response.data.message || `Lỗi API khi cập nhật view ${viewId}.`);
    }

    return response.data;
}

const getCourseById = async (courseId) => {
    console.log(`Gọi API: core_course_get_courses cho courseId: ${courseId}`);

    const currentToken = localStorage.getItem('moodleToken');
    if (!currentToken) {
        console.error("Lỗi: Không tìm thấy token trong localStorage để gọi getCourseById.");
        throw new Error("Người dùng chưa đăng nhập hoặc token không tồn tại.");
    }

    if (!courseId || typeof courseId !== 'number' || courseId <= 0) {
        throw new Error("courseId không hợp lệ.");
    }

    try {
        const response = await apiClient.post('', null, {
            params: {
                wstoken: currentToken,
                wsfunction: 'core_course_get_courses',
                moodlewsrestformat: 'json',
                'options[ids][0]': courseId,
            },
        });

        if (response.data && response.data.exception) {
            if (response.data.errorcode === 'invalidtoken') {
                console.error(`Token không hợp lệ khi gọi getCourseById cho courseId: ${courseId}.`);
            }
            throw new Error(response.data.message || `Lỗi API khi lấy thông tin khóa học ID ${courseId}.`);
        }

        if (Array.isArray(response.data) && response.data.length > 0) {
            console.log(`Lấy thông tin thành công cho courseId: ${courseId}`);
            return response.data[0]; // Vì API trả về mảng, lấy phần tử đầu tiên
        } else {
            throw new Error(`Không tìm thấy thông tin khóa học với ID ${courseId}.`);
        }
    } catch (error) {
        console.error(`Lỗi khi gọi getCourseById cho courseId ${courseId}:`, error.response?.data || error.message);
        throw error;
    }
};

const getQuizAttemptSummary = async (attemptId) => {
    console.log(`Gọi API: mod_quiz_get_attempt_summary cho attemptId: ${attemptId}`);

    const currentToken = localStorage.getItem('moodleToken');
    if (!currentToken) {
        console.error("Lỗi: Không tìm thấy token trong localStorage.");
        throw new Error("Người dùng chưa đăng nhập hoặc token không tồn tại.");
    }

    if (!attemptId || typeof attemptId !== 'number' || attemptId <= 0) {
        throw new Error("attemptId không hợp lệ.");
    }

    try {
        const response = await apiClient.post('', null, {
            params: {
                wstoken: currentToken,
                wsfunction: 'mod_quiz_get_attempt_summary',
                moodlewsrestformat: 'json',
                attemptid: attemptId
            },
        });

        if (response.data && response.data.exception) {
            if (response.data.errorcode === 'invalidtoken') {
                console.error(`Token không hợp lệ khi gọi mod_quiz_get_attempt_summary.`);
            }
            throw new Error(response.data.message || 'Lỗi khi gọi API mod_quiz_get_attempt_summary');
        }

        console.log(`Lấy attempt summary thành công cho attemptId: ${attemptId}`);
        return response.data;

    } catch (error) {
        console.error(`Lỗi khi gọi getQuizAttemptSummary với attemptId ${attemptId}:`, error.response?.data || error.message);
        throw error;
    }
};

const finishQuizAttempt = async (attemptId, timeUp = false) => {
    console.log(`Gọi API: mod_quiz_process_attempt để kết thúc attemptId: ${attemptId}`);

    const currentToken = localStorage.getItem('moodleToken');
    if (!currentToken) {
        console.error("Lỗi: Không tìm thấy token trong localStorage.");
        throw new Error("Người dùng chưa đăng nhập hoặc token không tồn tại.");
    }

    if (!attemptId || typeof attemptId !== 'number' || attemptId <= 0) {
        throw new Error("attemptId không hợp lệ.");
    }

    try {
        const response = await apiClient.post('', null, {
            params: {
                wstoken: currentToken,
                wsfunction: 'mod_quiz_process_attempt',
                moodlewsrestformat: 'json',
                attemptid: attemptId,
                finishattempt: 1,
                timeup: timeUp ? 1 : 0
            },
        });

        if (response.data && response.data.exception) {
            if (response.data.errorcode === 'invalidtoken') {
                console.error(`Token không hợp lệ khi gọi mod_quiz_process_attempt.`);
            }
            throw new Error(response.data.message || 'Lỗi khi gọi API mod_quiz_process_attempt');
        }

        console.log(`Kết thúc attempt thành công cho attemptId: ${attemptId}`);
        return response.data;

    } catch (error) {
        console.error(`Lỗi khi gọi finishQuizAttempt với attemptId ${attemptId}:`, error.response?.data || error.message);
        throw error;
    }
};

const getUserCourseReport = async ({ userIds = [], courseId = null }) => {
    const currentToken = localStorage.getItem('moodleToken');
    if (!currentToken) {
        throw new Error("Người dùng chưa đăng nhập hoặc token không tồn tại.");
    }

    if (!Array.isArray(userIds) || userIds.length === 0) {
        throw new Error("Danh sách userIds phải là mảng và không được rỗng.");
    }

    // Chuẩn bị dữ liệu form
    const formData = new URLSearchParams();
    formData.append('wstoken', currentToken);
    formData.append('wsfunction', 'local_usercoursereport_get_course_report');
    formData.append('moodlewsrestformat', 'json');

    // Thêm userids dạng userids[0], userids[1], ...
    userIds.forEach((id, index) => {
        formData.append(`userids[${index}]`, id);
    });

    // Thêm courseid nếu có
    if (courseId) {
        formData.append('courseid', courseId);
    }

    try {
        const response = await apiClient.post('', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (response.data && response.data.exception) {
            throw new Error(response.data.message || 'Lỗi khi gọi local_usercoursereport_get_course_report');
        }

        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi getUserCourseReport:', error.response?.data || error.message);
        throw error;
    }
};

const getUserInfoById = async (userId) => {
    console.log(`Gọi API: core_user_get_users để lấy thông tin userId: ${userId}`);

    const currentToken = localStorage.getItem('moodleToken');
    if (!currentToken) {
        console.error("Lỗi: Không tìm thấy token trong localStorage.");
        throw new Error("Người dùng chưa đăng nhập hoặc token không tồn tại.");
    }

    if (!userId || typeof userId !== 'number' || userId <= 0) {
        throw new Error("userId không hợp lệ.");
    }

    try {
        const response = await apiClient.post('', null, {
            params: {
                wstoken: currentToken,
                wsfunction: 'core_user_get_users',
                moodlewsrestformat: 'json',
                'criteria[0][key]': 'id',
                'criteria[0][value]': userId,
            },
        });

        if (response.data && response.data.exception) {
            if (response.data.errorcode === 'invalidtoken') {
                console.error(`Token không hợp lệ khi gọi core_user_get_users.`);
            }
            throw new Error(response.data.message || 'Lỗi khi gọi API core_user_get_users');
        }

        const user = response.data.users?.[0];
        if (!user) {
            throw new Error(`Không tìm thấy người dùng với ID ${userId}`);
        }

        console.log(`Lấy thông tin thành công cho userId: ${userId}`);
        return user;

    } catch (error) {
        console.error(`Lỗi khi gọi getUserInfoById với userId ${userId}:`, error.response?.data || error.message);
        throw error;
    }
};

const updateUserPassword = async (userId, password) => {
    console.log(`Gọi API: core_user_update_users để cập nhật thông tin userId: ${userId}`);

    const currentToken = localStorage.getItem('moodleToken');
    if (!currentToken) {
        console.error("Lỗi: Không tìm thấy token trong localStorage.");
        throw new Error("Người dùng chưa đăng nhập hoặc token không tồn tại.");
    }

    if (!userId || typeof userId !== 'number' || userId <= 0) {
        throw new Error("userId không hợp lệ.");
    }

    try {
        const response = await apiClient.post('', null, {
            params: {
                wstoken: currentToken,
                wsfunction: 'core_user_update_users',
                moodlewsrestformat: 'json',
                'users[0][id]': userId,
                'users[0][password]': password,
            },
        });

        if (response.data && response.data.exception) {
            if (response.data.errorcode === 'invalidtoken') {
                console.error(`Token không hợp lệ khi gọi core_user_update_users.`);
            }
            throw new Error(response.data.message || 'Lỗi khi gọi API core_user_update_users');
        }

        console.log(`Cập nhật thông tin thành công cho userId: ${userId}`);
        return response.data;

    } catch (error) {
        console.error(`Lỗi khi gọi updateUser với userId ${userId}:`, error.response?.data || error.message);
        throw error;
    }
}

const getForumDiscussions = async (forumId) => {
    console.log(`Gọi API: mod_forum_get_forum_discussions để lấy danh sách thảo luận cho forumId: ${forumId}`);

    const currentToken = localStorage.getItem('moodleToken');
    if (!currentToken) {
        console.error("Lỗi: Không tìm thấy token trong localStorage.");
        throw new Error("Người dùng chưa đăng nhập hoặc token không tồn tại.");
    }

    if (!forumId || typeof forumId !== 'number' || forumId <= 0) {
        throw new Error("forumId không hợp lệ.");
    }

    try {
        const response = await apiClient.post('', null, {
            params: {
                wstoken: currentToken,
                wsfunction: 'mod_forum_get_forum_discussions',
                moodlewsrestformat: 'json',
                forumid: forumId,
            },
        });

        if (response.data && response.data.exception) {
            if (response.data.errorcode === 'invalidtoken') {
                console.error(`Token không hợp lệ khi gọi mod_forum_get_forum_discussions.`);
            }
            throw new Error(response.data.message || 'Lỗi khi gọi API mod_forum_get_forum_discussions');
        }

        const discussions = response.data.discussions;
        if (!Array.isArray(discussions)) {
            throw new Error(`Không lấy được danh sách thảo luận cho forumId ${forumId}`);
        }

        console.log(`Lấy danh sách thảo luận thành công cho forumId: ${forumId}`);
        return discussions;

    } catch (error) {
        console.log(error)
        console.error(`Lỗi khi gọi getForumDiscussions với forumId ${forumId}:`, error.response?.data || error.message);
        throw error;
    }
};

const getDiscussionPosts = async (discussionId) => {
    console.log(`Gọi API: mod_forum_get_discussion_posts để lấy danh sách phản hồi cho discussionId: ${discussionId}`);

    const currentToken = localStorage.getItem('moodleToken');
    if (!currentToken) {
        console.error("Lỗi: Không tìm thấy token trong localStorage.");
        throw new Error("Người dùng chưa đăng nhập hoặc token không tồn tại.");
    }

    if (!discussionId || typeof discussionId !== 'number' || discussionId <= 0) {
        throw new Error("discussionId không hợp lệ.");
    }

    try {
        const response = await apiClient.post('', null, {
            params: {
                wstoken: currentToken,
                wsfunction: 'mod_forum_get_discussion_posts',
                moodlewsrestformat: 'json',
                discussionid: discussionId,
            },
        });

        if (response.data && response.data.exception) {
            if (response.data.errorcode === 'invalidtoken') {
                console.error(`Token không hợp lệ khi gọi mod_forum_get_discussion_posts.`);
            }
            throw new Error(response.data.message || 'Lỗi khi gọi API mod_forum_get_discussion_posts');
        }

        const posts = response.data.posts;
        if (!Array.isArray(posts)) {
            throw new Error(`Không lấy được danh sách phản hồi cho discussionId ${discussionId}`);
        }

        console.log(`Lấy danh sách phản hồi thành công cho discussionId: ${discussionId}`);
        return posts;

    } catch (error) {
        console.error(`Lỗi khi gọi getDiscussionPosts với discussionId ${discussionId}:`, error.response?.data || error.message);
        throw error;
    }
};

const getDiscussionPost = async (postId) => {
    console.log(`Gọi API: mod_forum_get_discussion_post để lấy danh sách bài viết cho postId: ${postId}`);

    const currentToken = localStorage.getItem('moodleToken');
    if (!currentToken) {
        console.error("Lỗi: Không tìm thấy token trong localStorage.");
        throw new Error("Người dùng chưa đăng nhập hoặc token không tồn tại.");
    }

    if (!postId || typeof postId !== 'number' || postId <= 0) {
        throw new Error("postId không hợp lệ.");
    }

    try {
        const response = await apiClient.post('', null, {
            params: {
                wstoken: currentToken,
                wsfunction: 'mod_forum_get_discussion_post',
                moodlewsrestformat: 'json',
                postid: postId,
            },
        });

        if (response.data && response.data.exception) {
            if (response.data.errorcode === 'invalidtoken') {
                console.error(`Token không hợp lệ khi gọi mod_forum_get_discussion_post.`);
            }
            throw new Error(response.data.message || 'Lỗi khi gọi API mod_forum_get_discussion_post');
        }

        const posts = response.data.posts;
        if (!Array.isArray(posts)) {
            throw new Error(`Không lấy được danh sách bài viết cho postId ${postId}`);
        }

        console.log(`Lấy danh sách bài viết thành công cho postId: ${postId}`);
        return posts;

    } catch (error) {
        console.log(error)
        console.error(`Lỗi khi gọi getDiscussionPosts với postId ${postId}:`, error.response?.data || error.message);
        throw error;
    }
};

const viewBookChapter = async (bookId, chapterId = 0) => {
    console.log(`Gọi API: mod_book_view_book với bookId: ${bookId}, chapterId: ${chapterId}`);

    const currentToken = localStorage.getItem('moodleToken');
    if (!currentToken) {
        console.error("Lỗi: Không tìm thấy token trong localStorage.");
        throw new Error("Người dùng chưa đăng nhập hoặc token không tồn tại.");
    }

    if (!bookId || typeof bookId !== 'number' || bookId <= 0) {
        throw new Error("bookId không hợp lệ.");
    }

    try {
        const response = await apiClient.post('', null, {
            params: {
                wstoken: currentToken,
                wsfunction: 'mod_book_view_book',
                moodlewsrestformat: 'json',
                bookid: bookId,
                chapterid: chapterId,
            },
        });

        if (response.data && response.data.exception) {
            if (response.data.errorcode === 'invalidtoken') {
                console.error(`Token không hợp lệ khi gọi mod_book_view_book.`);
            }
            throw new Error(response.data.message || 'Lỗi khi gọi API mod_book_view_book');
        }

        console.log(`Đã gọi API view thành công cho bookId: ${bookId}, chapterId: ${chapterId}`);
        return response.data;

    } catch (error) {
        console.error(`Lỗi khi gọi viewBookChapter với bookId ${bookId}, chapterId ${chapterId}:`, error.response?.data || error.message);
        throw error;
    }
};

const getCoursesCompletionStatus = async (courseIds = [], userId) => {
    console.log(`Gọi API: core_completion_get_activities_completion_status cho các khóa học: [${courseIds.join(', ')}], userId: ${userId}`);

    const currentToken = localStorage.getItem('moodleToken');
    if (!currentToken) {
        console.error("Lỗi: Không tìm thấy token trong localStorage.");
        throw new Error("Người dùng chưa đăng nhập hoặc token không tồn tại.");
    }

    if (!Array.isArray(courseIds) || courseIds.length === 0) {
        throw new Error("Danh sách courseId không hợp lệ.");
    }

    if (!userId || typeof userId !== 'number' || userId <= 0) {
        throw new Error("userId không hợp lệ.");
    }

    const result = {};

    try {
        for (const courseId of courseIds) {
            const response = await apiClient.post('', null, {
                params: {
                    wstoken: currentToken,
                    wsfunction: 'core_completion_get_activities_completion_status',
                    moodlewsrestformat: 'json',
                    courseid: courseId,
                    userid: userId,
                },
            });

            if (response.data && response.data.exception) {
                if (response.data.errorcode === 'invalidtoken') {
                    console.error(`Token không hợp lệ khi gọi core_completion_get_activities_completion_status.`);
                }
                throw new Error(response.data.message || 'Lỗi khi gọi API core_completion_get_activities_completion_status');
            }

            result[courseId] = response.data.statuses || [];
        }

        console.log("Lấy completion status thành công cho các khóa học:", courseIds);
        return result; // { [courseId]: [activities] }

    } catch (error) {
        console.error(`Lỗi khi gọi getBooksCompletionStatusForCourses:`, error.response?.data || error.message);
        throw error;
    }
};

const addDiscussionReply = async ({ postId, subject, message }) => {
    console.log(`Gọi API: mod_forum_add_discussion_post với postId: ${postId}`);

    const currentToken = localStorage.getItem('moodleToken');
    if (!currentToken) {
        console.error("Lỗi: Không tìm thấy token trong localStorage.");
        throw new Error("Người dùng chưa đăng nhập hoặc token không tồn tại.");
    }

    if (!postId || typeof postId !== 'number' || postId <= 0) {
        throw new Error("postId không hợp lệ.");
    }

    if (!subject || !message) {
        throw new Error("Chủ đề (subject) và nội dung (message) là bắt buộc.");
    }

    try {
        const response = await apiClient.post('', null, {
            params: {
                wstoken: currentToken,
                wsfunction: 'mod_forum_add_discussion_post',
                moodlewsrestformat: 'json',
                postid: postId,
                subject: subject,
                message: message,
            },
        });

        if (response.data && response.data.exception) {
            if (response.data.errorcode === 'invalidtoken') {
                console.error(`Token không hợp lệ khi gọi mod_forum_add_discussion_post.`);
            }
            throw new Error(response.data.message || 'Lỗi khi gọi API mod_forum_add_discussion_post');
        }

        console.log(`Đã gọi API thành công: Đăng bài trong forum với postId: ${postId}`);
        return response.data;

    } catch (error) {
        console.error(`Lỗi khi gọi addDiscussionReply với postId ${postId}:`, error.response?.data || error.message);
        throw error;
    }
};

const moodleApi = {
    getSiteInfo,
    getQuizzesByCourses,
    startQuizAttempt,
    getAttemptData,
    processAttempt,
    saveAttemptData,
    getAttemptReview,
    getUserAttempts,
    getToken,
    getMyEnrolledCourses,
    getCourseContents,
    getCoursesContents,
    getVideoInstance,
    getVideoView,
    updateVideoView,
    getCourseById,
    getQuizAttemptSummary,
    finishQuizAttempt,
    getUserCourseReport,
    getUserInfoById,
    updateUserPassword,
    getForumDiscussions,
    getDiscussionPosts,
    getDiscussionPost,
    viewBookChapter,
    getCoursesCompletionStatus,
    addDiscussionReply,
};
export default moodleApi;
