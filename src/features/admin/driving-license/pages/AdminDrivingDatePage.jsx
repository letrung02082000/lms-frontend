import React, { useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import drivingApi from 'api/drivingApi';
import { Button, Col, Form, FormControl, Modal, Row } from 'react-bootstrap';
import { MdEdit, MdAdd } from 'react-icons/md';
import { toastWrapper } from 'utils';
import { ROLE } from 'constants/role';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import TableEditButton from 'components/button/TableEditButton'
import InputField from 'components/form/InputField';
import drivingDateSchema from 'validations/driving-date.validation';
import { getVietnamDate } from 'utils/commonUtils';

function AdminDrivingDatePage() {
  const { center, role : userRole } = JSON.parse(localStorage.getItem('user-info'));
  const [drivingCenters, setDrivingCenters] = useState([]);
  const [drivingTypes, setDrivingTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [gridApi, setGridApi] = useState(null);
  const { handleSubmit, setValue, control, clearErrors, reset } = useForm({
    resolver: yupResolver(drivingDateSchema),
  });

  useEffect(() => {
    drivingApi
      .queryDrivingCenters({
        filter: { active: true, ...(center && { _id: center }) },
      })
      .then((res) => {
        setDrivingCenters(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    if (center) {
      drivingApi
        .queryDrivingCenterType({
          filter: { ...(center && { center }), active: true },
        })
        .then((res) => {
          setDrivingTypes(res.data.map((item) => item.drivingType));
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      drivingApi
        .queryDrivingType({
          filter: { active: true },
        })
        .then((res) => {
          setDrivingTypes(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  useEffect(() => {
    if (selectedRow && isEditMode) {
      Object.keys(selectedRow).forEach((key) => {
        setValue(key, selectedRow[key]);
      });

      if (selectedRow?.examDate) {
        setValue('examDate', getVietnamDate(selectedRow.examDate));
      } else {
        setValue('examDate', '');
      }
    } else {
      setValue('center', drivingCenters?.[0]);
      setValue('drivingType', drivingTypes?.[0]);
    }
  }, [selectedRow, setValue, showModal]);

  const [colDefs] = useState([
    {
      field: 'action',
      headerName: 'Thao tác',
      cellRenderer: TableEditButton,
      width: 90,
      suppressHeaderMenuButton: true,
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

  const refreshGrid = () => {
    if (gridApi) {
      gridApi.refreshInfiniteCache();
    }
  };

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
            const res = await drivingApi.getDrivingDate({
              filter: {
                ...(center && { center }),
              },
              page: Math.floor(startRow / (endRow - startRow)) + 1,
              limit: endRow - startRow,
            });
            params.successCallback(res.data, res.pagination.totalDocs);
          } catch (error) {
            params.failCallback();
          }
        },
      };
    };
  
  const handleDateSubmit = async (formData) => {
    const body = {
      ...formData,
      center: formData.center._id,
      drivingType: formData.drivingType._id,
    };

    const apiCall = isEditMode
      ? drivingApi.updateDrivingDate(formData?._id, body)
      : drivingApi.addDrivingDate(body);

    apiCall
      .then((res) => {
        refreshGrid();
        setShowModal(false);
        toastWrapper(
          isEditMode ? 'Cập nhật ngày thành công' : 'Thêm ngày thành công',
          'success'
        );
      })
      .catch((err) => {
        toastWrapper(err?.message, 'error');
      });
  };

  const handleAddDateBtn = () => {
    reset();
    setIsEditMode(false);
    setShowModal(true);
  };

  const onCellValueChanged = (event) => {
    const { data } = event;
    const body = {
      description: data.description,
      formVisible: data.visible,
      isVisible: data.active,
      visible: data.visible,
      active: data.active,
      link: data.link,
    };

    drivingApi
      .updateDrivingDate(data?._id, body)
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
          rowModelType='infinite'
          paginationPageSize={20}
          paginationPageSizeSelectors={[10, 20, 50, 100]}
          pagination={true}
          cacheBlockSize={20}
          onGridReady={onGridReady}
        />
      </div>
      {(userRole?.includes(ROLE.ADMIN) ||
        userRole?.includes(ROLE.DRIVING.ADMIN)) && (
        <>
          <Modal
            show={showModal}
            onHide={() => setShowModal(false)}
            size='lg'
            backdrop='static'
          >
            <Modal.Header closeButton>
              <Modal.Title>
                {isEditMode ? 'Chỉnh sửa ngày thi' : 'Thêm ngày thi mới'}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit(handleDateSubmit)}>
                <Row className='mb-3'>
                  <Col>
                    <InputField
                      label='Ngày thi'
                      name='examDate'
                      control={control}
                      type='date'
                      noClear={true}
                    />
                  </Col>
                </Row>
                <Row className='mb-3'>
                  <Col>
                    <InputField
                      label='Trung tâm'
                      name='center._id'
                      control={control}
                      as='select'
                      noClear={true}
                    >
                      {drivingCenters.map((center) => (
                        <option key={center._id} value={center._id}>
                          {center.name}
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
                      label='Nhóm thi'
                      name='link'
                      control={control}
                      type='text'
                    />
                  </Col>
                </Row>
                <Row className='mb-3'>
                  <Col>
                    <InputField
                      label='Mô tả'
                      name='description'
                      control={control}
                      type='text'
                      as='textarea'
                      rows={3}
                    />
                  </Col>
                </Row>
                <Row className='mb-3'>
                  <Col>
                    <Button type='submit' variant='primary'>
                      Thêm
                    </Button>
                  </Col>
                </Row>
              </Form>
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
            onClick={handleAddDateBtn}
          >
            <MdAdd />
          </Button>
        </>
      )}
    </div>
  );
}

export default AdminDrivingDatePage;
