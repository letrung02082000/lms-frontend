import * as yup from 'yup';

const drivingStudentSchema = yup.object().shape({
    dob: yup.date().max(new Date(), 'Ngày sinh không hợp lệ'),
    cardNumber: yup.number().typeError('Số thẻ không hợp lệ').positive('Số thẻ không hợp lệ').integer('Số thẻ không hợp lệ'),
    name: yup.string().required('Tên không được để trống').max(255, 'Tên không được vượt quá 255 ký tự'),
    tel: yup.string().matches(/^\d+$/, 'Số điện thoại không hợp lệ').length(10, 'Số điện thoại phải có 10 chữ số'),
    address: yup.string().max(255, 'Địa chỉ không được vượt quá 255 ký tự'),
    gender: yup.string(),
});

export default drivingStudentSchema;
