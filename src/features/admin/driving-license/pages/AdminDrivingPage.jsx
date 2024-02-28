import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import drivingApi from 'api/drivingApi';
import { Button, Col, Form, Modal, Offcanvas, Pagination, Row } from 'react-bootstrap';
import { MdEdit, MdFilterList, MdSearch } from 'react-icons/md';
import { useForm } from 'react-hook-form';
import InputField from 'components/form/InputField';

function AdminDrivingA1Page() {
  const [query, setQuery] = useState({});
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [rowData, setRowData] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});
  const [pagination, setPagination] = useState({});
  const [show, setShow] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

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
        <button className='btn' onClick={() => {
          setSelectedRow(props.value);
          setShowEditModal(true);
        }}>
          <MdEdit />
        </button>
      </div>
    );
  };

  const rowDataGetter = function (params) {
    return params.data;
  };

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([
    { field: 'createdAt', headerName: 'Ngày tạo', flex: 1 },
    { field: 'name', headerName: 'Họ và tên', flex: 1 },
    { field: 'tel', headerName: 'Số điện thoại', flex: 1 },
    { field: 'zalo', headerName: 'Zalo', flex: 1 },
    { field: 'date', headerName: 'Ngày dự thi', flex: 1 },
    { field: 'isPaid', headerName: 'Thanh toán', flex: 1 },
    { field: 'cash', headerName: 'Chuyển khoản', flex: 1 },
    { field: 'isPaid', headerName: 'Đã KSK', flex: 1 },
    { field: 'feedback', headerName: 'Ghi chú', flex: 1 },
    { field: 'processState', headerName: 'Trạng thái', flex: 1 },
    { field: 'source', headerName: 'Nguồn', flex: 1 },
    { field: 'drivingType', headerName: 'Loại bằng', flex: 1 },
    {
      field: 'action',
      headerName: 'Thao tác',
      cellRenderer: ActionButton,
      flex: 1,
      valueGetter: rowDataGetter,
    },
  ]);

  useEffect(() => {
    drivingApi
      .getDrivings(query, searchText, page)
      .then((res) => {
        setRowData(res.data);
        setPagination(res.pagination);
      })
      .catch((err) => {
        console.log(err);
      });

    drivingApi
      .getDateVisible()
      .then((res) => {
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page, query]);

  const handleClose = () => setShowEditModal(false);

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
                  subLabel='Nhập họ tên đầy đủ, có dấu'
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
            
        <Row className="mb-3">
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

        <Row className="mb-3">
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
        <Row>
          <Col>
          </Col>
        </Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
          <Button variant='primary' onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminDrivingA1Page;
