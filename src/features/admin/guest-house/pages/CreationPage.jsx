import InputField from 'components/form/InputField';
import RadioField from 'components/form/RadioField';
import SelectField from 'components/form/SelectField';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import guestHouseApi from 'api/guesthouseApi';
import { toastWrapper } from 'utils';

function CreationPage() {
  const [categories, setCategories] = useState([]);
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
  };

  const handleVisibleChange = (val) => {
    setValue('visible', val === 'true' ? true : false);
  };

  const handleAvailableChange = (val) => {
    setValue('available', val === 'true' ? true : false);
  };

  const handleCreateRoom = (val) => {
    const data = {
      ...val,
      category: val?.category?.value,
    }

    guestHouseApi
      .postRoom(data)
      .then((res) => {
        toastWrapper('Tạo phòng thành công', 'success');
        setValue('number', '');
        setValue('description', '');
        setValue('category', '');
      })
      .catch((err) => {
        console.log(err)
        toastWrapper('Tạo phòng thất bại', 'error');
      });
  };

  useEffect(() => {
    guestHouseApi.getCategories().then((res) => {
      const data = res?.data?.map((item) => {
        return {
          label: item?.name,
          value: item?._id,
        };
      });

      setCategories(data);
    });
  }, []);

  return (
    <Container>
      <h1 className='text-center my-2'>Tạo phòng</h1>
      <Row className='justify-content-center'>
        <Col md={12}>
          <InputField
            label='Mã phòng'
            placeholder='Nhập mã phòng'
            control={control}
            name='number'
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
      </Row>
      <Row className='justify-content-center'>
        <Col md={12}>
          <InputField
            label='Mô tả'
            control={control}
            name='description'
            rules={{
              maxLength: {
                value: 50,
                message: 'Độ dài tối đa <= 50 ký tự',
              },
              required: 'Vui lòng nhập trường này',
            }}
            onClear={handleClearButton}
            as='textarea'
            row={5}
          />
        </Col>
      </Row>
      <Row className='justify-content-center'>
        <Col md={12}>
          <SelectField
            options={categories}
            label='Loại phòng'
            control={control}
            name='category'
            onClear={handleClearButton}
          />
        </Col>
      </Row>
      <Row className='justify-content-center'>
        <Col md={12}>
          <RadioField
            label='Hiển thị'
            control={control}
            name='visible'
            options={[
              { label: 'Có', value: true },
              { label: 'Không', value: false },
            ]}
            onClear={handleClearButton}
            onChange={handleVisibleChange}
          />
        </Col>
        <Col md={12}>
          <RadioField
            label='Còn phòng'
            control={control}
            name='available'
            options={[
              { label: 'Có', value: true },
              { label: 'Không', value: false },
            ]}
            onClear={handleClearButton}
            onChange={handleAvailableChange}
          />
        </Col>
      </Row>
      <Row className='justify-content-center'>
        <Col md={12}>
          <Button
            variant='primary'
            disabled={isSubmitting}
            type='button'
            onClick={handleSubmit(handleCreateRoom)}
          >
            Tạo phòng
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default CreationPage;
