const GENDERS = {
    MALE: 'Nam',
    FEMALE: 'Nữ'
}

const DRIVING_LICENSE_LEVELS = {
    A1: 'A1',
    A: 'A',
    A2: 'A2',
    B1: 'B1',
    B: 'B',
    B2: 'B2',
    C: 'C',
    C1: 'C1',
    D: 'D',
    D1: 'D1',
    D2: 'D2',
    E: 'E',
    FC: 'FC',
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const IMPORT_HEADERS = {
    'Mã học viên': 'registrationCode',
    'Họ và tên': 'name',
    'Giới tính': 'gender',
    'Ngày sinh': 'dob',
    'Số điện thoại': 'tel',
    'Địa chỉ': 'address',
    'Số CCCD': 'cardNumber',
    'Ngày cấp CCCD': 'cardProvidedDate',
    'Nơi cấp CCCD': 'cardProvider',
}

const EXPORT_HEADERS = {
    registrationCode: 'Mã học viên',
    name: 'Họ và tên',
    gender: 'Giới tính',
    dob: 'Ngày sinh',
    tel: 'Số điện thoại',
    address: 'Địa chỉ',
    cardNumber: 'Số CCCD',
    cardProvidedDate: 'Ngày cấp CCCD',
    cardProvider: 'Nơi cấp CCCD',
}

export {
    GENDERS,
    DRIVING_LICENSE_LEVELS,
    EXCEL_TYPE,
    IMPORT_HEADERS,
    EXPORT_HEADERS,
}
