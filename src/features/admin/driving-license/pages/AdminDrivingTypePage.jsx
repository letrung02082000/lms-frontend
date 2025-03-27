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
import InputField from 'components/form/InputField';
import drivingTypeSchema from 'validations/driving-type.validation';

function AdminDrivingTypePage() {
  const { center, role: userRole } = JSON.parse(
    localStorage.getItem('user-info')
  );
  const [drivingCenters, setDrivingCenters] = useState([]);
  const [drivingTypes, setDrivingTypes] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { control, handleSubmit, setValue, clearErrors, reset } = useForm({
    resolver: yupResolver(drivingTypeSchema),
  });

  useEffect(() => {
    drivingApi
      .queryDrivingCenters({
        filter: {
          active: true,
          ...(center && { _id: center }),
        },
      })
      .then((res) => {
        setDrivingCenters(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    drivingApi
      .queryDrivingType({
        filter: {
          active: true,
        },
      })
      .then((res) => {
        setDrivingTypes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (selectedRow && isEditMode) {
      Object.keys(selectedRow).forEach((key) => {
        setValue(key, selectedRow[key]);
      });
    } else {
      setValue('center', drivingCenters[0]);
      setValue('drivingType', drivingTypes?.[0]);
    }
  }, [selectedRow, setValue, showModal]);

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
            },
          });
          params.successCallback(res.data, res.pagination.totalDocs);
        } catch (error) {
          params.failCallback();
        }
      },
    };
  };

  const refreshGrid = () => {
    if (gridApi) {
      gridApi.refreshInfiniteCache();
    }
  };

  const handleAddTypeButton = () => {
    reset();
    setIsEditMode(false);
    setShowModal(true);
  };

  const handleDrivingTypeSubmit = async (formData) => {
    const body = {
      ...formData,
      center: formData.center._id,
      drivingType: formData.drivingType._id,
    };
    const apiCall = isEditMode
      ? drivingApi.updateDrivingCenterType(formData._id, body)
      : drivingApi.createDrivingCenterType(body);

    apiCall
      .then((res) => {
        refreshGrid();
        setShowModal(false);
        toastWrapper(
          isEditMode ? 'Cập nhật hạng bằng thành công' : 'Thêm hạng bằng thành công',
          'success'
        );
      })
      .catch((err) => {
        toastWrapper(err.response.data.message, 'error');
      });
  };

  const onCellValueChanged = (event) => {
    const { data } = event;
    const body = {
      visible: data.visible,
      active: data.active,
    };

    drivingApi
      .updateDrivingCenterType(data?._id, body)
      .then((res) => {
        toastWrapper('Cập nhật thành công', 'success');
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
          pagination={true}
          paginationPageSize={100}
          rowModelType={'infinite'}
          cacheBlockSize={100}
          paginationPageSizeSelector={[10, 20, 50, 100]}
          onGridReady={onGridReady}
        />
      </div>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size='lg'
        backdrop='static'
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditMode ? 'Chỉnh sửa hạng bằng' : 'Thêm hạng bằng mới'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(handleDrivingTypeSubmit)}>
            <Row className='mb-3'>
              <Col>
                <InputField
                  label='Trung tâm'
                  name='center._id'
                  control={control}
                  as='select'
                  noClear={true}
                >
                  {drivingCenters?.map(({ _id, name }) => (
                    <option key={_id} value={_id}>
                      {name}
                    </option>
                  ))}
                </InputField>
              </Col>
            </Row>
            <Row className='mb-3'>
              <Col>
                <InputField
                  label='Hạng bằng'
                  name='drivingType._id'
                  control={control}
                  as='select'
                  noClear={true}
                >
                  {drivingTypes?.map(({ _id, label }) => (
                    <option key={_id} value={_id}>
                      {label}
                    </option>
                  ))}
                </InputField>
              </Col>
            </Row>
            <Row className='mb-3'>
              <Col>
                <InputField
                  label='Mô tả'
                  name='description'
                  control={control}
                  type='text'
                  rules={{
                    maxLength: {
                      value: 50,
                      message: 'Độ dài tối đa <= 50 ký tự',
                    },
                    required: false,
                  }}
                  as='textarea'
                />
              </Col>
            </Row>
            <Row>
              <Col className='text-end'>
                <Button type='submit' variant='primary'>
                  {isEditMode ? 'Cập nhật' : 'Thêm'}
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
      {(userRole?.includes(ROLE.ADMIN) ||
        userRole?.includes(ROLE.DRIVING.ADMIN)) && (
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
          onClick={handleAddTypeButton}
        >
          <MdAdd />
        </Button>
      )}
    </div>
  );
}

export default AdminDrivingTypePage;
