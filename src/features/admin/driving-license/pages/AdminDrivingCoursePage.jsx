import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import drivingApi from 'api/drivingApi';
import { Button, Col, Form, FormControl, Modal, Row } from 'react-bootstrap';
import { MdAdd } from 'react-icons/md';
import { toastWrapper } from 'utils';
import { ROLE } from 'constants/role';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import TableEditButton from 'components/button/TableEditButton';
import drivingCourseSchema from 'validations/driving-course.validation';
import InputField from 'components/form/InputField';

function AdminDrivingCoursePage() {
  const { center, role: userRole } = JSON.parse(
    localStorage.getItem('user-info')
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [drivingCenters, setDrivingCenters] = useState([]);
  const [drivingTypes, setDrivingTypes] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(drivingCourseSchema),
  });

  useEffect(() => {
    drivingApi
      .queryDrivingCenters({
        filter: {
          active: true,
          ...(center && { _id: center }),
        },
      })
      .then((res) => {
        setDrivingCenters(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    if (center) {
      drivingApi
        .queryDrivingCenterType({
          filter: { ...(center && { center }), active: true },
        })
        .then((res) => {
          setDrivingTypes(res.data?.map((item) => item.drivingType));
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
      field: 'date',
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

  const fetchDrivingCourse = async () => {
    const dataSource = getDataSource();

    if (gridApi) {
      gridApi.setDatasource(dataSource);
    }
  };

  const handleAddCourseButton = () => {
    reset();
    setIsEditMode(false);
    setShowModal(true);
  };

  const handleSaveCourseBtn = async () => {
    await handleSubmit((formData) => {
      const body = {
        ...formData,
        date: formData.drivingDate,
        center: formData.center?._id,
        drivingType: formData.drivingType?._id,
      }
      drivingApi
      .updateDrivingCourse(formData?._id, body)
      .then((res) => {
        setShowModal(false);
        fetchDrivingCourse();
        toastWrapper('Cập nhật thành công', 'success');
      })
      .catch((err) => {
        toastWrapper(err.response.data.message, 'error');
      });
    })();
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

    drivingApi
      .updateDrivingDate(data?._id, body)
      .then((res) => {
        toastWrapper('Cập nhật thành công', 'success');
      })
      .catch((err) => {
        toastWrapper(err.response.data.message, 'error');
      });
  };

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
            page: Math.floor(startRow / (endRow - startRow)) + 1,
            limit: endRow - startRow,
            filter: {
              ...(center && { center }),
            },
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
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
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
            <Row className='mb-3'>
              <Col>
                <InputField
                  label='Ngày thi'
                  name='drivingDate'
                  control={control}
                  type='date'
                />
              </Col>
            </Row>
            <Row className='mb-3'>
              <Col>
                <InputField
                  label='Trung tâm'
                  name='center._id'
                  control={control}
                  as='select'
                >
                  {drivingCenters?.map(({ _id, name }) => (
                    <option key={_id} value={_id}>
                      {name}
                    </option>
                  ))}
                </InputField>
              </Col>
            </Row>
            <Row className='mb-3'>
              <Col>
                <InputField
                  label='Hạng bằng'
                  name='drivingType._id'
                  control={control}
                  as='select'
                >
                  {drivingTypes?.map(({ _id, label }) => (
                    <option key={_id} value={_id}>
                      {label}
                    </option>
                  ))}
                </InputField>
              </Col>
            </Row>
            {[
              { name: 'code', label: 'Mã khoá', type: 'text' },
              { name: 'name', label: 'Tên khoá', type: 'text' },
              { name: 'link', label: 'Nhóm thi', type: 'text' },
            ].map(({ name, label, type, required }) => (
              <Row className='mb-3' key={name}>
                <Col>
                  <InputField
                    hasAsterisk={required}
                    label={label}
                    name={name}
                    control={control}
                    type={type}
                  />
                </Col>
              </Row>
            ))}
            <Row className='mb-3'>
              <Col>
                <InputField
                  label='Mô tả'
                  name='description'
                  control={control}
                  type='text'
                  rules={{
                    maxLength: {
                      value: 50,
                      message: 'Độ dài tối đa <= 50 ký tự',
                    },
                    required: false,
                  }}
                  as='textarea'
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Row>
            <Col className='text-end'>
              <Button
                type='button'
                variant='primary'
                onClick={handleSaveCourseBtn}
              >
                {isEditMode ? 'Cập nhật' : 'Thêm'}
              </Button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>

      {(userRole?.includes(ROLE.ADMIN) ||
        userRole?.includes(ROLE.DRIVING.ADMIN)) && (
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
            onClick={handleAddCourseButton}
          >
            <MdAdd />
          </Button>
        </>
      )}
    </div>
  );
}

export default AdminDrivingCoursePage;
