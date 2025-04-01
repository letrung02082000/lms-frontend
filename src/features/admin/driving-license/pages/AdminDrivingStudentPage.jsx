import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import drivingApi from 'api/drivingApi';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Button, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import {
  MdClear,
  MdEdit,
  MdRotateLeft,
  MdSearch,
  MdQrCodeScanner,
  MdFlipCameraAndroid,
  MdAdd,
  MdImportExport,
  MdDelete,
  MdDeleteOutline,
} from 'react-icons/md';
import { useForm } from 'react-hook-form';
import InputField from 'components/form/InputField';
import FileUploader from 'components/form/FileUploader';
import { FILE_UPLOAD_URL } from 'constants/endpoints';
import { toastWrapper } from 'utils';
import Select from 'react-select';
import cryptojs from 'crypto-js';
import { Scanner } from '@yudiel/react-qr-scanner';
import CopyButton from 'components/button/CopyButton';
import { ROLE } from 'constants/role';
import AccountModal from 'features/driving-license/components/AccountModal';
import {
  DRIVING_STATE,
  DRIVING_STATE_LABEL,
  PAYMENT_METHODS,
} from '../constant';
import QRCode from 'react-qr-code';
import fileApi from 'api/fileApi';
import SelectField from 'components/form/SelectField';
import { yupResolver } from '@hookform/resolvers/yup';
import drivingStudentSchema from 'validations/driving-student.validation';
import TableEditButton from 'components/button/TableEditButton';
import {
  DRIVING_LICENSE_LEVELS,
  EXCEL_TYPE,
  EXPORT_HEADERS,
  GENDERS,
  IMPORT_HEADERS,
} from 'constants/driving-student.constant';
import moment from 'moment';

