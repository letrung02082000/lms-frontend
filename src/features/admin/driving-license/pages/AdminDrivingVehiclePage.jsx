import React, { useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import drivingApi from 'api/drivingApi';
import { Button, Col, Form, FormControl, Modal, Row } from 'react-bootstrap';
import { MdEdit, MdAdd } from 'react-icons/md';
import { toastWrapper } from 'utils';
import { ROLE } from 'constants/role';

function AdminDrivingVehiclePage() {
  const { center, role : userRole } = JSON.parse(localStorage.getItem('user-info'));
  const [query, setQuery] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [page, setPage] = useState(1);
  const [rowData, setRowData] = useState([]);
  const [drivingDate, setDrivingDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [groupLink, setGroupLink] = useState('');
  const [drivingCenters, setDrivingCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(center || '');
  const [drivingTypes, setDrivingTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

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

  const ActionButton = (props) => {
    return (
      <div className='w-100 d-flex justify-content-center'>
        <button
          className='btn'
          onClick={() => {
            setSelectedRow(props.data);
            setShowEditModal(true);
          }}
        >
          <MdEdit />
        </button>
      </div>
    );
  };

  const [colDefs] = useState([
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
      field: 'plate',
      headerName: 'Biển số',
    },
    {
      field: 'isContractVehicle',
      headerName: 'Xe hợp đồng/trung tâm',
      valueFormatter: (data) => {
        return data.value ? 'Xe hợp đồng' : 'Xe trung tâm';
      },
    },
    {
      field: 'brand',
      headerName: 'Hãng xe',
      editable: true,
    },
    {
      field: 'type',
      headerName: 'Loại xe',
      editable: true,
    },
    {
      field: 'model',
      headerName: 'Mẫu xe',
      editable: true,
    },
    {
      field: 'engineNumber',
      headerName: 'Số máy',
      editable: true,
    },
    {
      field: 'chassisNumber',
      headerName: 'Số khung',
      editable: true,
    },
    {
      field: 'color',
      headerName: 'Màu xe',
      editable: false,
    },
    {
      field: 'inspectionCertificateDate',
      headerName: 'Ngày kiểm định',
      editable: true,
    },
    {
      field: 'inspectionCertificateExpiryDate',
      headerName: 'Ngày hết hạn kiểm định',
      editable: true,
    },
    {
      field: 'inspectionCertificateExpiryDate',
      headerName: 'Ngày hết hạn kiểm định',
      editable: true,
    },
    {
      field: 'DatSerialNumber',
      headerName: 'Số thiết bị Dat',
      editable: true,
    },
    {
      field: 'DatInstallationDate',
      headerName: 'Ngày lắp Dat',
      editable: true,
    },
    {
      field: 'supplier',
      headerName: 'Nhà cung cấp',
      editable: true,
    },
    {
      field: 'transmissionType',
      headerName: 'Loại hộp số',
      editable: true,
    },
    {
      field: 'dispatchNumber',
      headerName: 'Số công văn',
      editable: true,
    },
    {
      field: 'owner',
      headerName: 'Chủ xe',
      editable: true,
    },
    {
      field: 'relatedPerson',
      headerName: 'Người liên quan',
      editable: true,
    },
    {
      field: 'dispatchNumber',
      headerName: 'Số công văn',
      editable: true,
    },
    {
      field: 'insuranceExpiryDate',
      headerName: 'Ngày hết hạn bảo hiểm',
      editable: true,
    },
    {
      field: 'gptlNumber',
      headerName: 'Số giấy phép tập lái',
      editable: true,
    },
    {
      field: 'validFromDate',
      headerName: 'Ngày có hiệu lực',
      editable: true,
    },
    {
      field: 'productionYear',
      headerName: 'Năm sản xuất',
      editable: true,
    },
    {
      field: 'note',
      headerName: 'Ghi chú',
      editable: true,
    },
    {
      field: 'action',
      headerName: 'Thao tác',
      cellRenderer: ActionButton,
      width: 100,
    },
  ]);

  const fetchDrivingVehicle = async () => {
    drivingApi
      .queryDrivingVehicle({ ...(center && { center }) })
      .then((res) => {
        setRowData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    fetchDrivingVehicle();
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
      fetchDrivingVehicle();
      setShowAddModal(false);
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
            show={showAddModal}
            onHide={() => setShowAddModal(false)}
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
            onClick={() => setShowAddModal(true)}
          >
            <MdAdd />
          </Button>
        </>
      )}
    </div>
  );
}

export default AdminDrivingVehiclePage;
