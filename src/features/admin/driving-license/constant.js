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

 export const PROCESS_STATE = {
    CREATED: 0,
    WAITING_FOR_UPDATE: 1,
    WAITING_FOR_PAYMENT: 2,
    APPROVED: 5,
    HEALTH_CHECKED: 6,
    WAITING_FOR_SCHEDULE: 7,
    COMPLETED: 3,
    CANCELLED: 4,
  };

export const DRIVING_STATE_LABEL = {
    [DRIVING_STATE.CREATED]: "Đã tạo",
    [DRIVING_STATE.WAITING_CHANGE]: "Chờ cập nhật",
    [DRIVING_STATE.WAITING_PAYMENT]: "Chờ thanh toán",
    [DRIVING_STATE.APPROVED]: "Đã duyệt",
    [DRIVING_STATE.HAS_FILE_1]: "Đã có hồ sơ 1",
    [DRIVING_STATE.HAS_FILE_2]: "Đã có hồ sơ 2",
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

export const ACTION_OPTIONS = {
    EXPORT_EXCEL: 'export_excel',
    DOWNLOAD_FILE: 'download_file',
    DOWNLOAD_PDF: 'download_pdf',
    DOWNLOAD_PORTRAIT_PDF: 'download_portrait_pdf',
    DOWNLOAD_HEALTH_POTRAIT_PDF: 'download_health_pdf',
    UPLOAD_FILE: 'upload_file',
}

export const ACTION_OPTIONS_LABEL = {
    [ACTION_OPTIONS.EXPORT_EXCEL]: 'Tải danh sách',
    [ACTION_OPTIONS.DOWNLOAD_FILE]: 'Tải ảnh hồ sơ',
    [ACTION_OPTIONS.DOWNLOAD_PDF]: 'Tải PDF căn cước',
    [ACTION_OPTIONS.DOWNLOAD_PORTRAIT_PDF]: 'Tải PDF chân dung hồ sơ',
    [ACTION_OPTIONS.DOWNLOAD_HEALTH_POTRAIT_PDF]: 'Tải PDF chân dung khám sức khỏe',
    [ACTION_OPTIONS.UPLOAD_FILE]: 'Tải lên hồ sơ',
}

export const EXPORT_EXCEL_FIELDS = {
    NO: 'no',
    TIMESTAMP: 'timestamp',
    FULL_NAME: 'name',
    LAST_NAME: 'lastName',
    FIRST_NAME: 'firstName',
    DRIVING_DATE: 'date',
    DRIVING_TYPE: 'drivingType',
    PHONE_NUMBER: 'tel',
    ZALO: 'zalo',
    HIDDEN_PHONE_NUMBER: 'hiddenTel',
    PROCESS_STATE: 'processState',
    INVALID_STATE: 'invalidState',
    PAYMENT_STATE: 'paymentState',
    PAYMENT_AMOUNT: 'paymentAmount',
    PAYMENT_METHOD: 'paymentMethod',
    NOTE: 'feedback',
    PORTRAIT_URL: 'portraitUrl',
    FRONT_URL: 'frontUrl',
    BACK_URL: 'backUrl',
    DOB: 'dob',
    GENDER: 'gender',
    ADDRESS: 'address',
    ADDRESS_TOWN_CODE: 'addressTownCode',
    DETAIL_ADDRESS: 'detailAddress',
    IDENTITY_CARD_NUMBER: 'identityCardNumber',
    CARD_PROVIDED_DATE: 'cardProvidedDate',
    CARD_PROVIDED_PLACE: 'cardProvidedPlace',
    HEALTH_CHECKED_DATE: 'healthCheckedDate',
    ERROR: 'error',
}

export const DOWNLOAD_FILE_FIELDS = {
    CARD: 'card',
    CARD_CROP: 'card_crop',
    PORTRAIT: 'portrait',
    PORTRAIT_CLIP: 'portrait_clip',
    PORTRAIT_HEALTH: 'portrait_health',
    PORTRAIT_CROP: 'portrait_crop',
}

export const DOWNLOAD_FILE_FIELDS_LABEL = {
    [DOWNLOAD_FILE_FIELDS.CARD]: 'Ảnh căn cước',
    [DOWNLOAD_FILE_FIELDS.CARD_CROP]: 'Ảnh căn cước (cắt)',
    [DOWNLOAD_FILE_FIELDS.PORTRAIT]: 'Ảnh chân dung',
    [DOWNLOAD_FILE_FIELDS.PORTRAIT_CLIP]: 'Ảnh chân dung (nền xanh)',
    [DOWNLOAD_FILE_FIELDS.PORTRAIT_HEALTH]: 'Ảnh chân dung (nền trắng)',
    [DOWNLOAD_FILE_FIELDS.PORTRAIT_CROP]: 'Ảnh chân dung (cắt)',
}

export const EXPORT_EXCEL_FIELDS_LABEL = {
    [EXPORT_EXCEL_FIELDS.NO]: 'STT',
    [EXPORT_EXCEL_FIELDS.TIMESTAMP]: 'Thời gian đăng ký',
    [EXPORT_EXCEL_FIELDS.FULL_NAME]: 'Họ và tên',
    [EXPORT_EXCEL_FIELDS.LAST_NAME]: 'Họ và tên đệm',
    [EXPORT_EXCEL_FIELDS.FIRST_NAME]: 'Tên',
    [EXPORT_EXCEL_FIELDS.DRIVING_DATE]: 'Ngày thi',
    [EXPORT_EXCEL_FIELDS.DRIVING_TYPE]: 'Loại bằng',
    [EXPORT_EXCEL_FIELDS.PHONE_NUMBER]: 'Số điện thoại',
    [EXPORT_EXCEL_FIELDS.ZALO]: 'Zalo',
    [EXPORT_EXCEL_FIELDS.HIDDEN_PHONE_NUMBER]: 'Số điện thoại (đã ẩn)',
    [EXPORT_EXCEL_FIELDS.PROCESS_STATE]: 'Trạng thái xử lý',
    [EXPORT_EXCEL_FIELDS.INVALID_STATE]: 'Trạng thái hồ sơ',
    [EXPORT_EXCEL_FIELDS.PAYMENT_STATE]: 'Trạng thái thanh toán',
    [EXPORT_EXCEL_FIELDS.PAYMENT_AMOUNT]: 'Số tiền',
    [EXPORT_EXCEL_FIELDS.PAYMENT_METHOD]: 'Phương thức thanh toán',
    [EXPORT_EXCEL_FIELDS.NOTE]: 'Ghi chú',
    [EXPORT_EXCEL_FIELDS.PORTRAIT_URL]: 'Ảnh chân dung',
    [EXPORT_EXCEL_FIELDS.FRONT_URL]: 'Ảnh mặt trước',
    [EXPORT_EXCEL_FIELDS.BACK_URL]: 'Ảnh mặt sau',
    [EXPORT_EXCEL_FIELDS.DOB]: 'Ngày sinh',
    [EXPORT_EXCEL_FIELDS.GENDER]: 'Giới tính',
    [EXPORT_EXCEL_FIELDS.IDENTITY_CARD_NUMBER]: 'Số căn cước',
    [EXPORT_EXCEL_FIELDS.ADDRESS]: 'Địa chỉ',
    [EXPORT_EXCEL_FIELDS.ADDRESS_TOWN_CODE]: 'Mã xã/phường',
    [EXPORT_EXCEL_FIELDS.DETAIL_ADDRESS]: 'Địa chỉ chi tiết',
    [EXPORT_EXCEL_FIELDS.CARD_PROVIDED_DATE]: 'Ngày cấp',
    [EXPORT_EXCEL_FIELDS.CARD_PROVIDED_PLACE]: 'Nơi cấp',
    [EXPORT_EXCEL_FIELDS.HEALTH_CHECKED_DATE]: 'Ngày khám sức khỏe',
    [EXPORT_EXCEL_FIELDS.ERROR]: 'Lỗi',
}

export const EXPORT_EXAM_EXCEL_FIELDS_TEMPLATE = {
    [EXPORT_EXCEL_FIELDS.NO]: true,
    [EXPORT_EXCEL_FIELDS.TIMESTAMP]: false,
    [EXPORT_EXCEL_FIELDS.FULL_NAME]: false,
    [EXPORT_EXCEL_FIELDS.LAST_NAME]: true,
    [EXPORT_EXCEL_FIELDS.FIRST_NAME]: true,
    [EXPORT_EXCEL_FIELDS.DRIVING_DATE]: true,
    [EXPORT_EXCEL_FIELDS.DRIVING_TYPE]: false,
    [EXPORT_EXCEL_FIELDS.PHONE_NUMBER]: true,
    [EXPORT_EXCEL_FIELDS.ZALO]: false,
    [EXPORT_EXCEL_FIELDS.HIDDEN_PHONE_NUMBER]: true,
    [EXPORT_EXCEL_FIELDS.PROCESS_STATE]: true,
    [EXPORT_EXCEL_FIELDS.INVALID_STATE]: false,
    [EXPORT_EXCEL_FIELDS.PAYMENT_STATE]: true,
    [EXPORT_EXCEL_FIELDS.PAYMENT_AMOUNT]: false,
    [EXPORT_EXCEL_FIELDS.PAYMENT_METHOD]: false,
    [EXPORT_EXCEL_FIELDS.NOTE]: false,
    [EXPORT_EXCEL_FIELDS.PORTRAIT_URL]: false,
    [EXPORT_EXCEL_FIELDS.FRONT_URL]: false,
    [EXPORT_EXCEL_FIELDS.BACK_URL]: false,
    [EXPORT_EXCEL_FIELDS.DOB]: false,
    [EXPORT_EXCEL_FIELDS.GENDER]: false,
    [EXPORT_EXCEL_FIELDS.IDENTITY_CARD_NUMBER]: false,
    [EXPORT_EXCEL_FIELDS.ADDRESS]: false,
    [EXPORT_EXCEL_FIELDS.ADDRESS_TOWN_CODE]: false,
    [EXPORT_EXCEL_FIELDS.DETAIL_ADDRESS]: false,
    [EXPORT_EXCEL_FIELDS.CARD_PROVIDED_DATE]: false,
    [EXPORT_EXCEL_FIELDS.CARD_PROVIDED_PLACE]: false,
    [EXPORT_EXCEL_FIELDS.HEALTH_CHECKED_DATE]: false,
}

export const EXPORT_INPUT_EXCEL_FIELDS_TEMPLATE = {
    [EXPORT_EXCEL_FIELDS.NO]: true,
    [EXPORT_EXCEL_FIELDS.TIMESTAMP]: false,
    [EXPORT_EXCEL_FIELDS.FULL_NAME]: true,
    [EXPORT_EXCEL_FIELDS.LAST_NAME]: false,
    [EXPORT_EXCEL_FIELDS.FIRST_NAME]: false,
    [EXPORT_EXCEL_FIELDS.DRIVING_DATE]: false,
    [EXPORT_EXCEL_FIELDS.DRIVING_TYPE]: true,
    [EXPORT_EXCEL_FIELDS.PHONE_NUMBER]: false,
    [EXPORT_EXCEL_FIELDS.ZALO]: false,
    [EXPORT_EXCEL_FIELDS.HIDDEN_PHONE_NUMBER]: false,
    [EXPORT_EXCEL_FIELDS.PROCESS_STATE]: false,
    [EXPORT_EXCEL_FIELDS.INVALID_STATE]: false,
    [EXPORT_EXCEL_FIELDS.PAYMENT_STATE]: false,
    [EXPORT_EXCEL_FIELDS.PAYMENT_AMOUNT]: false,
    [EXPORT_EXCEL_FIELDS.PAYMENT_METHOD]: false,
    [EXPORT_EXCEL_FIELDS.NOTE]: false,
    [EXPORT_EXCEL_FIELDS.PORTRAIT_URL]: false,
    [EXPORT_EXCEL_FIELDS.FRONT_URL]: false,
    [EXPORT_EXCEL_FIELDS.BACK_URL]: false,
    [EXPORT_EXCEL_FIELDS.DOB]: true,
    [EXPORT_EXCEL_FIELDS.GENDER]: true,
    [EXPORT_EXCEL_FIELDS.IDENTITY_CARD_NUMBER]: true,
    [EXPORT_EXCEL_FIELDS.ADDRESS]: false,
    [EXPORT_EXCEL_FIELDS.ADDRESS_TOWN_CODE]: true,
    [EXPORT_EXCEL_FIELDS.DETAIL_ADDRESS]: true,
    [EXPORT_EXCEL_FIELDS.CARD_PROVIDED_DATE]: false,
    [EXPORT_EXCEL_FIELDS.CARD_PROVIDED_PLACE]: false,
    [EXPORT_EXCEL_FIELDS.HEALTH_CHECKED_DATE]: false,
    [EXPORT_EXCEL_FIELDS.ERROR]: true,
}

export const EXPORT_EXCEL_OPTIONS = {
    EXPORT_EXAM_EXCEL: 'export_exam_excel',
    EXPORT_INPUT_EXCEL: 'export_input_excel',
}

export const EXPORT_EXCEL_OPTIONS_LABEL = {
    [EXPORT_EXCEL_OPTIONS.EXPORT_EXAM_EXCEL]: 'Tải danh sách dự thi',
    [EXPORT_EXCEL_OPTIONS.EXPORT_INPUT_EXCEL]: 'Tải danh sách nhập',
}

export const UPLOAD_FILE_OPTIONS = {
    ALL: 'all',
    PORTRAIT: 'portraitUrl',
    FRONT: 'frontUrl',
    BACK: 'backUrl',
}

export const UPLOAD_FILE_OPTIONS_LABEL = {
    [UPLOAD_FILE_OPTIONS.ALL]: 'Tải lên tất cả',
    [UPLOAD_FILE_OPTIONS.PORTRAIT]: 'Tải lên ảnh chân dung',
    [UPLOAD_FILE_OPTIONS.FRONT]: 'Tải lên ảnh mặt trước',
    [UPLOAD_FILE_OPTIONS.BACK]: 'Tải lên ảnh mặt sau',
}
