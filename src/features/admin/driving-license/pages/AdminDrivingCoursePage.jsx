import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import drivingApi from 'api/drivingApi';
import { Button, Col, Form, FormControl, Modal, Row } from 'react-bootstrap';
import { MdAdd, MdDelete, MdPeople, MdPersonAdd } from 'react-icons/md';
import { toastWrapper } from 'utils';
import { ROLE } from 'constants/role';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import TableEditButton from 'components/button/TableEditButton';
import drivingCourseSchema from 'validations/driving-course.validation';
import InputField from 'components/form/InputField';
import { getVietnamDate } from 'utils/commonUtils';
import SelectField from 'components/form/SelectField';
import elearningApi from 'api/elearningApi';
import { TbReportAnalytics } from "react-icons/tb";
import CopyToClipboardButton from 'components/button/CopyToClipboardButton';

function AdminDrivingCoursePage() {
  const { center, role: userRole } = JSON.parse(
    localStorage.getItem('user-info')
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [drivingCenters, setDrivingCenters] = useState([]);
  const [drivingTypes, setDrivingTypes] = useState([]);
  const [drivingDates, setDrivingDates] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showAddModal, setShowAddMemberModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [courseStudents, setCourseStudents] = useState([]);
  const [importData, setImportData] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const {
    control,
    handleSubmit,
    setValue,
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
        setDrivingCenters(
          res.data?.map((item) => {
            return {
              label: item.name,
              value: item._id,
            };
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });

    drivingApi
      .getDrivingDate({
        filter: {
          active: true,
          ...(center && { center }),
        },
      })
      .then((res) => {
        setDrivingDates(
          res.data?.map((item) => {
            return {
              label: `${new Date(item.date).toLocaleDateString('en-GB')} - ${
                item?.description
              } - ${item?.drivingType?.label || 'Chưa phân hạng'} - ${
                item?.center?.name
              }`,
              value: item.date,
            };
          })
        );
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
          setDrivingTypes(
            res.data?.map((item) => {
              return {
                label: item?.drivingType?.label,
                value: item?.drivingType?._id,
              };
            })
          );
        })
        .catch((err) => {
          console.log(err);
        });

      elearningApi.getCoursesByCenter(center).then((res) => {
        setLessons(
          res.data?.courses?.map((item) => {
            return {
              label: item.fullname,
              value: item.id,
            };
          }));
        }).catch((err) => {
          console.log(err);
        });
    } else {
      drivingApi
        .queryDrivingType({
          filter: { active: true },
        })
        .then((res) => {
          setDrivingTypes(
            res.data?.map((item) => {
              return {
                label: item.label,
                value: item._id,
              };
            })
          );
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

      if (selectedRow?.examDate) {
        setValue('examDate', getVietnamDate(selectedRow.examDate));
      } else {
        setValue('examDate', '');
      }

      if(selectedRow?.center) {
        setValue('center', {
          label: selectedRow?.center?.name,
          value: selectedRow?.center?._id,
        });
      }

      if(selectedRow?.drivingType) {
        setValue('drivingType', {
          label: selectedRow?.drivingType?.label,
          value: selectedRow?.drivingType?._id,
        });
      }

      if(selectedRow?.examDate) {
        setValue('examDate', {
          label: new Date(selectedRow?.examDate).toLocaleDateString('en-GB'),
          value: selectedRow?.examDate,
        });
      }
    }
  }, [selectedRow, setValue, showModal]);

  const [colDefs] = useState([
    {
      field: 'action',
      headerName: 'Thao tác',
      cellRenderer: TableEditButton,
      width: 90,
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
      field: 'elearning',
      headerName: 'Quản lý',
      suppressHeaderMenuButton: true,
      pinned: 'left',
      width: 150,
      cellRenderer: (params) => {
        return (
          <>
            <button
              className='btn'
              onClick={() => {
                setCourseStudents([]);
                setSelectedRow(params?.data);
                setShowStudentModal(true);
                getCourseStudents(params?.data);
              }}
            >
              <MdPeople />
            </button>
            <button
              className='btn'
              onClick={() => {
                setReportData([]);
                setSelectedRow(params?.data);
                setShowReportModal(true)
                getCourseReport(params?.data);
              }}
            >
            <TbReportAnalytics />
            </button>
          </>
        );
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
          ? new Date(data.value).toLocaleDateString('en-GB')
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
      valueFormatter: (data) => {
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

  const getCourseStudents = (data) => {
    drivingApi.getDrivings({
      query: {
        limit: 1000,
        page: 1,
        ...(center && { center }),
        course: data?._id,
      }
    }).then((res) => {
      setCourseStudents(res.data);
    }
    ).catch((err) => {
      console.log(err);
    });
  }

  const getCourseReport = (data) => {
    elearningApi.getCourseReport(data?.elearningCourseId).then((res) => {
      setReportData(res.data?.filter((item) => item?.groupid == data?.elearningCourseGroupId));
    }).catch((err) => {
      console.log(err);
    });
  }

  const initElearning = () => {
    if(window.confirm('Khởi tạo tài khoản Elearning cho học viên trong khoá này?')) {
      drivingApi
        .createElearningUsers(selectedRow?._id)
        .then((res) => {
          toastWrapper('Khởi tạo tài khoản Elearning thành công', 'success');
        })
        .catch((err) => {
          toastWrapper(err.response.data.message, 'error');
        });
    }
  }

  const refreshGrid = () => {
    if (gridApi) {
      gridApi.refreshInfiniteCache();
    }
  };

  const handleAddCourseButton = () => {
    setSelectedRow(null);
    reset();
    setIsEditMode(false);
    setShowModal(true);
  };

  const handleCourseSubmit = async (formData) => {
    const body = {
      ...formData,
      center: formData?.center?.value,
      drivingType: formData?.drivingType?.value,
      elearningCourseId: formData?.elearningCourseId?.value,
      examDate: formData?.examDate?.value,
    };
    const apiCall = isEditMode
      ? drivingApi.updateDrivingCourse(formData._id, body)
      : drivingApi.createDrivingCourse(body);

    apiCall
      .then((res) => {
        refreshGrid();
        setShowModal(false);
        toastWrapper(isEditMode ? 'Cập nhật thành công' : 'Thêm khoá thi thành công', 'success');
      })
      .catch((err) => {
        toastWrapper(err.response.data.message, 'error');
      });
  };

  const onCellValueChanged = (event) => {
    const { data } = event;
    const body = {
      visible: data.visible,
      active: data.active,
    };

    drivingApi
      .updateDrivingCourse(data?._id, body)
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
            {isEditMode ? 'Chỉnh sửa khoá' : 'Thêm khoá thi mới'}{' '}
            {selectedRow?.name || ''}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(handleCourseSubmit)}>
            <Row className='mb-3'>
              <Col>
                <SelectField
                  label='Ngày thi dự kiến'
                  name='examDate'
                  control={control}
                  noClear={true}
                  options={drivingDates}
                />
              </Col>
            </Row>
            <Row className='mb-3'>
              <Col>
                <SelectField
                  label='Trung tâm'
                  name='center'
                  control={control}
                  noClear={true}
                  options={drivingCenters}
                />
              </Col>
            </Row>
            <Row className='mb-3'>
              <Col>
                <SelectField
                  label='Hạng bằng'
                  name='drivingType'
                  control={control}
                  noClear={true}
                  options={drivingTypes}
                />
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
            <Row>
              <Col className='text-end'>
                <Button type='submit' variant='primary'>
                  {isEditMode ? 'Cập nhật' : 'Thêm'}
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal
        show={showStudentModal}
        onHide={() => setShowStudentModal(false)}
        size='xl'
        backdrop='static'
      >
        <Modal.Header closeButton>
          <Modal.Title>Danh sách học viên khoá {selectedRow?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className='mb-3'>
            {courseStudents?.length > 0 ? (
              <div className='ag-theme-quartz' style={{ height: '400px' }}>
                <AgGridReact
                  columnDefs={[
                    {
                      field: 'name',
                      headerName: 'Họ và tên',
                      width: 350,
                    },
                    {
                      field: 'cardNumber',
                      headerName: 'Số CCCD',
                      cellRenderer: (data) => {
                        return (
                          <span>
                            {data.value ? data.value : 'Chưa cập nhật'}
                            <CopyToClipboardButton
                              className='btn'
                              value={data.value}
                            />
                          </span>
                        );
                      },
                    },
                    {
                      field: 'registrationCode',
                      headerName: 'Mã học viên',
                    },
                    {
                      field: 'tel',
                      headerName: 'Số điện thoại',
                    },
                    {
                      field: 'elearningUserId',
                      headerName: 'Elearning',
                      cellRenderer: (data) => {
                        return data.value ? (
                          <span className='text-success'>Đã có tài khoản</span>
                        ) : (
                          <span className='text-warning'>
                            Chưa có tài khoản
                          </span>
                        );
                      },
                    },
                  ]}
                  rowData={courseStudents}
                />
              </div>
            ) : (
              <p>Không có học viên nào trong khoá học này</p>
            )}
          </Row>
          <Row>
            <Col className='text-end'>
              <Button onClick={initElearning}>
                Khởi tạo tài khoản Elearning cho tất cả học viên
              </Button>
              <Button
                variant='secondary'
                className='ms-2'
                onClick={() => setShowStudentModal(false)}
              >
                Đóng
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>

      <Modal
        show={showReportModal}
        onHide={() => setShowReportModal(false)}
        size='xl'
        backdrop='static'
      >
        <Modal.Header closeButton>
          <Modal.Title>Báo cáo khoá học {selectedRow?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className='mb-3'>
            {reportData?.length > 0 ? (
              <div className='ag-theme-quartz' style={{ height: '400px' }}>
                <AgGridReact
                  columnDefs={[
                    {
                      field: 'firstname',
                      headerName: 'Họ và tên',
                      width: 350,
                    },
                    {
                      field: 'username',
                      headerName: 'Tên đăng nhập',
                    },
                    {
                      field: 'itemname',
                      headerName: 'Học phần',
                      width: 500,
                      cellRenderer: (data) => {
                        return (
                          <div
                            dangerouslySetInnerHTML={{ __html: data.value }}
                          />
                        );
                      },
                    },
                    {
                      field: 'finalgrade',
                      headerName: 'Điểm thi',
                    },
                  ]}
                  rowData={reportData}
                />
              </div>
            ) : (
              <p>Không có kết quả học viên</p>
            )}
          </Row>
          <Row>
            <Col className='text-end'>
              <Button
                variant='secondary'
                onClick={() => setShowReportModal(false)}
              >
                Đóng
              </Button>
            </Col>
          </Row>
        </Modal.Body>
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
