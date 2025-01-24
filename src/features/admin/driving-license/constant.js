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
    [DRIVING_STATE.HEALTH_CHECKED]: "Đã khám SK",
    [DRIVING_STATE.WAITING_FOR_SCHEDULE]: "Chờ xếp lịch",
    [DRIVING_STATE.FINISHED]: "Đã hoàn tất",
    [DRIVING_STATE.RECEIVED]: "Đã nhận bằng",
    [DRIVING_STATE.CANCELED]: "Đã hủy",
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

export const IDENTITY_CARD_TYPE = {
    CHIP_ID_CARD_FRONT: 'chip_id_card_front',
    CHIP_ID_CARD_BACK: 'chip_id_card_back',
    CHIP_ID_CARD_2024_FRONT: 'chip_id_card_2024_front',
    CHIP_ID_CARD_2024_BACK: 'chip_id_card_2024_back',
}

export const PAYMENT_METHODS = {
    BANK_TRANSFER: 'transfer',
    DIRECT: 'direct',
}

export const PAYMENT_METHODS_LABEL = {
    [PAYMENT_METHODS.BANK_TRANSFER]: 'Chuyển khoản ngân hàng',
    [PAYMENT_METHODS.DIRECT]: 'Thanh toán trực tiếp',
}

export const DOWNLOAD_OPTIONS = {
    DOWNLOAD_STUDENT_LIST: 'download_student_list',
    DOWNLOAD_INPUT_LIST: 'download_input_list',
    DOWNLOAD_PORTRAIT: 'download_portrait',
    DOWNLOAD_CARD: 'download_card',
    DOWNLOAD_CROPPED_CARD: 'download_cropped_card',
    DOWNLOAD_PDF: 'download_pdf',
}

export const DOWNLOAD_OPTIONS_LABEL = {
    [DOWNLOAD_OPTIONS.DOWNLOAD_STUDENT_LIST]: 'Tải danh sách dự thi',
    [DOWNLOAD_OPTIONS.DOWNLOAD_INPUT_LIST]: 'Tải danh sách nhập liệu',
    [DOWNLOAD_OPTIONS.DOWNLOAD_PORTRAIT]: 'Tải ảnh chân dung',
    [DOWNLOAD_OPTIONS.DOWNLOAD_CARD]: 'Tải căn cước',
    [DOWNLOAD_OPTIONS.DOWNLOAD_CROPPED_CARD]: 'Tải căn cước cắt',
    [DOWNLOAD_OPTIONS.DOWNLOAD_PDF]: 'Tạo hồ sơ in',
}