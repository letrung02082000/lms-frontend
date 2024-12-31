export const DRIVING_STATE = {
    CREATED: 0,
    WAITING_PAYMENT: 2,
    WAITING_CHANGE: 1,
    APPROVED: 5,
    HAS_FILE_1: 8,
    HAS_FILE_2: 9,
    HEALTH_CHECKED: 6,
    WAITING_FOR_SCHEDULE: 7,
    FINISHED: 3,
    RECEIVED: 10,
    CANCELED: 4,
}

export const DRIVING_STATE_LABEL = {
    [DRIVING_STATE.CREATED]: "Đã tạo",
    [DRIVING_STATE.WAITING_CHANGE]: "Chờ cập nhật",
    [DRIVING_STATE.WAITING_PAYMENT]: "Chờ thanh toán",
    [DRIVING_STATE.APPROVED]: "Đã duyệt",
    [DRIVING_STATE.HAS_FILE_1]: "Đã có hồ sơ 1",
    [DRIVING_STATE.HAS_FILE_2]: "Đã có hồ sơ 2",
    [DRIVING_STATE.HAS_FILE_3]: "Đã có hồ sơ 3",
    [DRIVING_STATE.HEALTH_CHECKED]: "Đã khám sức khoẻ",
    [DRIVING_STATE.WAITING_FOR_SCHEDULE]: "Chờ xếp lịch",
    [DRIVING_STATE.FINISHED]: "Đã hoàn tất",
    [DRIVING_STATE.RECEIVED]: "Đã nhận bằng",
    [DRIVING_STATE.CANCELED]: "Đã hủy hồ sơ",
}

export const DRIVING_TYPE = {
    A1: 0,
    A: 1,
    OTHER: 2,
}

export const DRIVING_TYPE_LABEL = {
    [DRIVING_TYPE.A1]: "A1",
    [DRIVING_TYPE.A]: "A",
    [DRIVING_TYPE.OTHER]: "Khác",
}
