import * as yup from 'yup';

const drivingTeacherSchema = yup.object().shape({
    examDate: yup.date().required('Ngày thi là bắt buộc'),
    drivingType: yup.object().shape({
        _id: yup.string().required('Vui lòng chọn hạng bằng'),
    }),
    center: yup.object().shape({
        _id: yup.string().required('Vui lòng chọn trung tâm'),
    }),
    link: yup.string().required('Nhóm thi là bắt buộc'),
});

export default drivingTeacherSchema;
