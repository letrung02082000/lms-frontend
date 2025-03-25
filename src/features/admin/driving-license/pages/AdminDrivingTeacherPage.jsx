import React, { useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import drivingApi from 'api/drivingApi';
import { Button, Col, Form, FormControl, Modal, Row } from 'react-bootstrap';
import { toastWrapper } from 'utils';
import { ROLE } from 'constants/role';
import { EDUCATION_LEVELS, GENDERS, TEACHER_STATUS, TEACHING_CERTIFICATE_LEVELS } from 'constants/driving-teacher.constant';
import { MdEdit } from 'react-icons/md';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

function AdminDrivingTeacherPage() {
  const { center, role : userRole } = JSON.parse(localStorage.getItem('user-info'));
  const [rowData, setRowData] = useState([]);
  const [drivingDate, setDrivingDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [groupLink, setGroupLink] = useState('');
  const [drivingCenters, setDrivingCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(center || '');
  const [drivingTypes, setDrivingTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [gridApi, setGridApi] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
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

  useEffect(() => {
    if (center) {
      drivingApi
        .queryDrivingCenterType({ center })
        .then((res) => {
          setDrivingTypes(res.data.map((item) => item.drivingType));
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      drivingApi
        .queryDrivingType()
        .then((res) => {
          setDrivingTypes(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);
  
  const ActionButton = (props) => {
    return (
      <div className='w-100 d-flex justify-content-center'>
        <button
          className='btn'
          onClick={() => {
            setSelectedRow(props.data);
            setShowModal(true);
          }}
        >
          <MdEdit />
        </button>
      </div>
    );
  };

  const [colDefs] = useState([
    {
      field: 'action',
      headerName: 'Thao tác',
      cellRenderer: ActionButton,
      width: 60,
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
      field: 'fullName',
      headerName: 'Họ tên',
      minWidth: 300,
      editable: true,
    },
    {
      field: 'drivingClass',
      headerName: 'Hạng GVLX',
      editable: true,
    },
    {
      field: 'dob',
      headerName: 'Ngày sinh',
      valueFormatter: (params) => {
        return new Date(params.value).toLocaleDateString('vi-VN');
      },
      editable: true,
      cellEditor: 'agDateStringCellEditor',
      filter: 'agDateColumnFilter',
    },
    {
      field: 'identityNumber',
      headerName: 'Số CCCD',
      editable: true,
    },
    {
      field: 'gender',
      headerName: 'Giới tính',
      valueFormatter: (params) => GENDERS[params.value],
    },
    {
      field: 'driverLicenseNumber',
      headerName: 'Số GPLX',
      editable: true,
    },
    {
      field: 'issueDate',
      headerName: 'Ngày cấp GPLX',
      valueFormatter: (params) => {
        return params.value
          ? new Date(params.value).toLocaleDateString('vi-VN')
          : 'Không có';
      },
      editable: true,
      cellEditor: 'agDateStringCellEditor',
      cellEditorParams: {
        min: '2000-01-01', // Giới hạn ngày nhỏ nhất
        max: '2030-12-31', // Giới hạn ngày lớn nhất
        placeholder: 'Chọn ngày',
      },
      filter: 'agDateColumnFilter',
    },
    {
      field: 'expirationDate',
      headerName: 'Ngày hết hạn GPLX',
      valueFormatter: (params) => {
        return params.value
          ? new Date(params.value).toLocaleDateString('vi-VN')
          : 'Không có';
      },
      editable: true,
      cellEditor: 'agDateStringCellEditor',
      cellEditorParams: {
        min: '2000-01-01', // Giới hạn ngày nhỏ nhất
        max: '2030-12-31', // Giới hạn ngày lớn nhất
        placeholder: 'Chọn ngày',
      },
      filter: 'agDateColumnFilter',
    },
    {
      field: 'licenseDuration',
      headerName: 'Thời hạn GPLX',
      editable: true,
    },
    {
      headerName: 'Hạng GPLX',
      field: 'licenseClass',
      editable: true,
    },
    {
      headerName: 'Tên trường',
      field: 'schoolName',
      editable: true,
    },
    {
      headerName: 'Trình độ chuyên môn',
      field: 'educationLevel',
      valueFormatter: (params) =>
        params.value?.map((item) => EDUCATION_LEVELS[item]).join(', '),
    },
    {
      headerName: 'Nơi cấp CCSP',
      field: 'teachingCertificateIssuer',
      editable: true,
    },
    {
      headerName: 'Chứng chỉ sư phạm',
      field: 'teachingCertificateLevel',
      valueFormatter: (params) =>
        params.value?.map((item) => TEACHING_CERTIFICATE_LEVELS[item]).join(', '),
    },
    {
      field: 'status',
      headerName: 'Tình trạng',
      valueFormatter: (params) => {
        return params.value ? TEACHER_STATUS[params.value] : 'Chưa cập nhật';
      },
    }
  ]);

  const fetchDrivingTypes = async () => {
    drivingApi
      .queryDrivingCenterType({ ...(center && { center }) })
      .then((res) => {
        setRowData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  
  const handleAddTypeButton = async () => {
    const body = {
      date: new Date(drivingDate).getTime(),
      isVisible: true,
      description,
      link: groupLink,
      center: selectedCenter,
      drivingType: selectedType,
    };

    drivingApi.addDrivingDate(body).then((res) => {
      toastWrapper('Thêm ngày thành công', 'success');
      fetchDrivingTypes();
      setShowModal(false);
    }).catch((err) => {
      toastWrapper(err?.message, 'error');
    });
  }

  const onCellValueChanged = (event) => {
    const { data } = event;

    console.log(data);
    // drivingApi.updateDrivingCenterType(data?._id, body).then((res) => {
    //   toastWrapper('Cập nhật thành công', 'success');
    // }).catch((err) => {
    //   toastWrapper(err.response.data.message, 'error');
    // });
  }

  const onGridReady = (params) => {
    setGridApi(params.api);
    const dataSource = getDataSource();
    params.api.setGridOption('datasource', dataSource);
  };

  const getDataSource = () => {
    return {
      rowCount: null,
      getRows: async (params) => {
        const { startRow, endRow } = params;
        try {
          const res = await drivingApi.queryDrivingTeacher({
            page: Math.floor(startRow / (endRow - startRow)) + 1,
            limit: endRow - startRow,
          });
          params.successCallback(res.data, res.pagination.totalDocs);
        } catch (error) {
          params.failCallback();
        }
      },
    };
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
      {(userRole?.includes(ROLE.ADMIN) ||
        userRole?.includes(ROLE.DRIVING.ADMIN)) && (
        <>
          <Modal
            show={showModal}
            onHide={() => setShowModal(false)}
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
                {!center && (
                  <Row>
                    <Col>
                      <Form.Select
                        className='mb-3'
                        onChange={(e) => setSelectedCenter(e.target.value)}
                      >
                        <option>Chọn trung tâm</option>
                        {drivingCenters.map((center) => (
                          <option key={center._id} value={center._id}>
                            {center.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                  </Row>
                )}
                <Row>
                  <Col>
                    <Form.Select
                      className='mb-3'
                      onChange={(e) => setSelectedType(e.target.value)}
                    >
                      <option>Chọn hạng bằng</option>
                      {drivingTypes.map((type) => (
                        <option key={type._id} value={type._id}>
                          {type.label}
                        </option>
                      ))}
                    </Form.Select>
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
              <Button variant='primary' onClick={handleAddTypeButton}>
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
            onClick={() => setShowModal(true)}
          >
            <MdAdd />
          </Button> */}
        </>
      )}
    </div>
  );
}

export default AdminDrivingTeacherPage;
