import * as yup from 'yup';

const drivingCenterSchema = yup.object().shape({
    name: yup.string().required('Tên là bắt buộc'),
    tel: yup.string().required('Số điện thoại là bắt buộc'),
    address: yup.string().required('Địa chỉ là bắt buộc'),
    priority: yup.number().required('Độ ưu tiên là bắt buộc'),
});

export default drivingCenterSchema;
