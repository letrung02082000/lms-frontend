import React, { useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import drivingApi from 'api/drivingApi';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import {
  MdClear,
  MdEdit,
  MdRotateLeft,
  MdSearch,
  MdQrCodeScanner,
  MdFlipCameraAndroid,
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

function AdminDrivingPage() {
  const { center, role: userRole } = JSON.parse(
    localStorage.getItem('user-info')
  );

  const key = 'aes123456789101112131415';
  const [updateParams, setUpdateParams] = useState({
    date: undefined,
    processState: undefined,
  });
  const [query, setQuery] = useState({});
  const [facingMode, setFacingMode] = useState('environment');
  const [searchText, setSearchText] = useState('');
  const [rowData, setRowData] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});
  const [pagination, setPagination] = useState({});
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrData, setQrData] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [drivingDates, setDrivingDates] = useState([{}]);
  const [drivingCourses, setdrivingCourses] = useState([]);
  const [frontUrl, setFrontUrl] = useState('');
  const [backUrl, setBackUrl] = useState('');
  const [portraitUrl, setPortraitUrl] = useState('');
  const [portraitUploading, setPortraitUploading] = useState(false);
  const [fixedDate, setFixedDate] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const {
    control,
    setValue,
    handleSubmit,
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: undefined,
    context: undefined,
    shouldFocusError: true,
    shouldUnregister: true,
    shouldUseNativeValidation: false,
    delayError: false,
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
              label: `${item.name} - ${item?.drivingType?.label || 'Chưa phân hạng'}`,
              value: item._id,
            };
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const ActionButton = (props) => {
    return (
      <button
        className='btn'
        onClick={() => {
          setSelectedRow(props.value);
          setShowEditModal(true);
        }}
      >
        <MdEdit />
      </button>
    );
  };

  const rowDataGetter = function (params) {
    return params.data;
  };

  const [colDefs, setColDefs] = useState([
    ...(userRole?.includes(ROLE.DRIVING.ADMIN) || userRole?.includes(ROLE.ADMIN)
      ? [
          {
            field: 'action',
            headerName: 'Thao tác',
            pinned: 'left',
            suppressHeaderMenuButton: true,
            cellRenderer: ActionButton,
            valueGetter: rowDataGetter,
            width: 90,
          },
        ]
      : []),
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
    ...(userRole?.includes(ROLE.ADMIN)
      ? [{ field: 'center.name', headerName: 'Trung tâm' }]
      : []),
  ]);

  useEffect(() => {
    drivingApi
      .getDrivingDate({
        filter: {
          ...(center && { center }),
          active: true,
        }
      })
      .then((res) => {
        setDrivingDates(res.data.map((item) => {
          return {
            label: `${new Date(item.date).toLocaleDateString('en-GB')} - ${item?.drivingType?.label || 'Chưa phân hạng'} - ${item?.description}`,
            value: item.date,
            center: item.center?._id,
            drivingType: item.drivingType?._id,
          };
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
    if(gridApi) {
      gridApi.refreshInfiniteCache();
    }
  };

  useEffect(() => {
    if (selectedRow && showEditModal) {
      Object.keys(selectedRow).forEach((key) => {
        setValue(key, selectedRow[key]);
      });

      if(selectedRow?.examDate) {
        setValue('examDate', {
          label: new Date(selectedRow?.examDate).toLocaleDateString('en-GB'),
          value: selectedRow?.examDate,
        });
      }

      if(selectedRow?.course) {
        setValue('course', {
          label: `${selectedRow?.course?.name}`,
          value: selectedRow?.course?._id,
        });
      }
    }
  }, [selectedRow, setValue, showEditModal]);
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
      const res = await fetch(url);
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

  const handleClose = () => setShowEditModal(false);

  const handleUpdateDrivingButton = async () => {
    await handleSubmit(async (formData) => {
      const dateInfo = drivingDates.filter(
        (item) => item?.value === formData.examDate?.value
      );

      console.log(dateInfo);

      const body = {
        ...formData,
        center: dateInfo[0]?.center,
        drivingType: dateInfo[0]?.drivingType,
        date: formData.examDate?.value,
        examDate: formData.examDate?.value,
        course: formData.course?.value,
      }

      console.log(formData);

      drivingApi
        .updateDriving(selectedRow._id, body)
        .then((res) => {
          toastWrapper('Cập nhật thành công', 'success');
          setShowEditModal(false);
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
        setShowEditModal(false);
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
        <button className='btn ms-2' onClick={() => setShowQRModal(true)}>
          <MdQrCodeScanner size={25} />
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
        show={showEditModal}
        onHide={handleClose}
        size={'lg'}
        backdrop={'static'}
      >
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật hồ sơ</Modal.Title>
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
          <div>
            <Row className='mb-3'>
              <Col>
                <InputField
                  hasAsterisk={true}
                  label='Tên học viên'
                  control={control}
                  name='name'
                  rules={{
                    maxLength: {
                      value: 50,
                      message: 'Độ dài tối đa <= 50 ký tự',
                    },
                    required: 'Vui lòng nhập trường này',
                  }}
                  onClear={handleClearButton}
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
                  hasAsterisk={true}
                  label='Số điện thoại liên hệ'
                  control={control}
                  name='tel'
                  type='number'
                  rules={{
                    maxLength: {
                      value: 10,
                      message: 'Số điện thoại phải có 10 chữ số',
                    },
                    minLength: {
                      value: 10,
                      message: 'Số điện thoại phải có 10 chữ số',
                    },
                    required: 'Vui lòng nhập trường này',
                  }}
                  onClear={handleClearButton}
                />
              </Col>
              <Col xs={1}>
                <QRCode value={selectedRow?.tel || ''} size={41} />
              </Col>
              <Col>
                <InputField
                  hasAsterisk={true}
                  label='Số điện thoại Zalo'
                  control={control}
                  name='zalo'
                  type='number'
                  rules={{
                    maxLength: {
                      value: 10,
                      message: 'Số điện thoại Zalo phải có 10 chữ số',
                    },
                    minLength: {
                      value: 10,
                      message: 'Số điện thoại Zalo phải có 10 chữ số',
                    },
                    required: 'Vui lòng nhập trường này',
                  }}
                  onClear={handleClearButton}
                />
              </Col>
              <Col xs={1}>
                <QRCode
                  value={`https://zalo.me/${selectedRow?.zalo || ''}`}
                  size={41}
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
            </Row>

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

            <Row className='mb-5'>
              <Col>
                <InputField
                  as='textarea'
                  label='Ghi chú'
                  control={control}
                  name='feedback'
                  rules={{
                    required: false,
                  }}
                  onClear={handleClearButton}
                />
              </Col>
            </Row>

            <Row className='mb-5'>
              <Col xs={5}>
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
          </div>
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
      <AccountModal
        show={showAccountModal}
        setShow={() => setShowAccountModal(false)}
        tel={selectedRow?.tel}
      />
    </div>
  );
}

export default AdminDrivingPage;
