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
import { IoMdEye } from 'react-icons/io';
import { ELEARNING_URL } from 'constants/url';
import { IoDownload } from 'react-icons/io5';
import { ELEARNING_ROLES } from 'constants/driving-elearning.constant';

function AdminDrivingElearningPage() {
  const { center, role: userRole } = JSON.parse(
    localStorage.getItem('user-info')
  );
  const [drivingCenter, setDrivingCenter] = useState(null);
  const [drivingCourses, setdrivingCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseUsers, setCourseUsers] = useState([]);
  const [importData, setImportData] = useState([]);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [elearningCourses, setElearningCourses] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
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
      .queryDrivingCourse({
        filter: {
          ...(center && { center }),
          active: true,
        },
        page: 1,
        limit: 100,
      })
      .then((res) => {
        setdrivingCourses(
          res.data.map((item) => {
            return {
              label: `${item.name} - ${
                item?.drivingType?.label || 'Chưa phân hạng'
              }`,
              value: item._id,
              elearningCourseId: item?.elearningCourseId,
              elearningCourseGroupId: item?.elearningCourseGroupId,
            };
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });

    if (center) {
      drivingApi
        .queryDrivingCenters({
          filter: { ...(center && { _id: center }), active: true },
        })
        .then((res) => {
          setDrivingCenter(res?.data[0])
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  useEffect(() => {
    if (center) {
      elearningApi.getCoursesByCenter(center).then((res) => {
        setElearningCourses(res?.data?.courses);
      });
    }
  }, [center]);

  const getCourseUsers = (data) => {
    setSelectedRow(data);
    setShowStudentModal(true);
    elearningApi.getCourseUsers(data?.id).then((res) => {
      setCourseUsers(res?.data);
    }).catch((err) => {
      console.log(err);
    });
  }

  const [colDefs] = useState([
    {
      field: 'students',
      headerName: 'Tài khoản',
      pinned: 'left',
      suppressHeaderMenuButton: true,
      cellRenderer: (params) => {
        return (
          <>
            <button
              className='btn'
              onClick={() => getCourseUsers(params?.data)}
            >
              <MdPeople />
            </button>
            <button
              className='btn'
              onClick={() => {
                setShowAddModal(true);
                setSelectedRow(params?.data);
              }}
            >
              <MdPersonAdd />
            </button>
          </>
        );
      },
    },
    // {
    //   field: 'action',
    //   headerName: 'Thao tác',
    //   cellRenderer: TableEditButton,
    //   width: 90,
    //   suppressHeaderMenuButton: true,
    //   pinned: 'left',
    //   cellRendererParams: {
    //     clearErrors,
    //     reset,
    //     setSelectedRow,
    //     setIsEditMode,
    //     setShowAddModal,
    //   },
    // },
    {
      field: 'timecreated',
      headerName: 'Ngày tạo',
      valueFormatter: (params) => {
        return new Date(params?.data?.timecreated * 1000).toLocaleDateString(
          'en-GB'
        );
      },
    },
    {
      field: 'id',
      headerName: 'Mã lớp học',
    },
    {
      field: 'fullname',
      headerName: 'Lớp học',
    },
    {
      field: 'categoryname',
      headerName: 'Trung tâm',
    },
    {
      field: 'startdate',
      headerName: 'Ngày khai giảng',
      valueFormatter: (params) => {
        return new Date(params?.data?.startdate * 1000).toLocaleDateString(
          'en-GB'
        );
      },
    },
    {
      field: 'enddate',
      headerName: 'Ngày bế giảng',
      valueFormatter: (params) => {
        if (params?.data?.enddate === 0) {
          return 'Chưa cập nhật';
        }
        return new Date(params?.data?.enddate * 1000).toLocaleDateString(
          'en-GB'
        );
      },
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      valueFormatter: (params) => {
        if (params?.data?.startdate * 1000 > Date.now()) {
          return 'Chưa bắt đầu';
        }

        if (
          params?.data?.enddate * 1000 < Date.now() &&
          params?.data?.enddate !== 0
        ) {
          return 'Đã kết thúc';
        }

        return 'Đang diễn ra';
      },
    },
    {
      field: 'course',
      headerName: 'Thao tác',
      cellRenderer: (params) => {
        return (
          <>
            <a
              className='btn'
              href={`${ELEARNING_URL}/course/view.php?id=${params?.data?.id}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <IoMdEye />
            </a>
          </>
        );
      },
    },
  ]);

  const refreshGrid = () => {
    if (gridApi) {
      gridApi.refreshInfiniteCache();
    }
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

  const handleLoadCourseUsers = () => {
    if (!selectedCourse) {
      toastWrapper('Vui lòng chọn khoá học', 'error');
      return;
    }

    drivingApi
      .getDrivings({
        limit: 1000,
        page: 1,
        ...(center && { center }),
        query: {
          course: selectedCourse,
        },
      })
      .then((res) => {
        setImportData(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const startImportStudent = () => {
    if (importData?.length === 0) {
      toastWrapper('Không có dữ liệu để nhập', 'error');
      return;
    }

    if (!selectedRow) {
      toastWrapper('Vui lòng chọn khoá học', 'error');
      return;
    }
    
    const courseInfo = drivingCourses.find(
      (item) => item.value === selectedCourse
    );

    if (!courseInfo) {
      return toastWrapper('Không tìm thấy khoá học', 'error');
    }

    const isConfirmed = window.confirm(
      'Tên đăng nhập và mật khẩu mặc định là số CCCD của học viên. Bạn có chắc chắn muốn nhập học viên không?'
    );

    if (!isConfirmed) return;

    const data = importData?.map((item) => {
      if (!item?.cardNumber) {
        return null;
      }
      if (!item?.name) {
        return null;
      }

      if(item?.elearningUserId) {
        return null;
      }

      if (
        !item?.course?.elearningCourseId ||
        !item?.course?.elearningCourseGroupId
      ) {
        toastWrapper('Khoá học chưa được đồng bộ với Elearning', 'error');
        return null;
      }

      return {
        firstname: item?.name,
        lastname: 'Học viên',
        lang: 'vi',
        email: item?.email || item?.cardNumber + '@uniapp.vn',
        username: item?.cardNumber,
        password: item?.cardNumber,
        customfields: [
          {
            type: 'classCode',
            value: item?.course?.code || '',
          },
          {
            type: 'className',
            value: item?.course?.name || '',
          },
          {
            type: 'studentId',
            value: item?._id,
          },
        ],
        preferences: [
          {
            type: 'auth_forcepasswordchange',
            value: 1,
          },
        ],
      };
    });

    const filteredData = data.filter((item) => item !== null);

    if(filteredData?.length === 0) {
      return toastWrapper('Không có học viên nào để nhập', 'error');
    }

    elearningApi
      .createCourseUsers(
        courseInfo?.elearningCourseId,
        courseInfo?.elearningCourseGroupId,
        filteredData
      )
      .then((res) => {
        console.log(res);
        toastWrapper(`Nhập thành công ${filteredData.length} học viên`, 'success');
        setImportData([]);
        setSelectedCourse(null);
        setSelectedRow(null);
        setShowAddModal(false);
      })
      .catch((err) => {
        toastWrapper(err.response.data.message, 'error');
      });
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
          paginationPageSize={20}
          paginationPageSizeSelectors={[10, 20, 50, 100]}
          pagination={true}
          rowData={elearningCourses}
        />
      </div>
      <Modal
        show={showStudentModal}
        onHide={() => setShowStudentModal(false)}
        size='xl'
        backdrop='static'
      >
        <Modal.Header closeButton>
          <Modal.Title>Danh sách tài khoản Elearning: {selectedRow?.fullname}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className='mb-3'>
            {courseUsers?.length > 0 ? (
              <div className='ag-theme-quartz' style={{ height: '400px' }}>
                <AgGridReact
                  columnDefs={[
                    {
                      field: 'fullname',
                      headerName: 'Họ và tên',
                    },
                    {
                      field: 'roles',
                      headerName: 'Vai trò',
                      valueFormatter: (params) => {
                        return params?.data?.roles
                          ?.map((item) => {
                            return ELEARNING_ROLES[item.shortname];
                          })
                          .join(', ');
                      },
                    },
                    {
                      field: 'email',
                      headerName: 'Email',
                    },
                    {
                      field: 'username',
                      headerName: 'Tên đăng nhập',
                    },
                    {
                      field: 'groups',
                      headerName: 'Khoá',
                      valueFormatter: (params) => {
                        return params?.data?.groups
                          ?.map((item) => item.name)
                          .join(', ');
                      },
                    },
                  ]}
                  rowData={courseUsers}
                />
              </div>
            ) : (
              <p>Không có tài khoản nào trong lớp học này</p>
            )}
          </Row>
          <Row>
            <Col className='text-end'>
              <Button
                variant='secondary'
                onClick={() => setShowStudentModal(false)}
              >
                Đóng
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        size='xl'
        backdrop='static'
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Thêm học viên vào Elearning: {selectedRow?.fullname}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className='mb-3'>
            <Col>
              <Form.Select
                onChange={(e) => {
                  setSelectedCourse(e.target.value);
                }}
              >
                <option value=''>Chọn Khoá</option>
                {drivingCourses.map((item) => {
                  return (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  );
                })}
              </Form.Select>
            </Col>
            <Col xs={1}>
              <Button variant='outline-primary' onClick={handleLoadCourseUsers}>
                <IoDownload size={25} />
              </Button>
            </Col>
          </Row>
          <Row className='mb-3'>
            {importData?.length > 0 ? (
              <div className='ag-theme-quartz' style={{ height: '400px' }}>
                <AgGridReact
                  columnDefs={[
                    {
                      field: 'name',
                      headerName: 'Họ và tên',
                    },
                    {
                      field: 'registrationCode',
                      headerName: 'Mã đăng ký',
                    },
                    {
                      field: 'cardNumber',
                      headerName: 'Số CCCD',
                    },
                    {
                      field: 'course.name',
                      headerName: 'Khoá học',
                    },
                    {
                      field: 'elearningUserId',
                      headerName: 'Elearning',
                      cellRenderer: (params) => {
                        return params?.data?.elearningUserId
                          ? <span className='text-success'>Đã có tài khoản</span>
                          : <span className='text-warning'>Chưa có tài khoản</span>;
                      },
                    },
                    {
                      field: 'action',
                      headerName: 'Thao tác',
                      cellRenderer: (params) => {
                        return (
                          <button
                            className='btn text-danger'
                            onClick={() => {
                              const newData = importData.filter(
                                (item) => item._id !== params?.data?._id
                              );
                              setImportData(newData);
                            }}
                          >
                            <MdDelete />
                          </button>
                        );
                      },
                    },
                  ]}
                  rowData={importData}
                />
              </div>
            ) : (
              <p className='text-center'>Không có dữ liệu</p>
            )}
          </Row>
          <Row>
            <Col className='text-center'>
              <Button onClick={startImportStudent}>
                Tiến hành nhập học viên
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AdminDrivingElearningPage;