function AdminDrivingStudentPage() {
  const { center, role: userRole } = JSON.parse(
    localStorage.getItem('user-info')
  );
  const [drivingCenters, setDrivingCenters] = useState([]);
  const key = 'aes123456789101112131415';
  const [updateParams, setUpdateParams] = useState({
    date: undefined,
    processState: undefined,
  });
  const [query, setQuery] = useState({});
  const [selectedCourse, setSelectedCourse] = useState('');
  const [facingMode, setFacingMode] = useState('environment');
  const [searchText, setSearchText] = useState('');
  const [rowData, setRowData] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrData, setQrData] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showImportExportModal, setShowImportExportModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [drivingDates, setDrivingDates] = useState([{}]);
  const [drivingCourses, setdrivingCourses] = useState([]);
  const [frontUrl, setFrontUrl] = useState('');
  const [backUrl, setBackUrl] = useState('');
  const [portraitUrl, setPortraitUrl] = useState('');
  const [portraitUploading, setPortraitUploading] = useState(false);
  const [fixedDate, setFixedDate] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const { control, setValue, handleSubmit, reset, clearErrors } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(drivingStudentSchema),
    context: undefined,
    shouldFocusError: true,
    shouldUnregister: true,
    shouldUseNativeValidation: false,
    delayError: false,
  });
  const [importData, setImportData] = useState([]);

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
          ...(center && { center }),
          active: true,
        },
      })
      .then((res) => {
        setDrivingDates(
          res.data.map((item) => {
            return {
              label: `${new Date(item.date).toLocaleDateString('en-GB')} - ${
                item?.description
              } - ${item?.drivingType?.label || 'Chưa phân hạng'} - ${
                item?.center?.name
              }`,
              value: item.date,
              center: item.center?._id,
              drivingType: item.drivingType?._id,
            };
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const rowDataGetter = function (params) {
    return params.data;
  };

  const [colDefs] = useState(
    [
      (userRole?.includes(ROLE.DRIVING.ADMIN) ||
        userRole?.includes(ROLE.ADMIN)) && {
        field: 'action',
        headerName: 'Thao tác',
        pinned: 'left',
        suppressHeaderMenuButton: true,
        cellRenderer: TableEditButton,
        cellRendererParams: {
          clearErrors,
          reset,
          setSelectedRow,
          setIsEditMode,
          setShowModal,
        },
        valueGetter: rowDataGetter,
        width: 90,
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
      { field: 'name', headerName: 'Họ và tên' },
      {
        field: 'date',
        headerName: 'Ngày thi',
        valueFormatter: (params) => {
          return params.value
            ? new Date(params.value).toLocaleDateString('en-GB')
            : '';
        },
      },
      {
        field: 'course.name',
        headerName: 'Khoá',
      },
      { field: 'drivingType.label', headerName: 'Hạng thi' },
      { field: 'cash', headerName: 'Chuyển khoản' },
      {
        field: 'processState',
        headerName: 'Tình trạng',
        cellRenderer: (data) => {
          return DRIVING_STATE_LABEL[data.value];
        },
      },
      { field: 'source', headerName: 'Nguồn' },
      userRole?.includes(ROLE.ADMIN) && {
        field: 'center.name',
        headerName: 'Trung tâm',
      },
    ].filter(Boolean)
  );

  // useEffect(() => {
  //   const readQrData = async () => {
  //     if (qrData) {
  //       const qrText = qrData?.trim();
  //       const qrDataArr = qrText?.split('|');
  //       const searchText =
  //         qrText?.length === 10
  //           ? qrText
  //           : qrDataArr[2] ||
  //             cryptojs.AES.decrypt(qrDataArr[0], key)
  //               ?.toString(cryptojs.enc.Utf8)
  //               ?.split('.')[0] ||
  //             '';

  //       if (searchText?.length === 0) {
  //         return toastWrapper('Mã QR không hợp lệ', 'error');
  //       }

  //       setSearchText(searchText);
  //       drivingApi
  //         .getDrivings({ search: searchText, page: 1 })
  //         .then((res) => {
  //           setRowData(res.data);
  //           setPagination(res.pagination);

  //           if (res.data?.length === 0) {
  //             toastWrapper('Không tìm thấy hồ sơ', 'error');
  //           }

  //           if (
  //             updateParams?.date != undefined ||
  //             updateParams?.processState != undefined
  //           ) {
  //             const count = res.data.reduce((acc, cur) => {
  //               return (
  //                 acc + (cur.processState != DRIVING_STATE.CANCELLED ? 1 : 0)
  //               );
  //             }, 0);

  //             if (count > 1) {
  //               setShowQRModal(false);
  //               return toastWrapper(
  //                 `Tìm thấy ${count} hồ sơ cần xem xét`,
  //                 'warning'
  //               );
  //             }

  //             for (let i = 0; i < res.data?.length; i++) {
  //               if (res.data[i].processState != DRIVING_STATE.CANCELLED) {
  //                 setSelectedRow(res.data[i]);

  //                 if (fixedDate && fixedDate !== res.data[i].date) {
  //                   return toastWrapper('Không khớp ngày cố định', 'error');
  //                 }

  //                 drivingApi
  //                   .updateDriving(res.data[i]._id, updateParams)
  //                   .then((res) => {
  //                     if (updateParams?.date != undefined) {
  //                       toastWrapper(
  //                         'Đã cập nhật thành ngày ' +
  //                           new Date(updateParams?.date).toLocaleDateString(
  //                             'en-GB'
  //                           ),
  //                         'success'
  //                       );
  //                     }

  //                     if (updateParams?.processState != undefined) {
  //                       toastWrapper(
  //                         `${DRIVING_STATE_LABEL[updateParams.processState]}`,
  //                         'success'
  //                       );
  //                     }
  //                     refreshGrid(query, searchText, 1);
  //                   })
  //                   .catch((err) => {
  //                     toastWrapper(err.toString(), 'error');
  //                   });

  //                 break;
  //               }
  //             }
  //           } else {
  //             for (let i = 0; i < res.data?.length; i++) {
  //               if (res.data[i].processState != DRIVING_STATE.CANCELLED) {
  //                 setSelectedRow(res.data[i]);

  //                 if (fixedDate && fixedDate !== res.data[i].date) {
  //                   return toastWrapper('Không khớp ngày cố định', 'error');
  //                 }

  //                 break;
  //               }
  //             }
  //           }
  //         })
  //         .catch((err) => {
  //           toastWrapper(err.toString(), 'error');
  //         });
  //     }
  //   };
  //   readQrData();
  // }, [qrData]);

  const refreshGrid = async (query, searchText, page) => {
    if (gridApi) {
      gridApi.refreshInfiniteCache();
    }
  };

  useEffect(() => {
    if (selectedRow && showModal && isEditMode) {
      fetchImage();

      Object.keys(selectedRow).forEach((key) => {
        setValue(key, selectedRow[key]);
      });

      if (selectedRow?.examDate) {
        setValue('examDate', {
          label: new Date(selectedRow?.examDate).toLocaleDateString('en-GB'),
          value: selectedRow?.examDate,
        });
      }

      if (selectedRow?.course) {
        setValue('course', {
          label: `${selectedRow?.course?.name}`,
          value: selectedRow?.course?._id,
        });
      }

      setValue(
        'otherLicense',
        selectedRow?.otherLicense?.map((item) => {
          return {
            value: item,
            label: DRIVING_LICENSE_LEVELS[item],
          };
        })
      );

      setValue('gender', {
        value: selectedRow?.gender,
        label: GENDERS[selectedRow?.gender],
      });
    } else {
      setValue('center', {
        label: drivingCenters[0]?.name,
        value: drivingCenters[0]?._id,
      });
    }
  }, [selectedRow, setValue, showModal]);
  const fetchImage = async (type, url) => {
    if (type === 'portrait' || type === undefined) {
      fileApi
        .getSignedUrl(url || selectedRow.portraitUrl)
        .then(async (res) => {
          setPortraitUrl(res?.data?.signedUrl);
        })
        .catch((err) => {
          setPortraitUrl(selectedRow?.portraitUrl);
        });
    }

    if (type === 'front' || type === undefined) {
      fileApi
        .getSignedUrl(url || selectedRow.frontUrl)
        .then(async (res) => {
          setFrontUrl(res?.data?.signedUrl);
        })
        .catch((err) => {
          setFrontUrl(selectedRow?.frontUrl);
        });
    }

    if (type === 'back' || type === undefined) {
      fileApi
        .getSignedUrl(url || selectedRow.backUrl)
        .then(async (res) => {
          setBackUrl(res?.data?.signedUrl);
        })
        .catch((err) => {
          setBackUrl(selectedRow?.backUrl);
        });
    }
  };

  const downloadImage = async (url, name) => {
    try {
      const res = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
      });
      const blob = await res.blob();
      const urlBlob = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = urlBlob;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateImageButton = (id, data, type) => {
    drivingApi
      .updateDriving(id, data)
      .then((res) => {
        setSelectedRow({ ...selectedRow, ...res.data });
        fetchImage(type);
        refreshGrid(query, searchText);
        toastWrapper('Cập nhật thành công', 'success');
      })
      .catch((e) => {
        toastWrapper('Cập nhật thất bại', 'error');
      });
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleUpdateDrivingButton = async () => {
    await handleSubmit(async (formData) => {
      const dateInfo = drivingDates.filter(
        (item) => item?.value === formData.examDate?.value
      );

      const body = {
        ...formData,
        center: dateInfo[0]?.center,
        drivingType: dateInfo[0]?.drivingType,
        date: formData.examDate?.value,
        examDate: formData.examDate?.value,
        course: formData.course?.value,
        gender: formData.gender?.value,
        otherLicense: formData.otherLicense?.map((item) => item.value),
      };

      drivingApi
        .updateDriving(selectedRow._id, body)
        .then((res) => {
          toastWrapper('Cập nhật thành công', 'success');
          setShowModal(false);
          refreshGrid();
        })
        .catch((err) => {
          toastWrapper(err.response.data.message, 'error');
        });
    })();
  };

  const handleSearchButton = () => {
    const dataSource = getDataSource(searchText, query);
    gridApi.setGridOption('datasource', dataSource);
  };

  const handleClearButton = (name) => {
    setValue(name, '');
  };

  const updateProcessState = (id, processState) => {
    drivingApi
      .updateProcessState(id, processState)
      .then((res) => {
        toastWrapper(
          'Đã cập nhật thành ' + DRIVING_STATE_LABEL[processState],
          'success'
        );
        refreshGrid(query, searchText);
        setShowModal(false);
      })
      .catch((err) => {
        toastWrapper(err.response.data.message, 'error');
      });
  };

  const rotateImage = (id) => {
    const tmp = document.getElementById(id);
    tmp.style.transform = `rotate(${
      (tmp.getAttribute('data-rotate') || 0) - 90
    }deg)`;
    tmp.setAttribute(
      'data-rotate',
      (tmp.getAttribute('data-rotate') || 0) - 90
    );
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    const dataSource = getDataSource();
    params.api.setGridOption('datasource', dataSource);
  };

  const getDataSource = (search, query) => {
    return {
      rowCount: null,
      getRows: async (params) => {
        const { startRow, endRow } = params;
        try {
          const res = await drivingApi.getDrivings({
            ...(center && { center }),
            limit: endRow - startRow,
            page: Math.floor(startRow / (endRow - startRow)) + 1,
            ...(query && { query }),
            ...(search && { search }),
          });
          params.successCallback(res.data, res.pagination.totalDocs);
        } catch (error) {
          params.failCallback();
        }
      },
    };
  };

  const handleAddStudentBtn = () => {
    reset();
    setIsEditMode(false);
    setShowModal(true);
  };

  const handleExportBtn = () => {
    if (!selectedCourse) {
      return toastWrapper('Vui lòng chọn khoá học cần xuất danh sách', 'error');
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
        const excelData = res.data.map((item, index) => {
          const ret = Object.keys(EXPORT_HEADERS).reduce((acc, key) => {
            acc[EXPORT_HEADERS[key]] = item[key] || '';

            if (key === 'examDate') {
              acc[EXPORT_HEADERS[key]] = item.examDate
                ? new Date(item.examDate).toLocaleDateString('en-GB')
                : '';
            }

            return acc;
          }, {});
          return ret;
        });

        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Học viên');
        const excelBuffer = XLSX.write(wb, {
          bookType: 'xlsx',
          type: 'array',
        });
        const data = new Blob([excelBuffer], {
          type: EXCEL_TYPE,
        });
        FileSaver.saveAs(data, 'driving-student.xlsx');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleImportBtn = () => {
    if (!selectedCourse) {
      return toastWrapper('Vui lòng chọn khoá học cần nhập danh sách', 'error');
    }

    const file = document.getElementById('student_file').files[0];

    if (!file) {
      return toastWrapper('Vui lòng chọn tệp để nhập danh sách', 'error');
    }

    setImportData([]);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
      });
      const headers = jsonData[0];
      const rows = jsonData.slice(1);
      const result = rows
        .map((row) => {
          const obj = {};
          headers.forEach((header, index) => {
            if (Object.keys(IMPORT_HEADERS).includes(header)) {
              obj[IMPORT_HEADERS[header]] = row[index];
            }
          });

          if (Object.keys(obj).length === 0) {
            return false;
          }

          return obj;
        })
        .filter(Boolean);

      console.log(result);

      if (
        result.filter(
          (item) =>
            item?.name === '' ||
            item?.registrationCode === '' ||
            item?.name === undefined ||
            item?.registrationCode === undefined
        ).length > 0
      ) {
        return toastWrapper('Tên và mã học viên không được để trống', 'error');
      }

      setImportData((_prev) => [..._prev, ...result]);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleStartImportBtn = async () => {
    if (!importData || importData.length === 0) {
      return;
    }

    const courseInfo = drivingCourses.filter(
      (item) => item.value === selectedCourse
    )[0];

    if (
      !window.confirm(
        `Bạn có chắc chắn muốn nhập ${importData.length} học viên vào khoá ${courseInfo.label}?`
      )
    ) {
      return;
    }

    let statusMessages = {};
    let successCount = 0;

    await Promise.all(
      importData.map(async (item) => {
        const body = {
          ...item,
          center: center,
          course: selectedCourse,
        };

        try {
          const res = await drivingApi.getDrivings({
            query: { registrationCode: body.registrationCode },
          });
          if (res.data.length > 0) {
            statusMessages[body.registrationCode] = 'existed';
          } else {
            await drivingApi.addDriving(body);
            statusMessages[body.registrationCode] = 'success';
            successCount++;
          }
        } catch (error) {
          statusMessages[body.registrationCode] = 'error';
        }
      })
    );

    setImportData((prev) =>
      prev.map((item) => ({
        ...item,
        status: statusMessages[item.registrationCode],
      }))
    );

    if (successCount > 0) {
      toastWrapper(
        `Đã nhập ${successCount} học viên thành công vào khoá ${courseInfo.label}`,
        'success'
      );
    }
  };

  return (
    <div
      style={{
        height: '100vh',
      }}
    >
      <div style={{ height: '9%' }} className='d-flex align-items-center ps-3'>
        <div className='w-100 position-relative'>
          <Form.Control
            type='text'
            value={searchText}
            placeholder='Tìm theo tên hoặc số điện thoại'
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button
            className='btn position-absolute end-0 top-50 translate-middle p-0'
            onClick={() => {
              setSearchText('');
              const dataSource = getDataSource('', query);
              gridApi.setGridOption('datasource', dataSource);
            }}
          >
            <MdClear />
          </button>
        </div>
        <button className='btn ms-2' onClick={handleSearchButton}>
          <MdSearch size={25} />
        </button>
        {/* <button className='btn ms-2' onClick={() => setShowQRModal(true)}>
          <MdQrCodeScanner size={25} />
        </button> */}
        <button
          className='btn mx-2'
          onClick={() => setShowImportExportModal(true)}
        >
          <MdImportExport size={25} />
        </button>
      </div>
      <div className='ag-theme-quartz' style={{ height: '90%' }}>
        <AgGridReact
          columnDefs={colDefs}
          pagination={true}
          paginationPageSize={20}
          rowModelType={'infinite'}
          cacheBlockSize={20}
          paginationPageSizeSelector={[20, 50, 100]}
          onGridReady={onGridReady}
        />
      </div>
      <Modal
        show={showModal}
        onHide={handleClose}
        size={'xl'}
        backdrop={'static'}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditMode ? 'Cập nhật thông tin học viên' : 'Thêm học viên'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='d-flex flex-wrap justify-content-center mb-3'>
            {Object.keys(DRIVING_STATE).map((key) => {
              return (
                <Button
                  key={key}
                  onClick={() =>
                    updateProcessState(selectedRow?._id, DRIVING_STATE[key])
                  }
                  variant={
                    selectedRow?.processState === DRIVING_STATE[key]
                      ? 'primary'
                      : 'outline-primary'
                  }
                  className='m-2'
                >
                  {DRIVING_STATE_LABEL[DRIVING_STATE[key]]}
                </Button>
              );
            })}
          </div>
          <Row>
            <Col>
              <Row className='mb-3'>
                <Col>
                  <InputField
                    label='Tên học viên'
                    control={control}
                    name='name'
                  />
                </Col>
                <Col>
                  <SelectField
                    label='Khoá'
                    name='course'
                    control={control}
                    options={drivingCourses}
                    isClearable={false}
                  />
                </Col>
              </Row>

              <Row className='mb-3 align-items-end'>
                <Col>
                  <InputField
                    label='Số điện thoại liên hệ'
                    control={control}
                    name='tel'
                  />
                </Col>
                <Col xs={1}>
                  <QRCode value={selectedRow?.tel || ''} size={41} />
                </Col>
                <Col>
                  <InputField
                    label='Số điện thoại Zalo'
                    control={control}
                    name='zalo'
                  />
                </Col>
                <Col xs={1}>
                  <QRCode
                    value={`https://zalo.me/${selectedRow?.zalo || ''}`}
                    size={41}
                  />
                </Col>
              </Row>
              <Row className='mb-3 align-items-end'>
                <Col>
                  <SelectField
                    label='Giới tính'
                    name='gender'
                    control={control}
                    options={Object.keys(GENDERS).map((key) => ({
                      value: key,
                      label: GENDERS[key],
                    }))}
                    isClearable={false}
                  />
                </Col>
                <Col>
                  <InputField
                    label='Ngày sinh'
                    control={control}
                    name='dob'
                    type='date'
                    noClear={true}
                  />
                </Col>
              </Row>
              <Row className='mb-3 align-items-end'>
                <Col>
                  <InputField
                    label='Số CCCD/CMND'
                    control={control}
                    name='cardNumber'
                  />
                </Col>
                <Col>
                  <InputField
                    label='Nơi cấp'
                    control={control}
                    name='cardProvider'
                  />
                </Col>
              </Row>
              <Row className='mb-3 align-items-end'>
                <Col>
                  <InputField
                    label='Địa chỉ'
                    control={control}
                    name='address'
                  />
                </Col>
                <Col>
                  <InputField
                    label='Ngày cấp'
                    control={control}
                    name='cardProvidedDate'
                    type='date'
                    noClear={true}
                  />
                </Col>
              </Row>
              <Row className='mb-3'>
                <Col>
                  <SelectField
                    label='Ngày thi'
                    name='examDate'
                    control={control}
                    options={drivingDates}
                    isClearable={false}
                  />
                </Col>
                <Col>
                  <SelectField
                    label='Hạng khác'
                    name='otherLicense'
                    control={control}
                    options={Object.keys(DRIVING_LICENSE_LEVELS).map((key) => {
                      return {
                        label: DRIVING_LICENSE_LEVELS[key],
                        value: key,
                      };
                    })}
                    isMulti={true}
                    isClearable={false}
                  />
                </Col>
              </Row>

              {selectedRow?.center?.useOnlinePayment && (
                <Row className='mb-3'>
                  <Col>
                    <label
                      className='d-block form-label'
                      style={{ marginBottom: '0.5rem' }}
                    >
                      Phương thức
                    </label>
                    <div>
                      {' '}
                      {selectedRow?.paymentMethod === PAYMENT_METHODS.DIRECT &&
                        'Thanh toán trực tiếp'}
                      {selectedRow?.paymentMethod ===
                        PAYMENT_METHODS.BANK_TRANSFER && 'Chuyển khoản'}
                    </div>
                  </Col>
                  <Col>
                    <label className='d-block form-label'>Mã giao dịch</label>
                    <div>{selectedRow?.transactionId}</div>
                  </Col>
                  <Col>
                    <InputField
                      noClear={true}
                      label='Số tiền'
                      control={control}
                      name='cash'
                      type='number'
                      disabled={true}
                    />
                  </Col>
                  <Col>
                    <label
                      className='d-block form-label'
                      style={{ marginBottom: '0.5rem' }}
                    >
                      Thanh toán
                    </label>
                    <Button
                      className='w-100'
                      onClick={() => setShowAccountModal(true)}
                    >
                      Hiện mã
                    </Button>
                  </Col>
                </Row>
              )}

              <Row className='mb-5'>
                <Col>
                  <InputField
                    as='textarea'
                    label='Ghi chú'
                    control={control}
                    name='feedback'
                    onClear={handleClearButton}
                  />
                </Col>
              </Row>
            </Col>

            {(frontUrl || backUrl || portraitUrl) && (
              <Col>
                <Row className='mb-5'>
                  <Col xs={5}>
                    <label className='d-block form-label'>Ảnh chân dung</label>
                    <div>
                      <img
                        id='portrait'
                        alt='portrait'
                        src={portraitUrl}
                        width='100%'
                      />
                    </div>
                    <div className='my-3 d-flex justify-content-center align-items-center'>
                      <Button
                        variant='outline-primary'
                        onClick={() => rotateImage('portrait')}
                      >
                        <MdRotateLeft /> Xoay
                      </Button>
                      <Button
                        className='ms-3'
                        onClick={() =>
                          downloadImage(
                            portraitUrl,
                            `${selectedRow?.name}-${selectedRow?.tel}-portrait.png`
                          )
                        }
                      >
                        Tải xuống
                      </Button>
                      <FileUploader
                        className='ms-3'
                        name='file'
                        text='Tải lên'
                        hasLabel={false}
                        url={FILE_UPLOAD_URL}
                        uploading={portraitUploading}
                        setUploading={setPortraitUploading}
                        onResponse={(res) =>
                          handleUpdateImageButton(
                            selectedRow?._id,
                            {
                              portraitUrl: res?.data?.url,
                            },
                            'portrait'
                          )
                        }
                      />
                    </div>
                  </Col>
                  <Col>
                    <label className='d-block form-label'>Ảnh mặt trước</label>
                    <div>
                      <img
                        id='front-card'
                        alt='front-card'
                        src={frontUrl}
                        width='100%'
                      />
                    </div>
                    <div className='my-3 d-flex justify-content-center align-items-center'>
                      <Button
                        variant='outline-primary'
                        onClick={() => rotateImage('front-card')}
                      >
                        <MdRotateLeft /> Xoay
                      </Button>
                      <Button
                        className='ms-3'
                        onClick={() =>
                          downloadImage(
                            frontUrl,
                            `${selectedRow?.name}-${selectedRow?.tel}-front.png`
                          )
                        }
                      >
                        Tải xuống
                      </Button>
                      <FileUploader
                        className='ms-3'
                        name='file'
                        text='Tải lên'
                        hasLabel={false}
                        url={FILE_UPLOAD_URL}
                        uploading={portraitUploading}
                        setUploading={setPortraitUploading}
                        onResponse={(res) =>
                          handleUpdateImageButton(
                            selectedRow?._id,
                            {
                              frontUrl: res?.data?.url,
                            },
                            'front'
                          )
                        }
                      />
                    </div>
                    <label className='d-block form-label'>Ảnh mặt sau</label>
                    <div>
                      <img
                        id='back-card'
                        alt='back-card'
                        src={backUrl}
                        width='100%'
                      />
                    </div>
                    <div className='my-3 d-flex justify-content-center align-items-center'>
                      <Button
                        variant='outline-primary'
                        onClick={() => rotateImage('back-card')}
                      >
                        <MdRotateLeft /> Xoay
                      </Button>
                      <Button
                        className='ms-3'
                        onClick={() =>
                          downloadImage(
                            backUrl,
                            `${selectedRow?.name}-${selectedRow?.tel}-back.png`
                          )
                        }
                      >
                        Tải xuống
                      </Button>
                      <FileUploader
                        className='ms-3'
                        name='file'
                        text='Tải lên'
                        hasLabel={false}
                        url={FILE_UPLOAD_URL}
                        uploading={portraitUploading}
                        setUploading={setPortraitUploading}
                        onResponse={(res) =>
                          handleUpdateImageButton(
                            selectedRow?._id,
                            {
                              backUrl: res?.data?.url,
                            },
                            'back'
                          )
                        }
                      />
                    </div>
                  </Col>
                </Row>
              </Col>
            )}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='primary' onClick={handleUpdateDrivingButton}>
            Cập nhật
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showQRModal} onHide={() => setShowQRModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <span className='me-3'>Quét hồ sơ</span>
            <Button
              variant='outline-primary'
              onClick={() =>
                setFacingMode(
                  facingMode === 'environment' ? 'user' : 'environment'
                )
              }
            >
              <MdFlipCameraAndroid size={25} />
            </Button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Scanner
            constraints={{ facingMode: facingMode }}
            onScan={(result) => {
              setQrData(result[0]?.rawValue);
            }}
          /> */}
          <Form.Group className='my-3' as={Row}>
            {selectedRow?.name && (
              <>
                <Form.Label className='text-center'>
                  {selectedRow?.name}
                  {' - '}
                  {selectedRow?.tel} <CopyButton text={rowData?.[0]?.tel} />
                </Form.Label>
                <Form.Text className='text-center'>
                  {new Date(selectedRow?.date).toLocaleDateString('en-GB')}
                  {' - '}
                  {DRIVING_STATE_LABEL[selectedRow?.processState]}
                </Form.Text>
              </>
            )}
          </Form.Group>
          <Form.Group className='my-3' as={Row}>
            <Form.Label column sm='4'>
              Ngày dự thi ban đầu
            </Form.Label>
            <Col>
              <Select
                isClearable
                options={drivingDates}
                onChange={(val) => setFixedDate(val?.value || undefined)}
              />
            </Col>
          </Form.Group>
          <Form.Group className='my-3' as={Row}>
            <Form.Label column sm='4'>
              Ngày dự thi mới
            </Form.Label>
            <Col>
              <Select
                isClearable
                options={drivingDates}
                onChange={(val) => {
                  setUpdateParams({
                    ...updateParams,
                    date: val?.value || undefined,
                  });
                }}
              />
            </Col>
          </Form.Group>
          <Form.Group className='mb-3' as={Row}>
            <Form.Label column sm='4'>
              Trạng thái mới
            </Form.Label>
            <Col>
              <Select
                isClearable
                options={Object.keys(DRIVING_STATE).map((key) => {
                  return {
                    label: DRIVING_STATE_LABEL[DRIVING_STATE[key]],
                    value: DRIVING_STATE[key],
                  };
                })}
                onChange={(val) =>
                  setUpdateParams({
                    ...updateParams,
                    processState: val?.value,
                  })
                }
              />
            </Col>
          </Form.Group>
        </Modal.Body>
      </Modal>
      <Modal
        size='xl'
        show={showImportExportModal}
        onHide={() => {
          refreshGrid(query, searchText);
          setSelectedCourse('');
          setShowImportExportModal(false)
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Nhập/Xuất danh sách học viên</Modal.Title>
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
            <Col xs={2}>
              <Button className='w-100' onClick={handleExportBtn}>
                Xuất danh sách
              </Button>
            </Col>
          </Row>
          <Row className='mb-3'>
            <Col>
              <Form.Control
                className='w-100'
                type='file'
                accept='.xlsx, .xls'
                id='student_file'
              />
            </Col>
            <Col xs={2}>
              <Button className='w-100' onClick={handleImportBtn}>
                Đọc danh sách
              </Button>
            </Col>
          </Row>
          <Row>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>STT</th>
                  {Object.keys(IMPORT_HEADERS).map((header) => {
                    return <th key={header}>{header}</th>;
                  })}
                  <th>Thao tác</th>
                  <th>Kết quả</th>
                </tr>
              </thead>
              <tbody>
                {importData?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      {Object.keys(IMPORT_HEADERS).map((header) => {
                        return (
                          <td key={header}>{item[IMPORT_HEADERS[header]]}</td>
                        );
                      })}
                      <td>
                        <button
                          className='btn text-danger'
                          onClick={() => {
                            setImportData((prev) =>
                              prev.filter((_, i) => i !== index)
                            );
                          }}
                        >
                          <MdDeleteOutline />
                        </button>
                      </td>
                      <td>
                        {item?.status === 'success' && (
                          <span className='text-success'>Thành công</span>
                        )}
                        {item?.status === 'error' && (
                          <span className='text-danger'>Lỗi</span>
                        )}
                        {item?.status === 'existed' && (
                          <span className='text-danger'>
                            Lỗi (mã học viên đã tồn tại)
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Row>
          <Row>
            <Col>
              <Button onClick={handleStartImportBtn}>Tiến hành nhập</Button>
            </Col>
          </Row>
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
        onClick={handleAddStudentBtn}
      >
        <MdAdd />
      </Button>
      <AccountModal
        show={showAccountModal}
        setShow={() => setShowAccountModal(false)}
        tel={selectedRow?.tel}
      />
    </div>
  );
}

export default AdminDrivingStudentPage;
