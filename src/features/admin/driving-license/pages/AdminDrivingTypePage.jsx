import React, { useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import drivingApi from 'api/drivingApi';
import { Button, Col, Form, FormControl, Modal, Row } from 'react-bootstrap';
import { MdEdit, MdAdd } from 'react-icons/md';
import { toastWrapper } from 'utils';
import { ROLE } from 'constants/role';
import { ActionButton } from './column.defs';
import TableEditButton from 'components/button/TableEditButton';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

function AdminDrivingTypePage() {
  const { center, role : userRole } = JSON.parse(localStorage.getItem('user-info'));
  const [showAddModal, setShowAddModal] = useState(false);
  const [drivingDate, setDrivingDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [groupLink, setGroupLink] = useState('');
  const [drivingCenters, setDrivingCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(center || '');
  const [drivingTypes, setDrivingTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [gridApi, setGridApi] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm({
    resolver: yupResolver(),
  });

  useEffect(() => {
    drivingApi
    .queryDrivingCenterType()
    .then((res) => {
      setDrivingTypes(res.data.map((item) => item.drivingType));
    })
    .catch((err) => {
      console.log(err);
    });
  }, []);

  const [colDefs] = useState([
    {
      field: 'action',
      headerName: 'Thao tác',
      cellRenderer: TableEditButton,
      cellRendererParams: {
        clearErrors,
        reset,
        setSelectedRow,
        setIsEditMode,
        setShowModal,
      },
      width: 90,
      suppressHeaderMenuButton: true,
      pinned: 'left',
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
      field: 'drivingType.label',
      headerName: 'Hạng bằng',
    },
    {
      field: 'drivingType.description',
      headerName: 'Mô tả',
      flex: 6,
    },
    {
      field: 'center.name',
      headerName: 'Trung tâm',
    },
    ...(userRole?.includes(ROLE.ADMIN) || userRole?.includes(ROLE.DRIVING.ADMIN)
      ? [
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
          const res = await drivingApi.queryDrivingCenterType({
            page: Math.floor(startRow / (endRow - startRow)) + 1,
            limit: endRow - startRow,
            filter: {
              ...(center && { center }),
            }
          });
          params.successCallback(res.data, res.pagination.totalDocs);
        } catch (error) {
          params.failCallback();
        }
      },
    };
  };
  
  const handleAddTypeButton = async () => {
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
      setShowAddModal(false);
    }).catch((err) => {
      toastWrapper(err?.message, 'error');
    });
  }

  const onCellValueChanged = (event) => {
    const { data } = event;
    const body = {
      visible: data.visible,
      active: data.active,
    };

    drivingApi.updateDrivingCenterType(data?._id, body).then((res) => {
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
          columnDefs={colDefs}
          onCellValueChanged={onCellValueChanged}
          pagination={true}
          paginationPageSize={100}
          rowModelType={'infinite'}
          cacheBlockSize={100}
          paginationPageSizeSelector={[10, 20, 50, 100]}
          onGridReady={onGridReady}
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
              <Button variant='primary' onClick={handleAddTypeButton}>
                Thêm
              </Button>
            </Modal.Footer>
          </Modal>
          {/* <Button
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
          </Button> */}
        </>
      )}
    </div>
  );
}

export default AdminDrivingTypePage;
