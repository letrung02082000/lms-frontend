import * as yup from 'yup';

const drivingTypeSchema = yup.object().shape({
    drivingType: yup.object().shape({
        _id: yup.string().required('Vui lòng chọn hạng bằng'),
    }),
    center: yup.object().shape({
        _id: yup.string().required('Vui lòng chọn trung tâm'),
    }),
});

export default drivingTypeSchema;
