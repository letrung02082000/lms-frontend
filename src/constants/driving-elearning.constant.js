const ELEARNING_ROLES = {
    admin: 'Quản trị viên',
    manager: 'Quản lý lớp học',
    student: 'Học viên',
    editingteacher: 'Giáo viên',
}

const QUIZ_ATTEMPT_STATUS = {
    inprogress: 'Đang làm bài',
    finished: 'Đã thực hiện',
    overdue: 'Quá hạn',
    suspended: 'Tạm dừng',
    notattempted: 'Chưa làm bài',
}

const QUIZ_GRADE_STATUS = {
    gradedwrong: 'Trả lời sai',
    gradedright: 'Trả lời đúng',
    gaveup: 'Không trả lời',
}

const COURSE_MODULES = {
    quiz: 'Bài kiểm tra',
    supervideo: 'Bài giảng',
    url: 'Liên kết',
    resource: 'Tài liệu',
    page: 'Trang',
    forum: 'Diễn đàn',
    book: 'Nội dung',
}

export {
    ELEARNING_ROLES,
    QUIZ_ATTEMPT_STATUS,
    COURSE_MODULES,
    QUIZ_GRADE_STATUS
}
