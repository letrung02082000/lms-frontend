export const DRIVING_STATE = {
    CREATED: 0,
    WAITING_CHANGE: 1,
    WAITING_PAYMENT: 2,
    APPROVED: 5,
    HEALTH_CHECKED: 6,
    HAS_FILE: 8,
    WAITING_FOR_SCHEDULE: 7,
    FINISHED: 3,
    CANCELED: 4,
}

export const DRIVING_STATE_LABEL = {
    [DRIVING_STATE.CREATED]: "Đã tạo",
    [DRIVING_STATE.WAITING_CHANGE]: "Chờ cập nhật",
    [DRIVING_STATE.WAITING_PAYMENT]: "Chờ thanh toán",
    [DRIVING_STATE.APPROVED]: "Đã duyệt",
    [DRIVING_STATE.HAS_FILE]: "Đã có hồ sơ",
    [DRIVING_STATE.HEALTH_CHECKED]: "Đã khám sức khoẻ",
    [DRIVING_STATE.WAITING_FOR_SCHEDULE]: "Chờ xếp lịch",
    [DRIVING_STATE.FINISHED]: "Đã hoàn tất",
    [DRIVING_STATE.CANCELED]: "Đã hủy",
}
