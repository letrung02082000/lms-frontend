import React, { useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import drivingApi from 'api/drivingApi';
import { Button, Col, Form, FormControl, Modal, Row } from 'react-bootstrap';
import { MdEdit, MdAdd } from 'react-icons/md';
import { toastWrapper } from 'utils';
import { ROLE } from 'constants/role';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import drivingClassSchema from 'validations/driving-class.validation';
import TableEditButton from 'components/button/TableEditButton';

function AdminDrivingCoursePage() {
  const { center, role : userRole } = JSON.parse(localStorage.getItem('user-info'));
  const [query, setQuery] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [drivingDate, setDrivingDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [groupLink, setGroupLink] = useState('');
  const [drivingCenters, setDrivingCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(center || '');
  const [drivingTypes, setDrivingTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [gridApi, setGridApi] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const { register, handleSubmit, setValue, formState: { errors }, clearErrors, reset } = useForm({
    resolver: yupResolver(drivingClassSchema)
  });

  useEffect(() => {
    drivingApi
      .queryDrivingCenters({ active: true, ...(center && { center }) })
      .then((res) => {
        setDrivingCenters(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    if (center) {
      drivingApi
        .queryDrivingCenterType({ center, active: true })
        .then((res) => {
          setDrivingTypes(res.data.map((item) => item.drivingType));
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      drivingApi
        .queryDrivingType({
          active: true,
        })
        .then((res) => {
          setDrivingTypes(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

    useEffect(() => {
      if (selectedRow && isEditMode) {
        Object.keys(selectedRow).forEach((key) => {
          setValue(key, selectedRow[key]);
        });
      }
    }, [selectedRow, setValue, showModal]);

  const [colDefs] = useState([
    {
      field: 'action',
      headerName: 'Thao tác',
      cellRenderer: TableEditButton,
      width: 60,
      suppressMenu: true,
      pinned: 'left',
      cellRendererParams: {
        clearErrors,
        reset,
        setSelectedRow,
        setIsEditMode,
        setShowModal
      }
    },
    {
      headerName: 'STT',
      valueGetter: 'node.rowIndex + 1',
      suppressMenu: true,
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
      field: 'enrollmentDate',
      headerName: 'Ngày vào khoá',
      valueFormatter: (data) => {
        return data.value
          ? new Date(data.value).toLocaleDateString('vi-VN')
          : 'Chưa cập nhật';
      },
    },
    {
      field: 'graduationDate',
      headerName: 'Ngày tốt nghiệp',
      cellRenderer: (data) => {
        return data.value
          ? new Date(data.value).toLocaleDateString('en-GB')
          : 'Chưa cập nhật';
      },
    },
    {
      field: 'examDate',
      headerName: 'Ngày thi dự kiến',
      cellRenderer: (data) => {
        return data.value
          ? new Date(data.value).toLocaleDateString('en-GB')
          : 'Chưa cập nhật';
      },
    },
    ...(userRole?.includes(ROLE.ADMIN) || userRole?.includes(ROLE.DRIVING.ADMIN)
      ? [
          {
            field: 'code',
            headerName: 'Mã khoá',
          },
          {
            field: 'name',
            headerName: 'Tên khoá',
          },
          {
            field: 'description',
            headerName: 'Mô tả',
          },
          {
            field: 'link',
            headerName: 'Nhóm thi',
          },
          {
            field: 'center.name',
            headerName: 'Trung tâm',
          },
          {
            field: 'drivingType.label',
            headerName: 'Hạng bằng',
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
        ]
      : []),
  ]);

  const fetchDrivingClass = async () => {
    const dataSource = getDataSource();

    if (gridApi) {
      gridApi.setDatasource(dataSource);
    }
  }

  useEffect(() => {
    fetchDrivingClass();
  }, [query]);
  
  const handleAddClassButton = () => {
    reset();
    setIsEditMode(false);
    setShowModal(true);
  };

  const handleSaveClass = () => {
    const body = {
      date: new Date(drivingDate).getTime(),
      description,
      link: groupLink,
      center: selectedCenter,
      drivingType: selectedType,
    };

    const apiCall = isEditMode
      ? drivingApi.updateDrivingClass(selectedRow._id, body)
      : drivingApi.addDrivingClass(body);

    apiCall.then((res) => {
      toastWrapper(isEditMode ? 'Cập nhật khoá thành công' : 'Thêm khoá thành công', 'success');
      fetchDrivingClass();
      setShowModal(false);
    }).catch((err) => {
      toastWrapper(err?.message, 'error');
    });
  };

  const onCellValueChanged = (event) => {
    const { data } = event;
    const body = {
      description: data.description,
      formVisible: data.formVisible,
      isVisible: data.isVisible,
      link: data.link,
      className: data.className,
      classCode: data.classCode,
    };

    drivingApi.updateDrivingDate(data?._id, body).then((res) => {
      toastWrapper('Cập nhật thành công', 'success');
    }).catch((err) => {
      toastWrapper(err.response.data.message, 'error');
    });
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
          const res = await drivingApi.queryDrivingCourse({
            ...(center && { center }),
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
          rowModelType='infinite'
          paginationPageSize={20}
          paginationPageSizeSelectors={[10, 20, 50, 100]}
          pagination={true}
          cacheBlockSize={20}
          onGridReady={onGridReady}
        />
      </div>
      {(userRole?.includes(ROLE.ADMIN) ||
        userRole?.includes(ROLE.DRIVING.ADMIN)) && (
        <>
          <Modal
            show={showModal}
            onHide={() => {
              setShowModal(false);
            }}
            size='lg'
            backdrop='static'
          >
            <Modal.Header closeButton>
              <Modal.Title>
                {isEditMode ? 'Chỉnh sửa khoá thi' : 'Thêm khoá thi mới'}
              </Modal.Title>
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
                    <Form.Group className='mb-3'>
                      <Form.Label>Mã khoá</Form.Label>
                      <FormControl
                        type='text'
                        placeholder='Mã khoá'
                        {...register('code')}
                        isInvalid={!!errors.code}
                      />
                      <FormControl.Feedback type='invalid'>
                        {errors.plate?.message}
                      </FormControl.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='primary' onClick={handleSaveClass}>
                {isEditMode ? 'Cập nhật' : 'Thêm'}
              </Button>
            </Modal.Footer>
          </Modal>
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
            onClick={handleAddClassButton}
          >
            <MdAdd />
          </Button>
        </>
      )}
    </div>
  );
}

export default AdminDrivingCoursePage;
