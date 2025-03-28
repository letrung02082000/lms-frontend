import React, { useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import drivingApi from 'api/drivingApi';
import { Button, Col, Form, FormControl, Modal, Row } from 'react-bootstrap';
import { toastWrapper } from 'utils';
import { ROLE } from 'constants/role';
import { DRIVING_LICENSE_LEVELS, EDUCATION_LEVELS, GENDERS, TEACHER_STATUS, TEACHING_CERTIFICATE_LEVELS } from 'constants/driving-teacher.constant';
import { MdAdd } from 'react-icons/md';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import TableEditButton from 'components/button/TableEditButton';
import drivingTeacherSchema from 'validations/driving-teacher.validation';
import InputField from 'components/form/InputField';
import SelectField from 'components/form/SelectField';

function AdminDrivingTeacherPage() {
  const { center, role: userRole } = JSON.parse(
    localStorage.getItem('user-info')
  );
  const [gridApi, setGridApi] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [drivingCenters, setDrivingCenters] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { control, handleSubmit, setValue, clearErrors, reset } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(drivingTeacherSchema),
  });

  useEffect(() => {
    if (selectedRow && isEditMode) {
      Object.keys(selectedRow).forEach((key) => {
        setValue(key, selectedRow[key]);
      });

      setValue(
        'licenseClass',
        selectedRow?.licenseClass?.map((item) => {
          return {
            value: item,
            label: DRIVING_LICENSE_LEVELS[item],
          };
        })
      );

      setValue(
        'educationLevel',
        selectedRow?.educationLevel?.map((item) => {
          return {
            value: item,
            label: EDUCATION_LEVELS[item],
          };
        })
      );

      setValue(
        'teachingCertificateLevel',
        selectedRow?.teachingCertificateLevel?.map((item) => {
          return {
            value: item,
            label: TEACHING_CERTIFICATE_LEVELS[item],
          };
        })
      );
    } else {
    }
  }, [selectedRow, setValue, showModal]);

  useEffect(() => {
    drivingApi
      .queryDrivingCenters({
        filter: { active: true, ...(center && { _id: center }) },
      })
      .then((res) => {
        setDrivingCenters(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  

  const [colDefs] = useState([
    {
      field: 'action',
      headerName: 'Thao tác',
      cellRenderer: TableEditButton,
      cellRendererParams: {
        clearErrors,
        reset,
        setSelectedRow,
        setIsEditMode,
        setShowModal
      },
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
      field: 'fullName',
      headerName: 'Họ tên',
      minWidth: 300,
      editable: true,
    },
    {
      field: 'drivingClass',
      headerName: 'Hạng GVLX',
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

  const refreshGrid = () => {
    if (gridApi) {
      gridApi.refreshInfiniteCache();
    }
  };
  
   const handleTeacherSubmit = async (formData) => {
    console.log(formData);
      const body = {
        ...formData,
        center: formData?.center?._id,
        licenseClass: formData?.licenseClass?.map((item) => item.value),
        educationLevel: formData?.educationLevel?.map((item) => item.value),
        teachingCertificateLevel: formData?.teachingCertificateLevel?.map(
          (item) => item.value
        ),
      };

      const apiCall = isEditMode
        ? drivingApi.updateDrivingTeacher(formData?._id, body)
        : drivingApi.createDrivingTeacher(body);
  
      apiCall
        .then((res) => {
          refreshGrid();
          setShowModal(false);
          toastWrapper(
            isEditMode ? 'Cập nhật ngày thành công' : 'Thêm ngày thành công',
            'success'
          );
        })
        .catch((err) => {
          toastWrapper(err?.message, 'error');
        });
    };
  
    const handleAddTeacherBtn = () => {
      reset();
      setIsEditMode(false);
      setShowModal(true);
    };

  const onCellValueChanged = (event) => {
    const { data } = event;

    drivingApi
      .updateDrivingTeacher(data?._id, data)
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
            size='xl'
            backdrop='static'
          >
            <Modal.Header closeButton>
              <Modal.Title>
                {isEditMode ? 'Cập nhật giáo viên' : 'Thêm giáo viên mới'}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit(handleTeacherSubmit)}>
                <Row className='mb-3'>
                  <Col>
                    <InputField
                      label='Họ và tên'
                      name='fullName'
                      control={control}
                    />
                  </Col>
                  <Col>
                    {/* <InputField
                      label='Hạng GPLX'
                      name='licenseClass'
                      control={control}
                    /> */}
                    <SelectField
                      label='Hạng GPLX'
                      name='licenseClass'
                      control={control}
                      options={Object.keys(DRIVING_LICENSE_LEVELS).map(
                        (key) => {
                          return {
                            label: DRIVING_LICENSE_LEVELS[key],
                            value: key,
                          };
                        }
                      )}
                      isMulti={true}
                      isClearable={false}
                    />
                  </Col>
                </Row>
                <Row className='mb-3'>
                  <Col>
                    <InputField
                      label='Ngày sinh'
                      name='dob'
                      type='date'
                      control={control}
                      noClear={true}
                    />
                  </Col>
                  <Col>
                    <InputField
                      label='Số GPLX'
                      name='driverLicenseNumber'
                      control={control}
                    />
                  </Col>
                </Row>
                <Row className='mb-3'>
                  <Col>
                    <InputField
                      label='Giới tính'
                      name='gender'
                      as='select'
                      control={control}
                      noClear={true}
                    >
                      {Object.keys(GENDERS).map((key) => {
                        return (
                          <option key={key} value={key}>
                            {GENDERS[key]}
                          </option>
                        );
                      })}
                    </InputField>
                  </Col>
                  <Col>
                    <InputField
                      label='Ngày cấp GPLX'
                      name='issueDate'
                      type='date'
                      control={control}
                      noClear={true}
                    />
                  </Col>
                </Row>
                <Row className='mb-3'>
                  <Col>
                    <InputField
                      label='Số CCCD'
                      name='identityNumber'
                      control={control}
                    />
                  </Col>
                  <Col>
                    <InputField
                      label='Ngày hết hạn GPLX'
                      name='expirationDate'
                      type='date'
                      control={control}
                      noClear={true}
                    />
                  </Col>
                </Row>
                <Row className='mb-3'>
                  <Col>
                    <InputField
                      as='select'
                      label='Hạng GVLX'
                      name='drivingClass'
                      control={control}
                    >
                      {Object.keys(DRIVING_LICENSE_LEVELS).map((key) => {
                        return (
                          <option key={key} value={key}>
                            {DRIVING_LICENSE_LEVELS[key]}
                          </option>
                        );
                      })}
                    </InputField>
                  </Col>
                  <Col>
                    <InputField
                      label='Thời hạn GPLX'
                      name='licenseDuration'
                      control={control}
                    />
                  </Col>
                </Row>
                <Row className='mb-3'>
                  <Col>
                    <SelectField
                      label='Trình độ chuyên môn'
                      name='educationLevel'
                      control={control}
                      options={Object.keys(EDUCATION_LEVELS).map((key) => {
                        return {
                          label: EDUCATION_LEVELS[key],
                          value: key,
                        };
                      })}
                      isMulti={true}
                      isClearable={false}
                    />
                  </Col>
                  <Col>
                    <InputField
                      label='Tên trường'
                      name='schoolName'
                      control={control}
                    />
                  </Col>
                </Row>
                <Row className='mb-3'>
                  <Col>
                    <SelectField
                      label='Chứng chỉ sư phạm'
                      name='teachingCertificateLevel'
                      control={control}
                      options={Object.keys(TEACHING_CERTIFICATE_LEVELS).map(
                        (key) => {
                          return {
                            label: TEACHING_CERTIFICATE_LEVELS[key],
                            value: key,
                          };
                        }
                      )}
                      isMulti={true}
                      isClearable={false}
                    />
                  </Col>
                  <Col>
                    <InputField
                      label='Nơi cấp CCSP'
                      name='teachingCertificateIssuer'
                      control={control}
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
                      noClear={true}
                    >
                      {drivingCenters.map((center) => (
                        <option key={center._id} value={center._id}>
                          {center.name}
                        </option>
                      ))}
                    </InputField>
                  </Col>
                  <Col>
                    <InputField
                      label='Tình trạng'
                      name='status'
                      control={control}
                      as='select'
                      noClear={true}
                    >
                      {Object.keys(TEACHER_STATUS).map((key) => {
                        return (
                          <option key={key} value={key}>
                            {TEACHER_STATUS[key]}
                          </option>
                        );
                      })}
                    </InputField>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button variant='primary' type='submit'>
                      {isEditMode ? 'Cập nhật' : 'Thêm'}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Modal.Body>
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
            onClick={handleAddTeacherBtn}
          >
            <MdAdd />
          </Button>
        </>
      )}
    </div>
  );
}

export default AdminDrivingTeacherPage;
