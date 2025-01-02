import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import drivingApi from 'api/drivingApi';
import { Button, Col, Form, FormControl, Modal, Row } from 'react-bootstrap';
import { MdEdit, MdAdd } from 'react-icons/md';
import { toastWrapper } from 'utils';
import { ROLE } from 'constants/role';

function AdminDrivingDatePage() {
  const userRole = JSON.parse(localStorage.getItem('user-info'))?.role;
  const [query, setQuery] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [page, setPage] = useState(1);
  const [rowData, setRowData] = useState([]);
  const [drivingDate, setDrivingDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [groupLink, setGroupLink] = useState('');

  const [colDefs] = useState([
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
    {
      field: 'date',
      headerName: 'Ngày thi',
      flex: 1,
      cellRenderer: (data) => {
        return data.value
          ? new Date(data.value).toLocaleDateString('en-GB')
          : '';
      },
    },
    ...(userRole === ROLE.ADMIN || userRole === ROLE.DRIVING.ADMIN
      ? [
          {
            field: 'description',
            headerName: 'Mô tả',
            flex: 6,
            editable: true,
          },
          {
            field: 'link',
            headerName: 'Nhóm thi',
            editable: true,
          },
          {
            field: 'formVisible',
            headerName: 'Hiển thị trên website',
            editable: true,
          },
          {
            field: 'isVisible',
            headerName: 'Hiển thị',
            editable: true,
          },
        ]
      : []),
  ]);

  const fetchDrivingDates = async () => {
    drivingApi.getDrivingDate().then((res) => {
      setRowData(res.data);
    }).catch((err) => {
      console.log(err);
    });
  }

  useEffect(() => {
    fetchDrivingDates();
  }, [page, query]);
  
  const handleAddDateButton = async () => {
    const body = {
      date: new Date(drivingDate).getTime(),
      isVisible: true,
      description,
      link: groupLink,
    };

    drivingApi.addDrivingDate(body).then((res) => {
      toastWrapper('Thêm ngày thành công', 'success');
      fetchDrivingDates();
      setShowAddModal(false);
    }).catch((err) => {
      toastWrapper(err.response.data.message, 'error');
    });
  }

  const onCellValueChanged = (event) => {
    const { data } = event;
    const body = {
      description: data.description,
      formVisible: data.formVisible,
      isVisible: data.isVisible,
      link: data.link,
    };

    drivingApi.updateDrivingDate(data?._id, body).then((res) => {
      toastWrapper('Cập nhật thành công', 'success');
    }).catch((err) => {
      toastWrapper(err.response.data.message, 'error');
    });
  }

  return (
    <div
      style={{
        height: '100vh',
      }}
    >
      <div className='ag-theme-quartz' style={{ height: '100%' }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          onCellValueChanged={onCellValueChanged}
        />
      </div>
      {(userRole === ROLE.ADMIN || userRole === ROLE.DRIVING.ADMIN) && (
        <>
          <Modal
            show={showAddModal}
            onHide={() => setShowAddModal(false)}
            size='lg'
            backdrop='static'
          >
            <Modal.Header closeButton>
              <Modal.Title>Thêm ngày thi mới</Modal.Title>
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
                <Row>
                  <Col>
                    <FormControl
                      className='mb-3'
                      type='text'
                      placeholder='Nhóm thi'
                      onChange={(e) => setGroupLink(e.target.value)}
                    />
                  </Col>
                </Row>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='primary' onClick={handleAddDateButton}>
                Thêm
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
            onClick={() => setShowAddModal(true)}
          >
            <MdAdd />
          </Button>
        </>
      )}
    </div>
  );
}

export default AdminDrivingDatePage;
