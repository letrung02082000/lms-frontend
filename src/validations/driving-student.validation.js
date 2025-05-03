import * as yup from 'yup';

const drivingStudentSchema = yup.object().shape({
    dob: yup.date(),
    cardNumber: yup.number(),
    name: yup.string(),
    tel: yup.string().matches(/^\d+$/, 'Số điện thoại không hợp lệ').length(10, 'Số điện thoại phải có 10 chữ số'),
    address: yup.string().max(255, 'Địa chỉ không được vượt quá 255 ký tự'),
    gender: yup.string(),
});

export default drivingStudentSchema;
