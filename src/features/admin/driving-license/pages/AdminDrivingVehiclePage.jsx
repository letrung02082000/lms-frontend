import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import drivingApi from 'api/drivingApi';
import { Button, Col, Form, FormControl, Modal, Row } from 'react-bootstrap';
import { MdAdd } from 'react-icons/md';
import { toastWrapper } from 'utils';
import { ROLE } from 'constants/role';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import drivingVehicleValidation from 'validations/driving-vehicle.validation.js'; // Update the import path
import {vehicleColDefs as colDefs} from './column.defs.js'; // Import the column definitions

function AdminDrivingVehiclePage() {
  const { center, role: userRole } = JSON.parse(localStorage.getItem('user-info'));
  const [drivingCenters, setDrivingCenters] = useState([]);
  const [drivingTypes, setDrivingTypes] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [gridApi, setGridApi] = useState(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm({
    resolver: yupResolver(drivingVehicleValidation),
  });

  const handleVehicleSubmit = (values) => {
    const apiCall = isEditMode
      ? drivingApi.updateDrivingVehicle(selectedRow._id, values)
      : drivingApi.addDrivingVehicle(values);

    apiCall.then((res) => {
      toastWrapper(isEditMode ? 'Cập nhật xe thành công' : 'Thêm xe thành công', 'success');
      fetchDrivingVehicle();
      setShowVehicleModal(false);
    }).catch((err) => {
      toastWrapper(err?.message, 'error');
    });
  };

  const handleFormChange = () => {
    setIsFormDirty(true);
  };

  const handleCloseModal = () => {
    if (isFormDirty) {
      if (window.confirm('Bạn có chắc chắn muốn đóng mà không lưu thay đổi?')) {
        clearErrors();
        setShowVehicleModal(false);
        setIsFormDirty(false);
      }
    } else {
      clearErrors();
      setShowVehicleModal(false);
    }
  };

  useEffect(() => {
    if (selectedRow && isEditMode) {
      Object.keys(selectedRow).forEach((key) => {
        setValue(key, selectedRow[key]);
      });
    }
  }, [selectedRow, setValue, showVehicleModal]);

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

  const fetchDrivingVehicle = async () => {
    const dataSource = getDataSource();
    gridApi.setDatasource(dataSource);
  };

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
          const res = await drivingApi.queryDrivingVehicle({
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

  return (
    <div
      style={{
        height: '100vh',
      }}
    >
      <div className='ag-theme-quartz' style={{ height: '100%' }}>
        <AgGridReact
          columnDefs={colDefs.map(col => {
            if (col.field === 'action') {
              return {
                ...col,
                cellRendererParams: {
                  clearErrors,
                  reset,
                  setSelectedRow,
                  setIsEditMode,
                  setShowVehicleModal
                }
              };
            }
            return col;
          })}
          onCellValueChanged={onCellValueChanged}
          pagination={true}
          paginationPageSize={20}
          rowModelType={'infinite'}
          cacheBlockSize={20}
          paginationPageSizeSelector={[10, 20, 50, 100]}
          onGridReady={onGridReady}
        />
      </div>
      {(userRole?.includes(ROLE.ADMIN) || userRole?.includes(ROLE.DRIVING.ADMIN)) && (
        <>
          <Modal
            show={showVehicleModal}
            onHide={handleCloseModal}
            size='lg'
            backdrop='static'
            onShow={() => {
              clearErrors();
              if (isEditMode) {
                Object.keys(selectedRow).forEach((key) => {
                  setValue(key, selectedRow[key]);
                });
              } else {
                reset();
              }
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title>{isEditMode ? 'Chỉnh sửa xe' : 'Thêm xe mới'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit(handleVehicleSubmit)} onChange={handleFormChange}>
                <Row>
                  <Col md={4}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Biển số</Form.Label>
                      <FormControl
                        type='text'
                        placeholder='Biển số'
                        {...register('plate')}
                        isInvalid={!!errors.plate}
                      />
                      <FormControl.Feedback type='invalid'>
                        {errors.plate?.message}
                      </FormControl.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Hãng xe</Form.Label>
                      <FormControl
                        type='text'
                        placeholder='Hãng xe'
                        {...register('brand')}
                        isInvalid={!!errors.brand}
                      />
                      <FormControl.Feedback type='invalid'>
                        {errors.brand?.message}
                      </FormControl.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Loại xe</Form.Label>
                      <FormControl
                        type='text'
                        placeholder='Loại xe'
                        {...register('type')}
                        isInvalid={!!errors.type}
                      />
                      <FormControl.Feedback type='invalid'>
                        {errors.type?.message}
                      </FormControl.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Mẫu xe</Form.Label>
                      <FormControl
                        type='text'
                        placeholder='Mẫu xe'
                        {...register('model')}
                        isInvalid={!!errors.model}
                      />
                      <FormControl.Feedback type='invalid'>
                        {errors.model?.message}
                      </FormControl.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Số máy</Form.Label>
                      <FormControl
                        type='text'
                        placeholder='Số máy'
                        {...register('engineNumber')}
                        isInvalid={!!errors.engineNumber}
                      />
                      <FormControl.Feedback type='invalid'>
                        {errors.engineNumber?.message}
                      </FormControl.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Số khung</Form.Label>
                      <FormControl
                        type='text'
                        placeholder='Số khung'
                        {...register('chassisNumber')}
                        isInvalid={!!errors.chassisNumber}
                      />
                      <FormControl.Feedback type='invalid'>
                        {errors.chassisNumber?.message}
                      </FormControl.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Màu xe</Form.Label>
                      <FormControl
                        type='text'
                        placeholder='Màu xe'
                        {...register('color')}
                        isInvalid={!!errors.color}
                      />
                      <FormControl.Feedback type='invalid'>
                        {errors.color?.message}
                      </FormControl.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Ngày kiểm định</Form.Label>
                      <FormControl
                        type='date'
                        placeholder='Ngày kiểm định'
                        {...register('inspectionCertificateDate')}
                        isInvalid={!!errors.inspectionCertificateDate}
                      />
                      <FormControl.Feedback type='invalid'>
                        {errors.inspectionCertificateDate?.message}
                      </FormControl.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Ngày hết hạn kiểm định</Form.Label>
                      <FormControl
                        type='date'
                        placeholder='Ngày hết hạn kiểm định'
                        {...register('inspectionCertificateExpiryDate')}
                        isInvalid={!!errors.inspectionCertificateExpiryDate}
                      />
                      <FormControl.Feedback type='invalid'>
                        {errors.inspectionCertificateExpiryDate?.message}
                      </FormControl.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Số thiết bị Dat</Form.Label>
                      <FormControl
                        type='text'
                        placeholder='Số thiết bị Dat'
                        {...register('DatSerialNumber')}
                        isInvalid={!!errors.DatSerialNumber}
                      />
                      <FormControl.Feedback type='invalid'>
                        {errors.DatSerialNumber?.message}
                      </FormControl.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Ngày lắp Dat</Form.Label>
                      <FormControl
                        type='date'
                        placeholder='Ngày lắp Dat'
                        {...register('DatInstallationDate')}
                        isInvalid={!!errors.DatInstallationDate}
                      />
                      <FormControl.Feedback type='invalid'>
                        {errors.DatInstallationDate?.message}
                      </FormControl.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Nhà cung cấp</Form.Label>
                      <FormControl
                        type='text'
                        placeholder='Nhà cung cấp'
                        {...register('supplier')}
                        isInvalid={!!errors.supplier}
                      />
                      <FormControl.Feedback type='invalid'>
                        {errors.supplier?.message}
                      </FormControl.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Loại hộp số</Form.Label>
                      <FormControl
                        type='text'
                        placeholder='Loại hộp số'
                        {...register('transmissionType')}
                        isInvalid={!!errors.transmissionType}
                      />
                      <FormControl.Feedback type='invalid'>
                        {errors.transmissionType?.message}
                      </FormControl.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Số công văn</Form.Label>
                      <FormControl
                        type='text'
                        placeholder='Số công văn'
                        {...register('dispatchNumber')}
                        isInvalid={!!errors.dispatchNumber}
                      />
                      <FormControl.Feedback type='invalid'>
                        {errors.dispatchNumber?.message}
                      </FormControl.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Chủ xe</Form.Label>
                      <FormControl
                        type='text'
                        placeholder='Chủ xe'
                        {...register('owner')}
                        isInvalid={!!errors.owner}
                      />
                      <FormControl.Feedback type='invalid'>
                        {errors.owner?.message}
                      </FormControl.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Người liên quan</Form.Label>
                      <FormControl
                        type='text'
                        placeholder='Người liên quan'
                        {...register('relatedPerson')}
                        isInvalid={!!errors.relatedPerson}
                      />
                      <FormControl.Feedback type='invalid'>
                        {errors.relatedPerson?.message}
                      </FormControl.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Ngày hết hạn bảo hiểm</Form.Label>
                      <FormControl
                        type='date'
                        placeholder='Ngày hết hạn bảo hiểm'
                        {...register('insuranceExpiryDate')}
                        isInvalid={!!errors.insuranceExpiryDate}
                      />
                      <FormControl.Feedback type='invalid'>
                        {errors.insuranceExpiryDate?.message}
                      </FormControl.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Số giấy phép tập lái</Form.Label>
                      <FormControl
                        type='text'
                        placeholder='Số giấy phép tập lái'
                        {...register('gptlNumber')}
                        isInvalid={!!errors.gptlNumber}
                      />
                      <FormControl.Feedback type='invalid'>
                        {errors.gptlNumber?.message}
                      </FormControl.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Ngày có hiệu lực</Form.Label>
                      <FormControl
                        type='date'
                        placeholder='Ngày có hiệu lực'
                        {...register('validFromDate')}
                        isInvalid={!!errors.validFromDate}
                      />
                      <FormControl.Feedback type='invalid'>
                        {errors.validFromDate?.message}
                      </FormControl.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Năm sản xuất</Form.Label>
                      <FormControl
                        type='number'
                        placeholder='Năm sản xuất'
                        {...register('productionYear')}
                        isInvalid={!!errors.productionYear}
                      />
                      <FormControl.Feedback type='invalid'>
                        {errors.productionYear?.message}
                      </FormControl.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Ghi chú</Form.Label>
                      <FormControl
                        type='text'
                        placeholder='Ghi chú'
                        {...register('note')}
                        isInvalid={!!errors.note}
                      />
                      <FormControl.Feedback type='invalid'>
                        {errors.note?.message}
                      </FormControl.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button variant='primary' type='submit'>
                      {isEditMode ? 'Cập nhật' : 'Thêm'}
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
            onClick={() => {
              clearErrors();
              reset();
              setIsEditMode(false);
              setShowVehicleModal(true);
            }}
          >
            <MdAdd />
          </Button>
        </>
      )}
    </div>
  );
}

export default AdminDrivingVehiclePage;
