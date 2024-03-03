import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import drivingApi from 'api/drivingApi';
import { Button, Col, Form, Modal, Offcanvas, Pagination, Row } from 'react-bootstrap';
import { MdEdit, MdFilterList, MdRotateLeft, MdSearch } from 'react-icons/md';
import { useForm } from 'react-hook-form';
import InputField from 'components/form/InputField';
import SelectField from 'components/form/SelectField';
import FileUploader from 'components/form/FileUploader';
import { FILE_UPLOAD_URL } from 'constants/endpoints';
import { toastWrapper } from 'utils';

function AdminDrivingA1Page() {
  const [query, setQuery] = useState({});
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [rowData, setRowData] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});
  const [pagination, setPagination] = useState({});
  const [show, setShow] = useState(false);
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
      <div className='d-flex justify-content-center'>
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
      <div className='d-flex justify-content-center'>
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
      <div className='d-flex justify-content-center'>
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

  // const FinishCheckbox = (props) => {
  //   return (
  //     <div className='d-flex justify-content-center'>
  //       <Form.Check type='switch' defaultChecked={props.data.processState == 3} onClick={(e) => {
  //         drivingApi
  //         .updateDriving(props.data._id, { processState: e.target.checked ? 3 : 2})
  //         .then((res) => {
  //           toastWrapper('Cập nhật thành công', 'success');
  //         })
  //         .catch((err) => {
  //           toastWrapper(err.response.data.message, 'error');
  //         });
  //       }}/>
  //     </div>
  //   );
  // }

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
    {
      field: 'isPaid',
      headerName: 'Thanh toán',
      flex: 1,
      cellRenderer: PaymentCheckbox,
      valueGetter: rowDataGetter,
    },
    { field: 'cash', headerName: 'Chuyển khoản', flex: 1 },
    {
      field: 'healthChecked',
      headerName: 'Đã khám sức khoẻ',
      flex: 1,
      cellRenderer: HealthCheckbox,
      valueGetter: rowDataGetter,
    },
    {
      field: 'hasFile',
      headerName: 'Đã có hồ sơ',
      flex: 1,
      cellRenderer: FileCheckbox,
      valueGetter: rowDataGetter,
    },
    // {
    //   field: 'finished',
    //   headerName: 'Hoàn tất',
    //   flex: 1,
    //   cellRenderer: FinishCheckbox,
    //   valueGetter: rowDataGetter,
    // },
    {
      field: 'action',
      headerName: 'Thao tác',
      cellRenderer: ActionButton,
      flex: 1,
      valueGetter: rowDataGetter,
    },
  ]);

  useEffect(() => {
    fetchDrivings();

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

  const fetchDrivings = async () => {
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
    console.log(selectedRow)

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
        fetchDrivings();

      }).catch((err) => {
        toastWrapper(err.response.data.message, 'error');
      });
    })();
  }

  const handleSearchButton = () => {
    drivingApi
      .getDrivings(query, searchText, page)
      .then((res) => {
        setRowData(res.data);
        setPagination(res.pagination);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClearButton = (name) => {
    setValue(name, '');
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
      <div
        style={{ height: '9%' }}
        className='d-flex align-items-center ps-3 pe-5'
      >
        <Form.Control
          type='text'
          value={searchText}
          placeholder='Tìm theo tên hoặc số điện thoại'
          onChange={(e) => setSearchText(e.target.value)}
        />
        <MdSearch size={25} className='mx-3' onClick={handleSearchButton} />
        <MdFilterList
          size={25}
          className='mx-3'
          onClick={() => setShow(true)}
        />
      </div>
      <div
        className='ag-theme-quartz' // applying the grid theme
        style={{ height: '85%' }} // the grid will fill the size of the parent container
      >
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
        className='bg-dark'
        show={show}
        onHide={() => setShow(false)}
        placement='end'
        backdrop={false}
        scroll={true}
      >
        <Offcanvas.Header closeButton closeVariant='white'>
          <Offcanvas.Title>Offcanvas</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          Some text as placeholder. In real life you can have the elements you
          have chosen. Like, text, images, lists, etc.
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
    </div>
  );
}

export default AdminDrivingA1Page;
