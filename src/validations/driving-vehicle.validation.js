import * as yup from 'yup';

const drivingVehicleSchema = yup.object().shape({
  plate: yup.string().required('Biển số là bắt buộc'),
  center: yup.object().shape({
    value: yup.string().required('Vui lòng chọn trung tâm'),
  }),
  // brand: yup.string().required('Hãng xe là bắt buộc'),
  // type: yup.string().required('Loại xe là bắt buộc'),
  // model: yup.string().required('Mẫu xe là bắt buộc'),
  // engineNumber: yup.string().required('Số máy là bắt buộc'),
  // chassisNumber: yup.string().required('Số khung là bắt buộc'),
  // color: yup.string().required('Màu xe là bắt buộc'),
  // inspectionCertificateDate: yup.date().required('Ngày kiểm định là bắt buộc'),
  // inspectionCertificateExpiryDate: yup.date().required('Ngày hết hạn kiểm định là bắt buộc'),
  // DatSerialNumber: yup.string().required('Số thiết bị Dat là bắt buộc'),
  // DatInstallationDate: yup.date().required('Ngày lắp Dat là bắt buộc'),
  // supplier: yup.string().required('Nhà cung cấp là bắt buộc'),
  // transmissionType: yup.string().required('Loại hộp số là bắt buộc'),
  // dispatchNumber: yup.string().required('Số công văn là bắt buộc'),
  // owner: yup.string().required('Chủ xe là bắt buộc'),
  // relatedPerson: yup.string().required('Người liên quan là bắt buộc'),
  // insuranceExpiryDate: yup.date().required('Ngày hết hạn bảo hiểm là bắt buộc'),
  // gptlNumber: yup.string().required('Số giấy phép tập lái là bắt buộc'),
  // validFromDate: yup.date().required('Ngày có hiệu lực là bắt buộc'),
  // productionYear: yup.number().required('Năm sản xuất là bắt buộc'),
  // note: yup.string().required('Ghi chú là bắt buộc'),
});

export default drivingVehicleSchema;
