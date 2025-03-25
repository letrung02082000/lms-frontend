import * as yup from 'yup';

const drivingCourseSchema = yup.object().shape({
  drivingDate: yup.date().required('Ngày thi là bắt buộc'),
  drivingType: yup.object().shape({
    _id: yup.string().required('Vui lòng chọn hạng bằng'),
  }),
  center: yup.object().shape({
    _id: yup.string().required('Vui lòng chọn trung tâm'),
  }),
  code: yup.string().required('Mã khoá là bắt buộc'),
  name: yup.string().required('Tên khoá là bắt buộc'),
  link: yup.string().required('Nhóm thi là bắt buộc'),
});

export default drivingCourseSchema;
