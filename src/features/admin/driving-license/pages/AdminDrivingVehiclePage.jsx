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
import { vehicleColDefs as colDefs } from './column.defs.js'; // Import the column definitions
import InputField from 'components/form/InputField.jsx';
import SelectField from 'components/form/SelectField.jsx';

function AdminDrivingVehiclePage() {
  const { center, role: userRole } = JSON.parse(
    localStorage.getItem('user-info')
  );
  const [drivingCenters, setDrivingCenters] = useState([]);
  const [drivingTypes, setDrivingTypes] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showVehicleModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [gridApi, setGridApi] = useState(null);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(drivingVehicleValidation),
  });

  const handleVehicleSubmit = (formData) => {
    const body = {
      ...formData,
      center: formData.center.value,
    }
    const apiCall = isEditMode
      ? drivingApi.updateDrivingVehicle(body._id, body)
      : drivingApi.createDrivingVehicle(body);

    apiCall
      .then((res) => {
        toastWrapper(
          isEditMode ? 'Cập nhật xe thành công' : 'Thêm xe thành công',
          'success'
        );
        refreshGrid();
        setShowModal(false);
      })
      .catch((err) => {
        toastWrapper(
          err?.response?.data?.message || 'Có lỗi xảy ra trong quá trình xử lý',
          'error'
        );
      });
  };

  const handleFormChange = () => {
    setIsFormDirty(true);
  };

  const handleCloseModal = () => {
    if (isFormDirty) {
      if (window.confirm('Bạn có chắc chắn muốn đóng mà không lưu thay đổi?')) {
        clearErrors();
        setShowModal(false);
        setIsFormDirty(false);
      }
    } else {
      clearErrors();
      setShowModal(false);
    }
  };

  useEffect(() => {
    if (selectedRow && isEditMode) {
      Object.keys(selectedRow).forEach((key) => {
        setValue(key, selectedRow[key]);
      });

      setValue('center', {
        label: selectedRow?.center?.name,
        value: selectedRow?.center?._id,
      });
    }
  }, [selectedRow, setValue, showVehicleModal]);

  useEffect(() => {
    drivingApi
      .queryDrivingCenters({
        filter: {
          active: true,
          ...(center && { _id: center }),
        },
      })
      .then((res) => {
        setDrivingCenters(
          res.data?.map((item) => {
            return {
              ...item,
              label: item.name,
              value: item._id,
            };
          })
        );
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

  const refreshGrid = () => {
    if (gridApi) {
      gridApi.refreshInfiniteCache();
    }
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

    drivingApi
      .updateDrivingDate(data?._id, body)
      .then((res) => {
        toastWrapper('Cập nhật thành công', 'success');
      })
      .catch((err) => {
        toastWrapper(err.response.data.message, 'error');
      });
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

  const downloadRentalContract = (data) => {
    if (!data) return;
  
    drivingApi
      .downloadVehicleRentalContract(data._id)
      .then((res) => {
        const blob = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });
  
        const fileURL = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = fileURL;
        link.download = `Hop_dong_thue_xe_${data.plate}.docx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(fileURL);
      })
      .catch((err) => {
        console.log(err);
        toastWrapper(err?.response?.data?.message || "Có lỗi xảy ra trong quá trình xử lý", "error");
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
          columnDefs={colDefs.map((col) => {
            if (col.field === 'action') {
              return {
                ...col,
                cellRendererParams: {
                  clearErrors,
                  reset,
                  setSelectedRow,
                  setIsEditMode,
                  setShowModal,
                  downloadRentalContract,
                },
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
      {(userRole?.includes(ROLE.ADMIN) ||
        userRole?.includes(ROLE.DRIVING.ADMIN)) && (
        <>
          <Modal
            show={showVehicleModal}
            onHide={handleCloseModal}
            size='xl'
            backdrop='static'
          >
            <Modal.Header closeButton>
              <Modal.Title>
                {isEditMode ? 'Chỉnh sửa xe' : 'Thêm xe mới'}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form
                onSubmit={handleSubmit(handleVehicleSubmit)}
                onChange={handleFormChange}
              >
                <Row className='mb-3'>
                  <Col md={4}>
                    <InputField
                      control={control}
                      name='plate'
                      label='Biển số'
                    />
                  </Col>
                  <Col md={4}>
                    <InputField
                      control={control}
                      name='brand'
                      label='Hãng xe'
                    />
                  </Col>
                  <Col md={4}>
                    <InputField control={control} name='type' label='Loại xe' />
                  </Col>
                </Row>
                <Row className='mb-3'>
                  <Col md={4}>
                    <InputField control={control} name='type' label='Mẫu xe' />
                  </Col>
                  <Col md={4}>
                    <InputField
                      control={control}
                      name='engineNumber'
                      label='Số máy'
                    />
                  </Col>
                  <Col md={4}>
                    <InputField
                      control={control}
                      name='chassisNumber'
                      label='Số khung'
                    />
                  </Col>
                </Row>
                <Row className='mb-3'>
                  <Col md={4}>
                    <InputField control={control} name='color' label='Màu xe' />
                  </Col>
                  <Col md={4}>
                    <InputField
                      type='date'
                      control={control}
                      name='inspectionCertificateDate'
                      label='Ngày kiểm định'
                      noClear={true}
                    />
                  </Col>
                  <Col md={4}>
                    <InputField
                      type='date'
                      control={control}
                      name='inspectionCertificateExpiryDate'
                      label='Ngày hết hạn kiểm định'
                      noClear={true}
                    />
                  </Col>
                </Row>
                <Row className='mb-3'>
                  <Col md={4}>
                    <InputField
                      control={control}
                      name='DatSerialNumber'
                      label='Số thiết bị Dat'
                    />
                  </Col>
                  <Col md={4}>
                    <InputField
                      type='date'
                      control={control}
                      name='DatInstallationDate'
                      label='Ngày lắp Dat'
                      noClear={true}
                    />
                  </Col>
                  <Col md={4}>
                    <InputField
                      control={control}
                      name='supplier'
                      label='Nhà cung cấp'
                    />
                  </Col>
                </Row>
                <Row className='mb-3'>
                  <Col md={4}>
                    <InputField
                      control={control}
                      name='transmissionType'
                      label='Loại hộp số'
                    />
                  </Col>
                  <Col md={4}>
                    <InputField
                      control={control}
                      name='dispatchNumber'
                      label='Số công văn'
                    />
                  </Col>
                  <Col md={4}>
                    <InputField control={control} name='owner' label='Chủ xe' />
                  </Col>
                </Row>
                <Row className='mb-3'>
                  <Col md={4}>
                    <InputField
                      control={control}
                      name='relatedPerson'
                      label='Người liên quan'
                    />
                  </Col>
                  <Col md={4}>
                    <InputField
                      type='date'
                      control={control}
                      name='insuranceExpiryDate'
                      label='Ngày hết hạn bảo hiểm'
                      noClear={true}
                    />
                  </Col>
                  <Col md={4}>
                    <InputField
                      control={control}
                      name='gptlNumber'
                      label='Số giấy phép tập lái'
                    />
                  </Col>
                </Row>
                <Row className='mb-3'>
                  <Col md={4}>
                    <InputField
                      type='date'
                      control={control}
                      name='validFromDate'
                      label='Ngày có hiệu lực'
                      noClear={true}
                    />
                  </Col>
                  <Col md={4}>
                    <InputField
                      type='number'
                      control={control}
                      name='productionYear'
                      label='Năm sản xuất'
                    />
                  </Col>
                  <Col md={4}>
                    <Col>
                      <SelectField
                        label='Trung tâm'
                        name='center'
                        control={control}
                        options={drivingCenters}
                        isClearable={false}
                      />
                    </Col>
                  </Col>
                </Row>
                <Row className='mb-3'>
                  <Col>
                    <InputField
                      control={control}
                      name='note'
                      label='Ghi chú'
                      as='textarea'
                    />
                  </Col>
                </Row>
                <Row className='mb-3'>
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
              setShowModal(true);
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
