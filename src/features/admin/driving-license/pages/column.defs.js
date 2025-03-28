import { MdEdit } from 'react-icons/md';

const ActionButton = (props) => {
  return (
    <div className='w-100 d-flex justify-content-center'>
      <button
        className='btn'
        onClick={() => {
            props?.clearErrors();
            props?.reset();
            props?.setSelectedRow(props.data);
            props?.setIsEditMode(true);
            props?.setShowVehicleModal(true);
        }}
      >
        <MdEdit />
      </button>
    </div>
  );
};

const vehicleColDefs = [
  {
    field: 'action',
    headerName: 'Thao tác',
    cellRenderer: ActionButton,
    width: 90,
    suppressHeaderMenuButton: true,
    pinned: 'left',
  },
  {
    headerName: 'STT',
    valueGetter: 'node.rowIndex + 1',
    suppressHeaderMenuButton: true,
    pinned: 'left',
    width: 60,
  },
  {
    field: 'createdAt',
    headerName: 'Ngày tạo',
    valueFormatter: (data) => {
      return data.value
        ? new Date(data.value).toLocaleDateString('en-GB')
        : '';
    },
  },
  {
    field: 'plate',
    headerName: 'Biển số',
  },
  {
    field: 'isContractVehicle',
    headerName: 'Hình thức',
    valueFormatter: (data) => {
      return data.value ? 'Xe hợp đồng' : 'Xe trung tâm';
    },
  },
  {
    field: 'brand',
    headerName: 'Hãng xe',
  },
  {
    field: 'type',
    headerName: 'Loại xe',
  },
  // {
  //   field: 'model',
  //   headerName: 'Mẫu xe',
  // },
  {
    field: 'engineNumber',
    headerName: 'Số máy',
  },
  {
    field: 'chassisNumber',
    headerName: 'Số khung',
  },
  {
    field: 'color',
    headerName: 'Màu xe',
  },
  {
    field: 'inspectionCertificateDate',
    headerName: 'Ngày kiểm định',
    valueFormatter: (data) => {
      return data.value
        ? new Date(data.value).toLocaleDateString('en-GB')
        : '';
    },
  },
  {
    field: 'inspectionCertificateExpiryDate',
    headerName: 'Ngày hết hạn kiểm định',
    valueFormatter: (data) => {
      return data.value
        ? new Date(data.value).toLocaleDateString('en-GB')
        : '';
    },
  },
  {
    field: 'DatSerialNumber',
    headerName: 'Số thiết bị Dat',
  },
  {
    field: 'DatInstallationDate',
    headerName: 'Ngày lắp Dat',
    valueFormatter: (data) => {
      return data.value
        ? new Date(data.value).toLocaleDateString('en-GB')
        : '';
    },
  },
  {
    field: 'supplier',
    headerName: 'Nhà cung cấp',
  },
  {
    field: 'transmissionType',
    headerName: 'Loại hộp số',
  },
  {
    field: 'dispatchNumber',
    headerName: 'Số công văn',
  },
  {
    field: 'owner',
    headerName: 'Chủ xe',
  },
  {
    field: 'relatedPerson',
    headerName: 'Người liên quan',
  },
  {
    field: 'insuranceExpiryDate',
    headerName: 'Ngày hết hạn bảo hiểm',
    valueFormatter: (data) => {
      return data.value
        ? new Date(data.value).toLocaleDateString('en-GB')
        : '';
    },
  },
  {
    field: 'gptlNumber',
    headerName: 'Số giấy phép tập lái',
  },
  {
    field: 'validFromDate',
    headerName: 'Ngày có hiệu lực',
    valueFormatter: (data) => {
      return data.value
        ? new Date(data.value).toLocaleDateString('en-GB')
        : '';
    },
  },
  {
    field: 'productionYear',
    headerName: 'Năm sản xuất',
  },
  {
    field: 'note',
    headerName: 'Ghi chú',
  }
];

export {
  vehicleColDefs,
  ActionButton,
};
