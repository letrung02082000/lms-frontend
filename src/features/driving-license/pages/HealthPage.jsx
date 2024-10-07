import drivingApi from 'api/drivingApi';
import InputField from 'components/form/InputField';
import RadioField from 'components/form/RadioField';
import SelectField from 'components/form/SelectField';
import { DRIVING_STATE } from 'features/admin/driving-license/constant';
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toastWrapper } from 'utils';

function DrivingHealthPage() {
  const [disabled, setDisabled] = useState(true);
  const [healthDates, setHealthDates] = useState([]);
  const [healthDate, setHealthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [data, setData] = useState({});
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

  const genderOptions = [
    {
      value: 0,
      label: 'Nữ',
    },
    {
      value: 1,
      label: 'Nam',
    },
  ];

  const purposeOptions = [
    {
      value: 'A1',
      label: 'Khám sức khỏe lái xe hạng A1',
    },
    {
      value: 'A2',
      label: 'Khám sức khỏe lái xe hạng A2',
    },
    {
      value: 'B1',
      label: 'Khám sức khỏe lái xe hạng B1',
    },
    {
      value: 'B2',
      label: 'Khám sức khỏe lái xe hạng B2',
    },
  ]

  useEffect(() => {
    if(!data?.date) return;

    setValue('name', data?.name);
    
    drivingApi
      .getHealthDates(data?.date)
      .then((res) => {
        let healthDates = res.data.map((date) => {
          return {
            value: date?.healthDate,
            label: date?.description,
          };
        });
        setHealthDates(healthDates);
      })
      .catch((e) => {
        toastWrapper('Lỗi lấy danh sách ngày khám sức khỏe', 'error');
      });
  }, [data]);

  const handleHealthDateChange = (healthDate) => {
    setHealthDate(healthDate);
  }

  const handleSearchButton = () => {
    if(isNaN(phone) || phone.length !== 10) {
      return toastWrapper('Số điện thoại không hợp lệ', 'error');
    }

    drivingApi.searchDriving(phone)
        .then((res) => {
          if (res?.data?.length === 0) {
            toastWrapper(
              "Không tìm thấy hồ sơ khớp với số điện thoại " + phone,
              "error"
            );
          } else {
            const drivingList = res?.data?.filter(driving => driving?.processState !== DRIVING_STATE.CANCELED);
            if(drivingList?.length === 0) {
              toastWrapper(
                'Không tìm thấy hồ sơ nào khớp với số điện thoại ' + phone,
                'error'
              );
              return;
            }
            setData(drivingList.at(-1));
            toastWrapper('Nhập thông tin thành công', 'success');
            setDisabled(false);
          }
        })
        .catch((e) => {
          toastWrapper(
            "Không tìm thấy hồ sơ khớp với số điện thoại " + phone,
            "error"
          );
        });
  }

  const handleSubmitButton = async () => {
    await handleSubmit((formData) => {

      if(!healthDate) {
        return toastWrapper('Vui lòng chọn ngày khám sức khoẻ', 'error');
      }

      const drivingHealthData = {
        ...formData,
        healthDate,
        gender: formData?.gender?.value
      }

      drivingApi
        .updateDrivingHealth(data?._id, drivingHealthData)
        .then((res) => {
          toastWrapper('Bạn đã đăng ký thông tin khám sức khoẻ thành công', 'success');
        })
        .catch((e) => {
          toastWrapper('Đăng ký thất bại, vui lòng liên hệ Admin để được hỗ trợ', 'error');
        });
    })();
  }

  return (
    <div>
      <Form>
        <Form.Group className='my-3' as={Row}>
          <Col>
            <Form.Control
              placeholder='Nhập số điện thoại đã đăng ký hồ sơ'
              type='text'
              onChange={(e) => setPhone(e.target.value)}
            />
          </Col>
        </Form.Group>
        <Row>
          <Col>
            <Button
              className='mb-3'
              variant='primary'
              onClick={handleSearchButton}
            >
              Lấy thông tin hồ sơ
            </Button>
          </Col>
        </Row>
        {data?.healthDate && (
          <Row className='mb-3'>
            <Col>
              <Form.Text className='text-success'>
                Bạn đã đăng ký tham gia khám sức khoẻ vào ngày{' '}
                {new Date(data?.healthDate).toLocaleDateString('en-GB')}.
              </Form.Text>
            </Col>
          </Row>
        )}
        <Form.Group className='mb-3' as={Row}>
          <Col>
            <InputField
              hasAsterisk={true}
              label='Tên của bạn'
              control={control}
              // value={data?.name}
              name='name'
              disabled={true}
              rules={{
                maxLength: {
                  value: 50,
                  message: 'Độ dài tối đa <= 50 ký tự',
                },
                required: 'Vui lòng nhập trường này',
              }}
              noClear={true}
            />
          </Col>
        </Form.Group>
        <Form.Group className='mb-3' as={Row}>
          <Col>
            <InputField
              hasAsterisk={true}
              label='Ngày sinh'
              control={control}
              name='dob'
              type='date'
              defaultValue='2001-01-01'
              disabled={disabled}
              rules={{
                required: 'Vui lòng nhập trường này',
              }}
              noClear={true}
            />
          </Col>
        </Form.Group>
        {/* <Row>
          <Col>
            <Button className='mb-3' variant='outline-primary'>
              Quét mã QR trên CCCD để nhập tự động
            </Button>
          </Col>
        </Row> */}
        <Form.Group className='mb-3' as={Row}>
          <Col>
            <SelectField
              rules={{
                required: true,
              }}
              options={genderOptions}
              label={'Giới tính'}
              control={control}
              name='gender'
            />
          </Col>
        </Form.Group>
        <Form.Group className='mb-3' as={Row}>
          <Col>
            <InputField
              hasAsterisk={true}
              label='Số Căn cước công dân'
              control={control}
              name='cardNumber'
              disabled={disabled}
              rules={{
                required: 'Vui lòng nhập trường này',
                maxLength: {
                  value: 12,
                  message: 'Số Căn cước công dân gồm 12 chữ số',
                },
                minLength: {
                  value: 12,
                  message: 'Số Căn cước công dân gồm 12 chữ số',
                },
              }}
            />
          </Col>
        </Form.Group>
        <Form.Group className='mb-3' as={Row}>
          <Col>
            <InputField
              hasAsterisk={true}
              label='Ngày cấp'
              control={control}
              name='cardProvidedDate'
              type='date'
              defaultValue='2021-01-01'
              disabled={disabled}
              rules={{
                required: 'Vui lòng nhập trường này',
              }}
              noClear={true}
            />
          </Col>
        </Form.Group>
        <Form.Group className='mb-3' as={Row}>
          <Col>
            <InputField
              as='textarea'
              label='Nơi cấp'
              placeholder='Nếu bỏ trống, nơi cấp sẽ là "Cục trưởng Cục Cảnh sát Quản lý hành chính về trật tự xã hội"'
              control={control}
              name='cardProvider'
              defaultValue='Cục trưởng Cục Cảnh sát Quản lý hành chính về trật tự xã hội'
              disabled={disabled}
              onClear={handleClearButton}
              rules={{
                required: false,
              }}
            />
          </Col>
        </Form.Group>
        <Form.Group className='mb-3' as={Row}>
          <Col>
            <InputField
              as='textarea'
              rows={3}
              hasAsterisk={true}
              label='Địa chỉ thường trú'
              placeholder='Ghi rõ ấp/xóm/tổ/khu phố, xã/phường/thị trấn, quận/huyện, tỉnh/thành phố theo Căn cước công dân'
              control={control}
              name='address'
              disabled={disabled}
              onClear={handleClearButton}
            />
          </Col>
        </Form.Group>
        <Row className='mb-3'>
          <Col>
            <RadioField
              hasAsterisk={true}
              options={healthDates}
              label='Chọn ngày thực hiện khám sức khỏe'
              control={control}
              name='healthDate'
              onClear={handleClearButton}
              onChange={handleHealthDateChange}
              defaultChecked={0}
            />
          </Col>
        </Row>
        {/* <Form.Group className='mb-3' as={Row}>
          <Col>
            <SelectField
              rules={{
                required: true,
              }}
              options={purposeOptions}
              label={'Mục đích khám sức khỏe'}
              control={control}
              name='purpose'
              hasAsterisk={true}
            />
          </Col>
        </Form.Group> */}
        <Row className='mb-3'>
          <Col>
            <Form.Text className='text-warning'>
              Điều kiện tham gia khám sức khoẻ: Học viên phải đủ 18 tuổi theo ngày sinh tính đến ngày thực hiện khám sức khỏe.
            </Form.Text>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              className='w-100 fw-bold'
              variant='primary'
              type='button'
              disabled={isSubmitting}
              onClick={handleSubmitButton}
            >
              {isSubmitting ? 'Đang xử lý...' : 'Đăng ký thông tin'}
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default DrivingHealthPage;
