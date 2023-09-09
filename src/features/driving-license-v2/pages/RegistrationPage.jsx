import React, { useState } from 'react';
import { Image, Form, Button, Row, Col, Modal } from 'react-bootstrap';
import PortraitImage from 'assets/images/driving-license/portrait.jpg';
import FileUploader from 'components/form/FileUploader';
import ServiceLayout from 'components/layouts/ServiceLayout';
import InputField from 'components/form/InputField';
import { useForm } from 'react-hook-form';
import SelectField from 'components/form/SelectField';
import Asterisk from 'components/form/Asterisk';
import RadioField from 'components/form/RadioField';
import { DRIVING_DATE, DRIVING_LOCATION, DRIVING_TYPE } from './constants';
import { toastWrapper } from 'utils';
import InfoField from '../components/InfoField';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import AccountModal from 'features/driving-license/components/AccountModal';
import ZaloLink from 'components/link/ZaloLink';

function RegistrationPage() {
  const [drivingData, setDrivingData] = useState(JSON.parse(localStorage.getItem('driving-data') || '{}'));
  const [drivingDataShow, setDrivingDataShow] = useState(false);
  const [accountShow, setAccountShow] = useState(false);
  const steps = [0, 1, 2, 3];
  const [currentStep, setCurrentStep] = useState(0);
  const { handleSubmit, control, setValue, watch } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: drivingData,
    resolver: undefined,
    context: undefined,
    criteriaMode: 'firstError',
    shouldFocusError: true,
    shouldUnregister: false,
    shouldUseNativeValidation: false,
    delayError: undefined,
  });

  const handleClearButton = (name) => setValue(name, '');

  const generateDrivingInfo = () => {
    return (
      <>
        <InfoField label='Họ tên thí sinh' value={drivingData?.formName} />
        <InfoField label='Số điện thoại' value={drivingData?.formTel} />
        <InfoField label='Địa chỉ liên hệ' value={drivingData?.formAddress} />
        <InfoField label='Loại bằng lái' value={drivingData?.formType?.label} />
        <InfoField
          label='Địa điểm thi'
          value={drivingData?.formLocation?.label}
        />
        <InfoField label='Ngày dự thi' value={drivingData?.formDate?.label} />
      </>
    );
  };

  return (
    <>
      {currentStep === steps[0] && (
        <>
          <Form.Text>
            (<Asterisk />) Bắt buộc
          </Form.Text>
          <br />
          <Form.Text>
            Bạn vui lòng hoàn thành mẫu đăng ký dự thi dưới đây
          </Form.Text>
          <InputField
            control={control}
            label='Họ và tên thí sinh'
            name='formName'
            hasAsterisk
            placeholder='Vui lòng nhập tên của bạn'
            onClear={handleClearButton}
          />
          <InputField
            control={control}
            label='Số điện thoại liên hệ'
            name='formTel'
            hasAsterisk
            placeholder='Vui lòng nhập số điện thoại liên hệ'
            onClear={handleClearButton}
          />
          <InputField
            control={control}
            label='Địa chỉ liên hệ'
            name='formAddress'
            hasAsterisk
            placeholder='Vui lòng nhập địa chỉ liên hệ của bạn'
            onClear={handleClearButton}
          />
          <SelectField
            options={DRIVING_TYPE}
            control={control}
            label='Loại bằng lái'
            name='formType'
            hasAsterisk
          />
          <SelectField
            options={DRIVING_LOCATION}
            control={control}
            label='Địa điểm đăng ký dự thi'
            name='formLocation'
            hasAsterisk
          />
          <SelectField
            options={DRIVING_DATE}
            control={control}
            label='Ngày đăng ký dự thi'
            name='formDate'
            hasAsterisk
          />
          <Button
            onClick={handleSubmit(
              (data) => {
                localStorage.setItem('driving-data', JSON.stringify(data));
                setDrivingData(data);
                setCurrentStep(1);
              },
              (e) => {
                toastWrapper('Vui lòng nhập đầy đủ thông tin', 'error');
              }
            )}
          >
            Tiếp tục
          </Button>
        </>
      )}
      {currentStep === steps[1] && (
        <>
          <Form.Text>
            (<Asterisk />) Bắt buộc
          </Form.Text>
          <FileUploader
            name='formFront'
            label='Ảnh chụp CCCD/CMND - Mặt trước'
            subLabel='Yêu cầu không chói, lóa, mờ, lấy đủ góc'
            hasAsterisk
          />
          <FileUploader
            name='formBack'
            label='Ảnh chụp CCCD/CMND - Mặt sau'
            subLabel='Yêu cầu không chói, lóa, mờ, lấy đủ góc'
            hasAsterisk
          />
          <FileUploader
            name='formPortrait'
            label='Ảnh chân dung'
            subLabel='Vui lòng chụp ảnh chân dung đúng theo yêu cầu bên dưới. Ảnh chân dung không hợp lệ sẽ làm chậm quá trình xử lý hồ sơ của bạn'
            hasAsterisk
          />
          <Image
            className='mb-3'
            src={PortraitImage}
            alt='anh-chan-dung-mau'
            width='100%'
          />
          <Button variant='outline-primary' onClick={() => setCurrentStep(0)}>
            Lùi lại
          </Button>
          <Button
            variant='primary'
            className='ms-2'
            onClick={() => setCurrentStep(2)}
          >
            Tiếp tục
          </Button>
        </>
      )}
      {currentStep === steps[2] && (
        <div>
          <Form.Text>Xác nhận thông tin đăng ký</Form.Text>
          {generateDrivingInfo()}
          <Button variant='outline-primary' onClick={() => setCurrentStep(1)}>
            Lùi lại
          </Button>
          <Button
            variant='primary'
            className='ms-2'
            onClick={() => setCurrentStep(3)}
          >
            Hoàn tất
          </Button>
        </div>
      )}
      {currentStep === steps[3] && (
        <Row>
          <BsFillCheckCircleFill color='#019f91' size={45} />
          <p className='text-center mt-3'>Đăng ký thành công</p>
          <Button className='mb-3' onClick={() => {}}>
            Tham gia nhóm thi Zalo
          </Button>
          <Button className='mb-3' onClick={() => setDrivingDataShow(true)}>
            Thông tin đăng ký
          </Button>
          <Button
            variant='outline-primary'
            className='mb-3'
            onClick={() => setAccountShow(true)}
          >
            Thanh toán lệ phí
          </Button>
          <Button
            variant='outline-primary'
            onClick={() => {
              localStorage.removeItem('driving-data');
              window.location.reload();
            }}
          >
            Đăng ký hồ sơ mới
          </Button>
          <Form.Text className='text-center mt-3'>Liên hệ hỗ trợ: <ZaloLink tel='4013961016678131109'>
              Trung tâm dịch vụ sinh viên iStudent
            </ZaloLink></Form.Text>
        </Row>
      )}
      <Modal show={drivingDataShow} onHide={() => setDrivingDataShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thông tin đăng ký dự thi</Modal.Title>
        </Modal.Header>
        <Modal.Body>{generateDrivingInfo()}</Modal.Body>
      </Modal>
      <AccountModal
        show={accountShow}
        setShow={setAccountShow}
        bankName={'Ngân hàng Quân đội MB - MBBank'}
        bankCode='MBBank'
        accountName='Nguyen Ngoc Huan'
        accountNumber='7899996886'
        amount={690000}
        desc={`GPLX ${drivingData?.tel || '<Số điện thoại>'} ${
          drivingData?.date || '<Ngày dự thi>'
        }`}
      />
    </>
  );
}

export default RegistrationPage;
