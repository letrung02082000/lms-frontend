import InputField from 'features/bus/components/InputField';
import React from 'react';
import { useState } from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import RadioField from 'shared/components/form/RadioField';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function PostModal({ show, setShow }) {
  const [time1, setTime1] = useState(Date.now());
  const [time2, setTime2] = useState(Date.now());
  const { handleSubmit, control, setValue, watch, register } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      filter: 'isDriver=both',
    },
    resolver: undefined,
    context: undefined,
    criteriaMode: 'firstError',
    shouldFocusError: true,
    shouldUnregister: true,
    shouldUseNativeValidation: false,
    delayError: undefined,
  });

  const [isDriver, setIsDriver] = useState('isDriver=false');
  const [wayType, setWayType] = useState('oneWay');

  const driverOptions = [
    {
      label: 'Tài xế',
      value: 'isDriver=false',
    },
    {
      label: 'Yên sau',
      value: 'isDriver=true',
    },
  ];

  const wayOptions = [
    {
      label: 'Một chiều',
      value: 'oneWay',
    },
    {
      label: 'Hai chiều',
      value: 'twoWay',
    },
  ];

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      scrollable
      backdrop={'static'}
    >
      <Modal.Header closeButton>
        <Modal.Title className='fw-bold text-uppercase'>Đăng tin</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <RadioField
              name='driverType'
              options={driverOptions}
              label='Bạn đang tìm'
              onChange={(v) => {
                setIsDriver(v);
              }}
              checkValue={isDriver}
            />
          </Col>
          <Col>
            <RadioField
              name='wayType'
              options={wayOptions}
              label='Số lượt'
              onChange={(v) => {
                setWayType(v);
              }}
              checkValue={wayType}
            />
          </Col>
        </Row>
        <Row>
          <InputField
            name='from'
            register={register}
            label='Điểm đi'
            placeholder='Nhập điểm đi của bạn'
          />
        </Row>
        <Row>
          <InputField
            name='to'
            register={register}
            label='Điểm đến'
            placeholder='Nhập điểm đến của bạn'
          />
        </Row>
        <Row>
          <InputField
            name='tip'
            register={register}
            label='Chia tiền xăng'
            placeholder='5000đ'
          />
        </Row>
        <Row className='mb-3'>
          <Col md={6}>
            <p className='form-label fw-bold mb-2'>Giờ đi</p>
            <ReactDatePicker
              showTimeSelect
              className='w-100 mb-2'
              dateFormat='dd/MM/yyyy HH:mm'
              timeFormat='HH:mm'
              selected={time1}
              onChange={(date) => setTime1(date)}
            />
          </Col>
          {wayType === 'twoWay' && (
            <Col>
              <p className='form-label fw-bold'>Giờ về</p>
              <ReactDatePicker
                className='w-100 mb-2'
                showTimeSelect
                dateFormat='dd/MM/yyyy HH:mm'
                timeFormat='HH:mm'
                selected={time2}
                onChange={(date) => setTime2(date)}
              />
            </Col>
          )}
        </Row>
        <Row>
          <InputField
            as='textarea'
            name='note'
            register={register}
            label='Ghi chú'
            placeholder='Cảm ơn bạn nhé'
          />
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={() => setShow(false)}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PostModal;
