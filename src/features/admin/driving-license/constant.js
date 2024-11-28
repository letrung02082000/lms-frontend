export const DRIVING_STATE = {
    CREATED: 0,
    INVALID_PORTRAIT: 1,
    INVALID_CARD: 10,
    INVALID_AGE: 9,
    WAITING_PAYMENT: 2,
    APPROVED: 5,
    HAS_FILE: 8,
    HEALTH_CHECKED: 6,
    WAITING_FOR_SCHEDULE: 7,
    FINISHED: 3,
    CANCELED: 4,
}

export const DRIVING_STATE_LABEL = {
    [DRIVING_STATE.CREATED]: "Đã tạo",
    [DRIVING_STATE.INVALID_PORTRAIT]: "Chân dung chưa hợp lệ",
    [DRIVING_STATE.INVALID_CARD]: "CCCD chưa hợp lệ",
    [DRIVING_STATE.INVALID_AGE]: "Chưa đủ tuổi",
    [DRIVING_STATE.WAITING_PAYMENT]: "Chờ thanh toán",
    [DRIVING_STATE.APPROVED]: "Đã duyệt",
    [DRIVING_STATE.HAS_FILE]: "Đã có hồ sơ",
    [DRIVING_STATE.HEALTH_CHECKED]: "Đã khám sức khoẻ",
    [DRIVING_STATE.WAITING_FOR_SCHEDULE]: "Chờ xếp lịch",
    [DRIVING_STATE.FINISHED]: "Đã hoàn tất",
    [DRIVING_STATE.CANCELED]: "Đã hủy hồ sơ",
}
