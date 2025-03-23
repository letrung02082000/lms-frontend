import React, { useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import drivingApi from 'api/drivingApi';
import { Button, Col, Form, FormControl, Modal, Row } from 'react-bootstrap';
import { MdEdit, MdAdd } from 'react-icons/md';
import { toastWrapper } from 'utils';
import { ROLE } from 'constants/role';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import drivingClassSchema from 'validations/driving-class.validation';
import TableEditButton from 'components/button/TableEditButton'

function AdminDrivingDatePage() {
  const { center, role : userRole } = JSON.parse(localStorage.getItem('user-info'));
  const [query, setQuery] = useState({});
  const [page, setPage] = useState(1);
  const [rowData, setRowData] = useState([]);
  const [drivingDate, setDrivingDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [groupLink, setGroupLink] = useState('');
  const [drivingCenters, setDrivingCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(center || '');
  const [drivingTypes, setDrivingTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors }, clearErrors, reset } = useForm({
    resolver: yupResolver(drivingClassSchema)
  });

  useEffect(() => {
    drivingApi
      .queryDrivingCenters({ visible: true, ...(center && { center }) })
      .then((res) => {
        setDrivingCenters(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    if (center) {
      drivingApi
        .queryDrivingCenterType({ center })
        .then((res) => {
          setDrivingTypes(res.data.map((item) => item.drivingType));
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      drivingApi
        .queryDrivingType()
        .then((res) => {
          setDrivingTypes(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const [colDefs] = useState([
    {
      field: 'action',
      headerName: 'Thao tác',
      cellRenderer: TableEditButton,
      width: 60,
      suppressMenu: true,
      pinned: 'left',
      cellRendererParams: {
        clearErrors,
        reset,
        setSelectedRow,
        setIsEditMode,
        setShowModal
      }
    },
    {
      headerName: 'STT',
      valueGetter: 'node.rowIndex + 1',
      suppressMenu: true,
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
      field: 'date',
      headerName: 'Ngày thi',
      cellRenderer: (data) => {
        return data.value
          ? new Date(data.value).toLocaleDateString('en-GB')
          : '';
      },
    },
    ...(userRole?.includes(ROLE.ADMIN) || userRole?.includes(ROLE.DRIVING.ADMIN)
      ? [
          {
            field: 'description',
            headerName: 'Mô tả',
            editable: true,
          },
          {
            field: 'link',
            headerName: 'Nhóm thi',
            editable: true,
          },
          {
            field: 'center',
            headerName: 'Trung tâm',
            editable: false,
            cellRenderer: (data) => {
              return data?.value ? data.value.name : '';
            },
          },
          {
            field: 'drivingType',
            headerName: 'Hạng bằng',
            editable: false,
            cellRenderer: (data) => {
              return data?.value ? data.value.label : '';
            },
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
    drivingApi
      .getDrivingDate({ ...(center && { center }) })
      .then((res) => {
        setRowData(res.data);
      })
      .catch((err) => {
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
      center: selectedCenter,
      drivingType: selectedType,
    };

    drivingApi.addDrivingDate(body).then((res) => {
      toastWrapper('Thêm ngày thành công', 'success');
      fetchDrivingDates();
      setShowModal(false);
    }).catch((err) => {
      toastWrapper(err?.message, 'error');
    });
  }

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
      {(userRole?.includes(ROLE.ADMIN) || userRole?.includes(ROLE.DRIVING.ADMIN)) && (
        <>
          <Modal
            show={showModal}
            onHide={() => setShowModal(false)}
            size='lg'
            backdrop='static'
          >
            <Modal.Header closeButton>
              <Modal.Title>Thêm khoá thi mới</Modal.Title>
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
                {!center && <Row>
                  <Col>
                    <Form.Select
                      className='mb-3'
                      onChange={(e) => setSelectedCenter(e.target.value)}
                    >
                      <option>Chọn trung tâm</option>
                      {drivingCenters.map((center) => (
                        <option key={center._id} value={center._id}>
                          {center.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                </Row>}
                <Row>
                  <Col>
                    <Form.Select
                      className='mb-3'
                      onChange={(e) => setSelectedType(e.target.value)}
                    >
                      <option>Chọn hạng bằng</option>
                      {drivingTypes.map((type) => (
                        <option key={type._id} value={type._id}>
                          {type.label}
                        </option>
                      ))}
                    </Form.Select>
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
            onClick={() => setShowModal(true)}
          >
            <MdAdd />
          </Button>
        </>
      )}
    </div>
  );
}

export default AdminDrivingDatePage;
