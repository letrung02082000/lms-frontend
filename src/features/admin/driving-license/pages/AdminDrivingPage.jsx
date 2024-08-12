import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import drivingApi from 'api/drivingApi';
import { Button, Col, Form, FormControl, Modal, Offcanvas, Pagination, Row } from 'react-bootstrap';
import { MdClear, MdEdit, MdFilterList, MdRotateLeft, MdSearch, MdQrCodeScanner, MdFlipCameraAndroid } from 'react-icons/md';
import { useForm } from 'react-hook-form';
import InputField from 'components/form/InputField';
import SelectField from 'components/form/SelectField';
import FileUploader from 'components/form/FileUploader';
import { FILE_UPLOAD_URL } from 'constants/endpoints';
import { ToastWrapper, toastWrapper } from 'utils';
import Select from 'react-select';
import cryptojs from 'crypto-js'
import { Scanner } from '@yudiel/react-qr-scanner';
import CopyButton from 'components/button/CopyButton';

function AdminDrivingA1Page() {
  const PROCESS_STATE = {
    CREATED: 0,
    WAITING_FOR_UPDATE: 1,
    WAITING_FOR_PAYMENT: 2,
    COMPLETED: 3,
    CANCELLED: 4,
  }
  const key = 'aes123456789101112131415';
  const [updateParams, setUpdateParams] = useState({
    date: undefined,
    processState: undefined,
  });
  const [query, setQuery] = useState({});
  const [facingMode, setFacingMode] = useState('environment');
  const [searchText, setSearchText] = useState('');
  const [searchData, setSearchData] = useState({});
  const [page, setPage] = useState(1);
  const [rowData, setRowData] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});
  const [pagination, setPagination] = useState({});
  const [show, setShow] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrData, setQrData] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [visibleDate, setVisibleDate] = useState([{}]);
  const [portraitUploading, setPortraitUploading] = useState(false);
  const [frontUploading, setFrontUploading] = useState(false);
  const [backUploading, setBackUploading] = useState(false);
  const {
    control,
    setValue,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
    watch,
    setFocus,
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
  const ActionButton = (props) => {
    return (
      <div className='w-100 d-flex justify-content-center'>
        <button
          className='btn'
          onClick={() => {
            setSelectedRow(props.value);
            setShowEditModal(true);
          }}
        >
          <MdEdit />
        </button>
      </div>
    );
  };

  const rowDataGetter = function (params) {
    return params.data;
  };

  const PaymentCheckbox = (props) => {
    return (
      <div className='d-flex justify-content-center pt-2'>
        <Form.Check type='switch' defaultChecked={props.data.isPaid} onClick={(e) => {
          drivingApi
            .updateDriving(props.data._id, { isPaid: e.target.checked })
            .then((res) => {
              toastWrapper('Cập nhật thành công', 'success');
            })
            .catch((err) => {
              toastWrapper(err.response.data.message, 'error');
            });
        }}/>
      </div>
    );
  }

  const HealthCheckbox = (props) => {
    return (
      <div className='d-flex justify-content-center pt-2'>
        <Form.Check type='switch' defaultChecked={props.data.healthChecked} onClick={(e) => {
          drivingApi
            .updateDriving(props.data._id, { healthChecked: e.target.checked })
            .then((res) => {
              toastWrapper('Cập nhật thành công', 'success');
            })
            .catch((err) => {
              toastWrapper(err.response.data.message, 'error');
            });
        }}/>
      </div>
    );
  }

  const FileCheckbox = (props) => {
    return (
      <div className='d-flex justify-content-center pt-2'>
        <Form.Check type='switch' defaultChecked={props.data.hasFile} onClick={(e) => {
          drivingApi
            .updateDriving(props.data._id, { hasFile: e.target.checked })
            .then((res) => {
              toastWrapper('Cập nhật thành công', 'success');
            })
            .catch((err) => {
              toastWrapper(err.response.data.message, 'error');
            });
        }}/>
      </div>
    );
  }

  const [colDefs, setColDefs] = useState([
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
    { field: 'name', headerName: 'Họ và tên', flex: 2 },
    { field: 'zalo', headerName: 'Zalo', flex: 1 },
    {
      field: 'date',
      headerName: 'Ngày dự thi',
      flex: 1,
      cellRenderer: (data) => {
        return data.value
          ? new Date(data.value).toLocaleDateString('en-GB')
          : '';
      },
    },
    { field: 'cash', headerName: 'Chuyển khoản', flex: 1 },
    {
      field: 'action',
      headerName: 'Thao tác',
      cellRenderer: ActionButton,
      flex: 1,
      valueGetter: rowDataGetter,
    },
  ]);

  useEffect(() => {
    fetchDrivings(query, searchText, page);

    drivingApi
      .getDateVisible()
      .then((res) => {
        const date = res.data.map((item) => {
          return {
            label: new Date(item.date).toLocaleDateString('en-GB'),
            value: item.date,
          };
        });
        setVisibleDate(date);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page, query]);

  useEffect(() => {
    if (qrData) {
      const qrDataArr = qrData.split('|');
      const searchText =
        qrDataArr[2] ||
        cryptojs.AES.decrypt(qrDataArr[0], key).toString(cryptojs.enc.Utf8);
      setSearchText(searchText);
      drivingApi
        .getDrivings(query, searchText, 1)
        .then((res) => {
          setRowData(res.data);
          setPagination(res.pagination);

          if(res.data.length === 0) {
            toastWrapper('Không tìm thấy hồ sơ', 'error');
          }

          if (updateParams?.date != undefined || updateParams?.processState != undefined) {
            for (let i = 0; i < res.data.length; i++) {
              setSelectedRow(res.data[i]);
              if (res.data[i].processState != PROCESS_STATE.CANCELLED) {
                drivingApi
                    .updateDriving(res.data[i]._id, updateParams)
                    .then((res) => {
                      if(updateParams?.date != undefined) {
                        toastWrapper(
                          'Đã cập nhật thành ngày ' +
                            new Date(updateParams.date).toLocaleDateString(
                              'en-GB'
                            ),
                          'success'
                        );
                      }

                      if (updateParams?.processState != undefined) {
                        toastWrapper(
                          `${
                            updateParams.processState === 0
                              ? 'Đã tạo'
                              : updateParams.processState === 1
                              ? 'Chờ cập nhật'
                              : updateParams.processState === 2
                              ? 'Chờ thanh toán'
                              : updateParams.processState === 3
                              ? 'Đã hoàn tất'
                              : 'Đã huỷ'
                          }`,
                          'success'
                        );
                      }
                      fetchDrivings(query, searchText, 1);
                    })
                    .catch((err) => {
                      toastWrapper(err.toString(), 'error');
                    });
  
              }
            }
          }
        })
        .catch((err) => {
          toastWrapper(err.toString(), 'error');
        });
    }
  }, [qrData]);

  const fetchDrivings = async (query, searchText, page) => {
    drivingApi
      .getDrivings(query, searchText, page)
      .then((res) => {
        setRowData(res.data);
        setPagination(res.pagination);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect( async() => {
    setValue('name', selectedRow.name);
    setValue('tel', selectedRow.tel);
    setValue('zalo', selectedRow.zalo);
    setValue('feedback', selectedRow.feedback);

    if(showEditModal) {
      const portraitResponse = await fetch(selectedRow.portraitUrl);
      const portraitBlob = await portraitResponse.blob();
      const portraitReader = new FileReader();
      portraitReader.readAsDataURL(portraitBlob);
      portraitReader.onloadend = () => {
        const portraitElement = document.getElementById(`portrait`);
        portraitElement.src = portraitReader.result;
        portraitElement.style.objectFit = 'contain';
        document.getElementById('portrait-link').href = portraitReader.result;
        portraitElement.height = 350;
        portraitElement.style.objectFit = 'contain';
      }

      const frontResponse = await fetch(selectedRow.frontUrl);
      const frontBlob = await frontResponse.blob();
      const frontReader = new FileReader();
      frontReader.readAsDataURL(frontBlob);
      frontReader.onloadend = () => {
        const frontElement = document.getElementById(`front-card`);
        frontElement.src = frontReader.result;
        frontElement.style.objectFit = 'contain';
        document.getElementById('front-link').href = frontReader.result;
        frontElement.height = 250;
        frontElement.style.objectFit = 'contain';
      }

      const backResponse = await fetch(selectedRow.backUrl);
      const backBlob = await backResponse.blob();
      const backReader = new FileReader();
      backReader.readAsDataURL(backBlob);
      backReader.onloadend = () => {
        const backElement = document.getElementById(`back-card`);
        backElement.src = backReader.result;
        backElement.style.objectFit = 'contain';
        document.getElementById('back-link').href = backReader.result;
        backElement.height = 250;
        backElement.style.objectFit = 'contain';
      }
    }
  }, [selectedRow, showEditModal]);

  const handleClose = () => setShowEditModal(false);

  const handleUpdateDrivingButton = async () => {
    await handleSubmit(async (data) => {
      if (data.date === undefined) {
        delete data.date;
      } else {
        data.date = data.date.value;
      }

      drivingApi.updateDriving(selectedRow._id, data).then((res) => {
        toastWrapper('Cập nhật thành công', 'success');
        setShowEditModal(false);
        fetchDrivings(query, searchText, page);

      }).catch((err) => {
        toastWrapper(err.response.data.message, 'error');
      });
    })();
  }

  const handleSearchButton = () => {
   fetchDrivings(query, searchText, page);
  };

  const handleClearButton = (name) => {
    setValue(name, '');
  }

  const updateProcessState = (id, processState) => {
    drivingApi.updateProcessState(id, processState).then((res) => {
      const message = processState === 0 ? 'Đã tạo' : processState === 1 ? 'Chờ cập nhật' : processState === 2 ? 'Chờ thanh toán' : processState === 3 ? 'Đã hoàn tất' : 'Đã huỷ';
      toastWrapper('Đã cập nhật thành ' + message, 'success');
      fetchDrivings(query, searchText, page);
      setShowEditModal(false);
    }).catch((err) => {
      toastWrapper(err.response.data.message, 'error');
    }
    );
  }

  const rotateImage = (id) => {
    const tmp = document.getElementById(id);
    tmp.style.transform = `rotate(${(tmp.getAttribute('data-rotate') || 0) - 90}deg)`;
    tmp.setAttribute('data-rotate', (tmp.getAttribute('data-rotate') || 0) - 90);
  }

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
              fetchDrivings(query, '', page);
            }}
          >
            <MdClear />
          </button>
        </div>
        <button className='btn ms-2' onClick={handleSearchButton}>
          <MdSearch size={25} />
        </button>
        <button className='btn ms-2' onClick={() => setShow(true)}>
          <MdFilterList size={25} />
        </button>
        <button className='btn ms-2' onClick={() => setShowQRModal(true)}>
          <MdQrCodeScanner size={25} />
        </button>
      </div>
      <div className='ag-theme-quartz' style={{ height: '85%' }}>
        <AgGridReact rowData={rowData} columnDefs={colDefs} />
      </div>
      <Pagination
        className='d-flex justify-content-center align-items-center'
        style={{
          height: '6%',
        }}
      >
        <Pagination.Item>
          {pagination.start +
            '-' +
            pagination.end +
            ' của ' +
            pagination.totalCount}
        </Pagination.Item>
        <Pagination.First onClick={() => setPage(1)}></Pagination.First>
        <Pagination.Prev
          onClick={() => setPage(page - 1)}
          disabled={page <= 1}
        />
        <Pagination.Item active>
          {pagination.page}/{pagination.totalPage}
        </Pagination.Item>
        <Pagination.Next
          onClick={() => setPage(page + 1)}
          disabled={page >= pagination.totalPage}
        />
        <Pagination.Last
          onClick={() => setPage(pagination.totalPage)}
        ></Pagination.Last>
      </Pagination>
      <Offcanvas
        show={show}
        onHide={() => setShow(false)}
        placement='end'
        backdrop={false}
        scroll={true}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Lọc theo</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form>
            <Form.Group className='mb-3' as={Row}>
              <Form.Label column sm='10'>
                Đã thanh toán
              </Form.Label>
              <Col sm='2'>
                <Form.Check
                  className='pt-2'
                  type='switch'
                  onChange={(e) => {
                    if (e.target.checked) {
                      setQuery({ ...query, isPaid: e.target.checked });
                    } else {
                      setQuery({ ...query, isPaid: undefined });
                    }
                  }}
                  defaultChecked={query.isPaid}
                />
              </Col>
            </Form.Group>
            <Form.Group className='mb-3' as={Row}>
              <Form.Label column sm='10'>
                Đã khám sức khoẻ
              </Form.Label>
              <Col sm='2'>
                <Form.Check
                  className='pt-2'
                  type='switch'
                  onChange={(e) => {
                    if (e.target.checked) {
                      setQuery({ ...query, healthChecked: e.target.checked });
                    } else {
                      setQuery({ ...query, healthChecked: undefined });
                    }
                  }}
                  defaultChecked={query.healthChecked}
                />
              </Col>
            </Form.Group>
            <Form.Group className='mb-3' as={Row}>
              <Form.Label column sm='10'>
                Đã có hồ sơ
              </Form.Label>
              <Col sm='2'>
                <Form.Check
                  className='pt-2'
                  type='switch'
                  onChange={(e) => {
                    if (e.target.checked) {
                      setQuery({ ...query, hasFile: e.target.checked });
                    } else {
                      setQuery({ ...query, hasFile: undefined });
                    }
                  }}
                  defaultChecked={query.hasFile}
                />
              </Col>
            </Form.Group>
            <Form.Group className='mb-3' as={Row}>
              <Form.Label column sm='4'>
                Ngày dự thi
              </Form.Label>
              <Col sm='8'>
                <Select
                  defaultValue={visibleDate.find(
                    (item) => item.value === query.date
                  )}
                  isClearable
                  options={visibleDate}
                  onChange={(val) =>
                    setQuery({ ...query, date: val?.value || undefined })
                  }
                />
              </Col>
            </Form.Group>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
      <Modal
        show={showEditModal}
        onHide={handleClose}
        size='lg'
        backdrop='static'
      >
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật hồ sơ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='d-flex flex-wrap justify-content-center mb-3'>
            <Button
              onClick={() => updateProcessState(selectedRow?._id, 0)}
              variant={
                selectedRow?.processState === 0 ? 'primary' : 'outline-primary'
              }
              className='m-2'
            >
              Đã tạo
            </Button>
            <Button
              onClick={() => updateProcessState(selectedRow?._id, 1)}
              variant={
                selectedRow?.processState === 1 ? 'primary' : 'outline-primary'
              }
              className='m-2'
            >
              Chờ cập nhật
            </Button>
            <Button
              onClick={() => updateProcessState(selectedRow?._id, 2)}
              variant={
                selectedRow?.processState === 2 ? 'primary' : 'outline-primary'
              }
              className='m-2'
            >
              Chờ thanh toán
            </Button>
            <Button
              onClick={() => updateProcessState(selectedRow?._id, 3)}
              variant={
                selectedRow?.processState === 3 ? 'success' : 'outline-primary'
              }
              className='m-2'
            >
              Đã hoàn tất
            </Button>
            <Button
              onClick={() => updateProcessState(selectedRow?._id, 4)}
              variant={
                selectedRow?.processState === 4 ? 'danger' : 'outline-primary'
              }
              className='m-2'
            >
              Đã huỷ
            </Button>
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
            </Row>

            <Row className='mb-3'>
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
            </Row>

            <Row className='mb-3'>
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
            </Row>
            <Row className='mb-3'>
              <Col>
                <SelectField
                  rules={{
                    required: false,
                  }}
                  options={visibleDate}
                  label={`Ngày dự thi hiện tại: ${new Date(
                    selectedRow.date
                  ).toLocaleDateString('en-GB')}`}
                  control={control}
                  name='date'
                />
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
              <Col>
                <a id='front-link' download={`${selectedRow?.name}_front.png`}>
                  <img id='front-card' alt='front-card' />
                </a>
              </Col>
              <Col>
                <a id='back-link' download={`${selectedRow?.name}_back.png`}>
                  <img id='back-card' alt='back-card' />
                </a>
              </Col>
            </Row>

            <Row>
              <Col>
                <a
                  id='portrait-link'
                  download={`${selectedRow.name}_portrait.png`}
                >
                  <img id='portrait' alt='portrait' />
                </a>
              </Col>
              <Col>
                <Row>
                  <Col>
                    {/* <FileUploader
                      name='file'
                      text='Cập nhật ảnh chân dung'
                      url={FILE_UPLOAD_URL}
                      uploading={portraitUploading}
                      setUploading={setPortraitUploading}
                      onResponse={(res) =>
                        handleUpdateButton(selectedRow._id, {
                          portraitUrl: res?.data?.url,
                        })
                      }
                    /> */}
                    <Button
                      variant='outline-primary'
                      className='mt-2'
                      onClick={() => rotateImage('portrait')}
                    >
                      <MdRotateLeft /> Xoay ảnh chân dung
                    </Button>
                  </Col>
                </Row>
                <Row className='mt-3'>
                  <Col>
                    {/* <FileUploader
                      name='file'
                      text='Cập nhật ảnh mặt trước'
                      url={FILE_UPLOAD_URL}
                      uploading={portraitUploading}
                      setUploading={setPortraitUploading}
                      onResponse={(res) =>
                        handleUpdateButton(selectedRow._id, {
                          portraitUrl: res?.data?.url,
                        })
                      }
                    /> */}
                    <Button
                      variant='outline-primary'
                      className='mt-2'
                      onClick={() => rotateImage('front-card')}
                    >
                      <MdRotateLeft /> Xoay ảnh mặt trước
                    </Button>
                  </Col>
                </Row>
                <Row className='mt-3'>
                  <Col>
                    {/* <FileUploader
                      name='file'
                      text='Cập nhật ảnh mặt sau'
                      url={FILE_UPLOAD_URL}
                      uploading={portraitUploading}
                      setUploading={setPortraitUploading}
                      onResponse={(res) =>
                        handleUpdateButton(selectedRow._id, {
                          portraitUrl: res?.data?.url,
                        })
                      }
                    /> */}
                    <Button
                      variant='outline-primary'
                      className='mt-2'
                      onClick={() => rotateImage('back-card')}
                    >
                      <MdRotateLeft /> Xoay ảnh mặt sau
                    </Button>
                  </Col>
                </Row>
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
          <Scanner
            constraints={{ facingMode: facingMode }}
            onScan={(result) => {
              setQrData(result[0]?.rawValue);
            }}
          />
          <Form.Group className='my-3' as={Row}>
            <Form.Label className='text-center'>
              {rowData?.[0]?.name}
            </Form.Label>
            <Form.Text className='text-center'>
              {rowData?.[0]?.tel} <CopyButton text={rowData?.[0]?.tel} />
            </Form.Text>
          </Form.Group>
          <Form.Group className='my-3' as={Row}>
            <Form.Label column sm='4'>
              Ngày dự thi
            </Form.Label>
            <Col>
              <Select
                isClearable
                options={visibleDate}
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
              Trạng thái
            </Form.Label>
            <Col>
              <Select
                isClearable
                options={[
                  { label: 'Đã tạo', value: 0 },
                  { label: 'Chờ cập nhật', value: 1 },
                  { label: 'Chờ thanh toán', value: 2 },
                  { label: 'Đã hoàn tất', value: 3 },
                  { label: 'Đã huỷ', value: 4 },
                ]}
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
    </div>
  );
}

export default AdminDrivingA1Page;
