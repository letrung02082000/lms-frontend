import InputField from 'components/form/InputField'
import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form';

function Creation() {
  const {
    control,
    setValue,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
    watch,
    setFocus,
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {},
    resolver: undefined,
    context: undefined,
    shouldFocusError: true,
    shouldUnregister: true,
    shouldUseNativeValidation: false,
    delayError: false,
  });

  const handleClearButton = (name) => {
    setValue(name, '');
    setFocus(name);
  }

  return (
    <div>
      <h1 className='text-center my-2'>Tạo phòng</h1>
      <Row className='justify-content-center'>
        <Col xs={12} md={6} lg={4}>
          <InputField
            label='Mã phòng'
            placeholder='Nhập mã phòng'
            control={control}
            name='room-number'
            type='number'
            rules={{
              maxLength: {
                value: 50,
                message: 'Độ dài tối đa <= 50 ký tự',
              },
              required: 'Vui lòng nhập trường này',
            }}
            onClear={handleClearButton}
          />
        </Col>
        <Col xs={12} md={6} lg={4}>
          <InputField
            label='Khách hàng'
            placeholder='Nhập họ tên khách hàng'
            control={control}
            name='name'
            rules={{
              maxLength: {
                value: 50,
                message: 'Độ dài tối đa <= 50 ký tự',
              },
              required: 'Vui lòng nhập trường này',
            }}
            onClear={handleClearButton}
          />
        </Col>
      </Row>
    </div>
  )
}

export default Creation
