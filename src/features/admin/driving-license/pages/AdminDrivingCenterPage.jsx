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

function AdminDrivingCenterPage() {
  const {role: userRole, center} = JSON.parse(localStorage.getItem('user-info'));
  const [showAddModal, setShowAddModal] = useState(false);
  const [drivingDate, setDrivingDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [groupLink, setGroupLink] = useState('');
  const [showElearningModal, setShowElearningModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [initingElearning, setInitingElearning] = useState(false);
  const [elearningInfo, setElearningInfo] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm({
    resolver: yupResolver(),
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
      flex: 1,
      cellRenderer: (data) => {
        return data.value
          ? new Date(data.value).toLocaleDateString('en-GB')
          : '';
      },
    },
    {
      field: 'name',
      headerName: 'Tên',
      flex: 6,
      editable: true,
    },
    {
      field: 'description',
      headerName: 'Mô tả',
      flex: 6,
      editable: true,
    },
    {
      field: 'address',
      headerName: 'Địa chỉ',
      flex: 6,
      editable: true,
    },
    {
      field: 'priority',
      headerName: 'Độ ưu tiên',
      flex: 6,
      editable: true,
    },
    {
      field: 'formVisible',
      headerName: 'Hiển thị trên website',
      editable: true,
    },
    {
      field: 'visible',
      headerName: 'Hiển thị',
      editable: true,
    },
    {
      field: 'action',
      headerName: 'Hành động',
      cellRenderer: (data) => {
        data = data.data;
        return (
          <div className='w-100 d-flex justify-content-center'>
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
              <MdEdit />
            </button>
          </div>
        );
      },
    },
  ]);

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
  
  const handleAddDateButton = async () => {
    const body = {
      date: new Date(drivingDate).getTime(),
      isVisible: true,
      description,
      link: groupLink,
    };

    drivingApi.addDrivingDate(body).then((res) => {
      toastWrapper('Thêm ngày thành công', 'success');
      fetchDrivingCenters();
      setShowAddModal(false);
    }).catch((err) => {
      toastWrapper(err.response.data.message, 'error');
    });
  }

  const onCellValueChanged = (event) => {
    const { data } = event;
    const body = {
      description: data.description,
      formVisible: data.formVisible,
      visible: data.visible,
      priority: data.priority,
      address: data.address,
      name: data.name,
      tel: data.tel,
      zalo: data.zalo,
    };

    drivingApi.updateDrivingCenter(data?._id, body).then((res) => {
      toastWrapper('Cập nhật thành công', 'success');
    }).catch((err) => {
      toastWrapper(err.response.data.message, 'error');
    });
  }

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
      {(userRole === ROLE.ADMIN || userRole === ROLE.DRIVING.ADMIN) && (
        <>
          <Modal
            show={showAddModal}
            onHide={() => setShowAddModal(false)}
            size='lg'
            backdrop='static'
          >
            <Modal.Header closeButton>
              <Modal.Title>Thêm ngày thi mới</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Row>
                  <Col>
                    <FormControl
                      className='mb-3'
                      type='date'
                      id='drivingDate'
                      name='drivingDate'
                      defaultValue={drivingDate}
                      onChange={(e) => setDrivingDate(e.target.value)}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormControl
                      className='mb-3'
                      type='text'
                      placeholder='Mô tả'
                      onChange={(e) => setDescription(e.target.value)}
                      as={'textarea'}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormControl
                      className='mb-3'
                      type='text'
                      placeholder='Nhóm thi'
                      onChange={(e) => setGroupLink(e.target.value)}
                    />
                  </Col>
                </Row>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='primary' onClick={handleAddDateButton}>
                Thêm
              </Button>
            </Modal.Footer>
          </Modal>
          {/* <Button
            className='rounded-circle'
            style={{
              width: '50px',
              height: '50px',
              position: 'fixed',
              bottom: '50px',
              right: '50px',
              zIndex: 1000,
            }}
            onClick={() => setShowAddModal(true)}
          >
            <MdAdd />
          </Button> */}
        </>
      )}
      <Modal
        show={showElearningModal}
        onHide={() => setShowElearningModal(false)}
        size='lg'
        backdrop='static'
      >
        <Modal.Header closeButton>
          <Modal.Title>Thông tin điểm thi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {elearningInfo?.cohortId ? (
            <div className='text-center'>
              <p>
                Tên đăng nhập: {elearningInfo?.admin?.username}
                <CopyToClipboardButton className='btn text-primary' value={elearningInfo?.admin?.username} />
              </p>
              <p>
                Mật khẩu: {elearningInfo?.admin?.password}
                <CopyToClipboardButton className='btn text-primary' value={elearningInfo?.admin?.password} />
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
