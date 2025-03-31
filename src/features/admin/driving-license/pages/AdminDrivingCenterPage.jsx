import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import drivingApi from 'api/drivingApi';
import { Button, Col, Form, FormControl, Modal, Row } from 'react-bootstrap';
import { MdEdit, MdAdd } from 'react-icons/md';
import { toastWrapper } from 'utils';
import { ROLE } from 'constants/role';
import elearningApi from 'api/elearningApi';
import CopyToClipboardButton from 'components/button/CopyToClipboardButton';
import TableEditButton from 'components/button/TableEditButton';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputField from 'components/form/InputField';
import { IoMdEye } from 'react-icons/io';
import drivingCenterSchema from 'validations/driving-center.validation';

function AdminDrivingCenterPage() {
  const {role: userRole, center} = JSON.parse(localStorage.getItem('user-info'));
  const [showElearningModal, setShowElearningModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [initingElearning, setInitingElearning] = useState(false);
  const [elearningInfo, setElearningInfo] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const {
    handleSubmit,
    setValue,
    control,
    clearErrors,
    reset,
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(drivingCenterSchema),
  });

  const [colDefs] = useState([
    {
      field: 'action',
      headerName: 'Thao tác',
      cellRenderer: TableEditButton,
      width: 60,
      suppressHeaderMenuButton: true,
      pinned: 'left',
      cellRendererParams: {
        clearErrors,
        reset,
        setSelectedRow,
        setIsEditMode,
        setShowModal,
      },
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
      cellRenderer: (data) => {
        return data.value
          ? new Date(data.value).toLocaleDateString('en-GB')
          : '';
      },
    },
    {
      field: 'name',
      headerName: 'Tên',
      editable: true,
    },
    {
      field: 'description',
      headerName: 'Mô tả',
      editable: true,
    },
    {
      field: 'address',
      headerName: 'Địa chỉ',
      editable: true,
    },
    {
      field: 'priority',
      headerName: 'Độ ưu tiên',
      editable: true,
    },
    {
      field: 'visible',
      headerName: 'Hiển thị trên website',
      editable: true,
      cellRenderer: 'agCheckboxCellRenderer',
    },
    {
      field: 'active',
      headerName: 'Hiển thị',
      editable: true,
      cellRenderer: 'agCheckboxCellRenderer',
    },
    {
      field: 'action',
      headerName: 'E-learning',
      cellRenderer: (data) => {
        data = data.data;
        return (
            <button
              className='btn'
              onClick={() => {
                setSelectedRow(data);
                setElearningInfo({
                  cohortId: data?.cohortId,
                  categoryId: data?.categoryId,
                  admin: {
                    username: data?.adminUsername,
                    password: data?.adminPassword,
                  },
                });
                setShowElearningModal(true);
              }}
            >
              <IoMdEye />
            </button>
        );
      },
    },
  ]);
  useEffect(() => {
    if (selectedRow && isEditMode) {
      Object.keys(selectedRow).forEach((key) => {
        setValue(key, selectedRow[key]);
      });
    } else {
    }
  }, [selectedRow, setValue, showModal]);

  const onGridReady = (params) => {
    setGridApi(params.api);
    const dataSource = getDataSource();
    params.api.setGridOption('datasource', dataSource);
  };

  const getDataSource = () => {
    return {
      rowCount: null,
      getRows: async (params) => {
        const { startRow, endRow} = params;
        try {
          const res = await drivingApi.queryDrivingCenters({
            limit: endRow - startRow,
            page: Math.floor(startRow / (endRow - startRow)) + 1,
            filter: {
              ...(center && { _id: center })
            },
          })
          params.successCallback(res.data, res.pagination.totalDocs);
        } catch (error) {
          params.failCallback();
        }
      },
    };
  };

  const fetchDrivingCenters = async () => {
    const dataSource = getDataSource();
    gridApi.setDatasource(dataSource);
  }

  const onInitCenterElearning = (centerId) => {
    setInitingElearning(true);
    elearningApi
      .initCenterElearning(centerId)
      .then((res) => {
        setElearningInfo(res.data);
        toastWrapper('Khởi tạo thành công', 'success');
        fetchDrivingCenters();
      })
      .catch((err) => {
        toastWrapper('Khởi tạo thất bại', 'error');
      })
      .finally(() => {
        setInitingElearning(false);
      });
  };
  
  const handleCenterSubmit = async (formData) => {
    const body = {
      ...formData,
    };
    const apiCall = isEditMode
      ? drivingApi.updateDrivingCenter(formData?._id, body)
      : drivingApi.createDrivingCenter(body);

    apiCall
      .then((res) => {
        fetchDrivingCenters();
        setShowModal(false);
        toastWrapper(
          isEditMode
            ? 'Cập nhật trung tâm thành công'
            : 'Thêm trung tâm thành công',
          'success'
        );
      })
      .catch((err) => {
        toastWrapper(err.response.data.message, 'error');
      });
  };

  const onCellValueChanged = (event) => {
    const { data } = event;

    drivingApi.updateDrivingCenter(data?._id, data).then((res) => {
      toastWrapper('Cập nhật thành công', 'success');
    }).catch((err) => {
      toastWrapper(err.response.data.message, 'error');
    });
  }

  const handleAddCenterBtn = () => {
    reset();
    setIsEditMode(false);
    setShowModal(true);
  };

  return (
    <div
      style={{
        height: '100vh',
      }}
    >
      <div className='ag-theme-quartz' style={{ height: '100%' }}>
        <AgGridReact
          columnDefs={colDefs}
          onCellValueChanged={onCellValueChanged}
          pagination={true}
          paginationPageSize={20}
          rowModelType={'infinite'}
          cacheBlockSize={20}
          paginationPageSizeSelector={[10, 20, 50, 100]}
          onGridReady={onGridReady}
        />
      </div>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size='lg'
        backdrop='static'
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditMode
              ? 'Chỉnh sửa trung tâm'
              : 'Thêm trung tâm mới'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className='mb-3'>
              <Col>
                <InputField
                  label='Tên trung tâm'
                  name='name'
                  control={control}
                  type='text'
                />
              </Col>
            </Row>
            <Row className='mb-3'>
              <Col>
                <InputField
                  label='Tên viết tắt'
                  name='shortName'
                  control={control}
                  type='text'
                />
              </Col>
            </Row>
            <Row className='mb-3'>
              <Col>
                <InputField
                  label='Số điện thoại'
                  name='tel'
                  control={control}
                  type='text'
                />
              </Col>
            </Row>
            <Row className='mb-3'>
              <Col>
                <InputField
                  label='Địa chỉ'
                  name='address'
                  control={control}
                  type='text'
                />
              </Col>
            </Row>
            <Row className='mb-3'>
              <Col>
                <InputField
                  label='Độ ưu tiên'
                  name='priority'
                  control={control}
                  type='number'
                />
              </Col>
            </Row>
            <Row className='mb-3'>
              <Col>
                <InputField
                  label='Mô tả'
                  name='description'
                  control={control}
                  type='text'
                  as='textarea'
                  rows={3}
                />
              </Col>
            </Row>
          </Form>
          <Button variant='primary' onClick={handleSubmit(handleCenterSubmit)}>
            {isEditMode ? 'Cập nhật' : 'Thêm'}
          </Button>
        </Modal.Body>
      </Modal>
      {userRole?.includes(ROLE.ADMIN) && (
        <>
          <Button
            className='rounded-circle'
            style={{
              width: '50px',
              height: '50px',
              position: 'fixed',
              bottom: '50px',
              right: '50px',
              zIndex: 1000,
            }}
            onClick={handleAddCenterBtn}
          >
            <MdAdd />
          </Button>
        </>
      )}
      <Modal
        show={showElearningModal}
        onHide={() => setShowElearningModal(false)}
        size='lg'
        backdrop='static'
      >
        <Modal.Header closeButton>
          <Modal.Title>Thông tin E-learning</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {elearningInfo?.cohortId ? (
            <div className='text-center'>
              <p>
                Tên đăng nhập: {elearningInfo?.admin?.username}
                <CopyToClipboardButton
                  className='btn text-primary'
                  value={elearningInfo?.admin?.username}
                />
              </p>
              <p>
                Mật khẩu: {elearningInfo?.admin?.password}
                <CopyToClipboardButton
                  className='btn text-primary'
                  value={elearningInfo?.admin?.password}
                />
              </p>
              <p>Cohort ID: {elearningInfo?.cohortId}</p>
              <p>Category ID: {elearningInfo?.categoryId}</p>
              <Button
                onClick={() =>
                  window.open('https://lms.uniapp.vn/my/courses.php')
                }
              >
                Quản lý E-learning
              </Button>
            </div>
          ) : (
            <p className='text-center'>
              <div className='mb-3'>Bạn chưa có E-learning</div>
              <Button
                onClick={() => onInitCenterElearning(selectedRow?._id)}
                disabled={initingElearning}
              >
                {initingElearning ? 'Đang khởi tạo' : 'Khởi tạo ngay'}
              </Button>
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='primary'
            onClick={() => setShowElearningModal(false)}
          >
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminDrivingCenterPage;
