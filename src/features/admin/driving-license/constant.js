export const DRIVING_STATE = {
    CREATED: 0,
    WAITING_CHANGE: 1,
    WAITING_PAYMENT: 2,
    APPROVED: 5,
    HEALTH_CHECKED: 6,
    FINISHED: 3,
    CANCELED: 4,
}

export const DRIVING_STATE_LABEL = {
    [DRIVING_STATE.CREATED]: "Đã tạo",
    [DRIVING_STATE.WAITING_CHANGE]: "Chờ cập nhật",
    [DRIVING_STATE.WAITING_PAYMENT]: "Chờ thanh toán",
    [DRIVING_STATE.APPROVED]: "Đã duyệt",
    [DRIVING_STATE.HEALTH_CHECKED]: "Đã khám sức khoẻ",
    [DRIVING_STATE.FINISHED]: "Đã hoàn tất",
    [DRIVING_STATE.CANCELED]: "Đã hủy",
}
