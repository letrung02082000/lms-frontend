import InputField from 'features/bus/components/InputField';
import React from 'react';
import { useState } from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import RadioField from 'shared/components/form/RadioField';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { checkLogin, toastWrapper } from 'utils';
import { convertToDateTime } from 'utils/commonUtils';
import { useMemo } from 'react';
import motobikeApi from 'api/motobikeApi';
import { selectUser } from 'store/userSlice';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';

function PostModal({ show, setShow }) {
  const [time1, setTime1] = useState(Date.now());
  const [time2, setTime2] = useState(Date.now());
  const [posting, setPosting] = useState(false);
  const user = useSelector(selectUser)
  const navigate = useNavigate();

  useEffect(()=> {
    checkLogin();
  }, [show])

  const beforeTime = useMemo(() => {
    let retDate = new Date(time1);
    return retDate.setDate(retDate.getDate() - 3);
  }, [time1]);

  const { handleSubmit, control, setValue, watch, setFocus } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      note: '',
    },
    resolver: undefined,
    context: undefined,
    criteriaMode: 'firstError',
    shouldFocusError: true,
    shouldUnregister: true,
    shouldUseNativeValidation: false,
    delayError: undefined,
  });

  const [isDriver, setIsDriver] = useState('back');
  const [wayType, setWayType] = useState('oneWay');

  const driverOptions = [
    {
      label: 'Tài xế',
      value: 'back',
    },
    {
      label: 'Yên sau',
      value: 'front',
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

  const onSubmit = async () => {
    await handleSubmit((formData) => {
      const data = {
        ...formData,
        time1,
        time2,
        twoWay: wayType === 'twoWay',
        isDriver: isDriver === 'front',
      };

      if (time1 <= Date.now()) {
        return toastWrapper(
          'Thời gian đi phải lớn hơn thời gian hiện tại',
          'error',
          {
            autoClose: 25000,
          }
        );
      }

      if (data?.twoWay && time2 <= time1) {
        return toastWrapper('Thời gian về phải lớn hơn thời gian đi', 'error', {
          autoClose: 25000,
        });
      }

      setPosting(true);
      motobikeApi
        .createMotobikeRequest(data)
        .then((res) => {
          setPosting(false);
          toastWrapper(
            `Lên lịch thành công! Tin sẽ xuất hiện từ ngày ${convertToDateTime(
              beforeTime,
              true,
              ' lúc '
            )} đến ngày
          ${convertToDateTime(time1, true, ' lúc ')}`,
            'success',
            { autoClose: 15000 }
          );
          setPosting(false);
          setShow(false);
        })
        .catch((e) => {
          toastWrapper(e?.response?.data?.message, 'error');
          setPosting(false);
        });
    })();
  };

  const handleClearButton = (name) => {
    setValue(name, '');
    setFocus(name);
  };
  
  if(!user?.isLoggedIn && show) {
    return <Navigate to='/login'/>
  }

  console.log(user)

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
            label='Điểm đi'
            placeholder='Nhập điểm đi của bạn'
            control={control}
            onClear={handleClearButton}
            rules={{
              maxLength: {
                value: 50,
                message: 'Độ dài tối đa 50 ký tự',
              },
              required: 'Vui lòng nhập trường này',
            }}
          />
        </Row>
        <Row>
          <InputField
            name='to'
            label='Điểm đến'
            placeholder='Nhập điểm đến của bạn'
            control={control}
            onClear={handleClearButton}
            rules={{
              maxLength: {
                value: 50,
                message: 'Độ dài tối đa 50 ký tự',
              },
              required: 'Vui lòng nhập trường này',
            }}
          />
        </Row>
        <Row>
          <InputField
            name='tip'
            label='Chia tiền xăng'
            placeholder='5000đ'
            control={control}
            onClear={handleClearButton}
            rules={{
              maxLength: {
                value: 50,
                message: 'Độ dài tối đa 50 ký tự',
              },
              required: 'Vui lòng nhập trường này',
            }}
          />
        </Row>
        <Row className='my-3'>
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
          <Col>
            <InputField
              name='tel'
              label='Di động'
              placeholder='Nhập SĐT liên hệ'
              control={control}
              onClear={handleClearButton}
              rules={{
                maxLength: {
                  value: 50,
                  message: 'Độ dài tối đa 50 ký tự',
                },
                required: 'Vui lòng nhập trường này',
              }}
            />
          </Col>
          <Col>
            <InputField
              name='zalo'
              label='Zalo (Không bắt buộc)'
              placeholder='Nhập SĐT Zalo'
              control={control}
              onClear={handleClearButton}
              rules={{
                maxLength: {
                  value: 50,
                  message: 'Độ dài tối đa 50 ký tự',
                },
                required: false
              }}
            />
          </Col>
        </Row>
        <Row>
          <InputField
            as='textarea'
            name='note'
            label='Ghi chú'
            placeholder='Cảm ơn bạn nhé'
            control={control}
            onClear={handleClearButton}
            rules={{
              maxLength: {
                value: 100,
                message: 'Độ dài tối đa 100 ký tự',
              },
              required: true,
            }}
          />
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <p>
          Tin của bạn sẽ xuất hiện từ ngày{' '}
          <span className='text-success fw-bold'>
            {convertToDateTime(beforeTime, true, ' lúc ')}
          </span>{' '}
          đến ngày{' '}
          <span className='text-success fw-bold'>
            {convertToDateTime(time1, true, ' lúc ')}
          </span>
        </p>
        {posting ? (
          <Button variant='primary' type='button'>
            Đang lên lịch...
          </Button>
        ) : (
          <Button variant='primary' type='button' onClick={onSubmit}>
            Lên lịch
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default PostModal;
