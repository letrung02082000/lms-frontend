import React, { useState, useEffect } from 'react';
import categoryApi from 'api/photocopy/categoryApi';
import officeApi from 'api/photocopy/officeApi';
import orderApi from 'api/photocopy/orderApi';
import tagApi from 'api/photocopy/tagApi';
import couponApi from 'api/photocopy/couponApi';
import { Button, Col, Image, Row, Table } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import InputField from 'components/form/InputField';
import RadioField2 from '../components/RadioField2';
import SelectField2 from '../components/SelectField2';
import styled from 'styled-components';
import { ToastWrapper } from 'utils';
import FileArea from '../components/FileArea';
import validator from 'validator';
import OrderInfo from '../components/OrderInfo';
import OrderPreview from '../components/OrderPreview';
import SearchPlaceHolder from '../components/SearchPlaceHolder';
import SearchModal from '../components/SearchModal';
import InstructionModal from '../components/InstructionModal';
import CouponArea from '../components/CouponArea';
import CouponModal from '../components/CouponModal';
import HomeBanner from 'assets/images/home-banner.png';
import { useSearchParams } from 'react-router-dom';

function PhotocopyPage() {
  const PRINT_URL = 'https://inan.isinhvien.vn';
  const [query] = useSearchParams();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(true);
  const [showInstructionModal, setShowInstructionModal] = useState(false);
  const [previewData, setPreviewData] = useState(false);
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem('user-data') || '{}')
  );
  const [orderData, setOrderData] = useState(
    JSON.parse(localStorage.getItem('order-data') || '{}')
  );
  const [categories, setCategories] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [offices, setOffices] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [urlList, setUrlList] = useState([]);
  const [couponData, setCouponData] = useState(false);
  const [uploadType, setUploadType] = useState(userData?.uploadType || 'file');
  const [deliveryType, setDeliveryType] = useState(
    userData?.deliveryType || 'office'
  );

  const {
    control,
    setValue,
    handleSubmit,
    setError,
    formState: { isSubmitting },
    watch,
    setFocus,
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      email: userData?.email || '',
      tel: userData?.tel || '',
      zalo: userData?.zalo || '',
      name: userData?.name || '',
      coupon: userData?.coupon || '',
      instruction: userData?.instruction || '',
      address: userData?.address || '',
    },
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

  const deliveryOptions = [
    {
      label: 'Nhận tại cửa hàng',
      value: 'office',
      component: (
        <SelectField2
          options={offices}
          name='office'
          control={control}
          label='Chọn cửa hàng'
          hasAsterisk
        />
      ),
    },
    {
      label: 'Giao hàng tận nơi',
      value: 'home',
      component: (
        <InputField
          name='address'
          control={control}
          label='Địa chỉ giao hàng'
          hasAsterisk
          as='textarea'
          placeholder='Vui lòng nhập mã toà/địa chỉ giao hàng của bạn'
          subLabel='Giao hàng mất phí tận toà Kí túc xá A, Kí túc xá B và nhà khách ĐHQG-HCM hàng ngày từ 16h00-18h00.'
          onClear={handleClearButton}
        />
      ),
    },
  ];

  useEffect(() => {
    const fileUrl = query.get('q');

    if (fileUrl != null) {
      setUploadType('url');
      setUrlList([{ fileUrl }]);
    }
  }, []);

  useEffect(() => {
    categoryApi
      .getCategories(0, 25, { isVisible: true })
      .then((res) => {
        setCategories(
          res?.data?.map((_item) => ({ label: _item.name, value: _item._id }))
        );
      })
      .catch((e) => {
        ToastWrapper('Không thể tải danh sách thể loại', 'error');
      });

    officeApi
      .getOffices(0, 25)
      .then((res) => {
        console.log(res)
        setOffices(
          res?.data?.map((_item) => ({ label: _item.name, value: _item._id }))
        );
      })
      .catch((e) => {
        console.log(e);
        ToastWrapper('Không thể tải danh sách cửa hàng', 'error');
      });
  }, []);

  const couponCode = watch('coupon');
  const category = watch('category');
  const tag = watch('tags');
  console.log(tag)
  const tel = watch('tel');

  useEffect(() => {
    setValue('zalo', tel);
  }, [tel]);

  useEffect(() => {
    const PAGE = 0;
    const LIMIT = 25;

    if (category) {
      tagApi
        .getTags(PAGE, LIMIT, {
          category: category?.value,
          isVisible: true,
        })
        .then((res) => {
          let data = res?.data;
          setTagList(
            data?.map((_item) => ({
              label: _item?.name,
              value: _item?._id,
              description: _item?.description,
            }))
          );
        })
        .catch((e) => console.log(e));
    }
  }, [category?.value]);

  const validateForm = (formData, document) => {
    if (uploadType !== 'design' && document.length === 0) {
      ToastWrapper('Vui lòng đính kèm tài liệu in', 'error');
      return false;
    }

    if (formData['email'] && !validator.isEmail(formData.email)) {
      setError(
        'email',
        {
          message: 'Địa chỉ email không hợp lệ',
        },
        { shouldFocus: true }
      );
      return false;
    }

    if (!validator.isInt(formData?.tel)) {
      setError(
        'tel',
        {
          message: 'Số điện thoại không hợp lệ',
        },
        { shouldFocus: true }
      );
      return false;
    }

    if (!validator.isInt(formData?.zalo)) {
      setError(
        'zalo',
        {
          message: 'Số zalo không hợp lệ',
        },
        { shouldFocus: true }
      );
      return false;
    }

    return true;
  };

  const handleSubmitButton = async () => {
    await handleSubmit((formData) => {
      const document = uploadType === 'file' ? fileList : urlList;
      if (!validateForm(formData, document)) return;

      localStorage.setItem(
        'user-data',
        JSON.stringify({
          ...formData,
          uploadType,
          deliveryType,
        })
      );

      let tags = [];
      for (let t of formData?.tags) {
        tags.push(t?.value);
      }

      const order = {
        ...formData,
        category: formData?.category?.value,
        office: formData?.office?.value,
        uploadType,
        deliveryType,
        document,
        tags,
        coupon: formData?.coupon?.toUpperCase(),
      };

      orderApi
        .createOrder(order)
        .then((res) => {
          localStorage.setItem('order-token', res?.data?.token);
          localStorage.setItem('order-data', JSON.stringify(res?.data));
          setOrderData(res?.data);
        })
        .catch((e) =>
          ToastWrapper(
            e?.response?.data?.message || 'Tạo đơn hàng thất bại',
            'error'
          )
        );
    })();
  };

  const handlePreviewButton = async () => {
    await handleSubmit((_data) => {
      const document = uploadType === 'file' ? fileList : urlList;
      if (!validateForm(_data, document)) return;
      setPreviewData({
        ..._data,
        document,
        uploadType,
        deliveryType,
      });
    })();
  };

  if (orderData?.orderCode) {
    return (
      <Styles>
        <SearchPlaceHolder
          text='Tra cứu đơn hàng'
          setShow={setShowSearchModal}
        />
        <OrderInfo {...orderData} />
        <SearchModal show={showSearchModal} setShow={setShowSearchModal} />
      </Styles>
    );
  }

  return (
    <Styles>
      <SearchPlaceHolder text='Tra cứu đơn hàng' setShow={setShowSearchModal} />

      <a target='_blank' rel='noopener noreferrer' href={PRINT_URL}>
        <Image className='mt-3' src={HomeBanner} fluid rounded />
      </a>

      <div className='body'>
        <div>
          <label className='custom-label'>Tải lên tài liệu</label>
          <div className='sub-label'>
            Tải lên tài liệu từ máy tính hoặc nhập đường dẫn tới tài liệu
          </div>
          <div className='custom-area'>
            <FileArea
              uploadType={uploadType}
              setUploadType={setUploadType}
              fileList={fileList}
              setFileList={setFileList}
              urlList={urlList}
              setUrlList={setUrlList}
            />
          </div>
        </div>

        <Row>
          <label className='custom-label'>Thể loại và quy cách in</label>
          <div className='sub-label'>
            Chọn thể loại và thêm quy cách tài liệu cho nhà
            in
          </div>
          <SelectField2
            options={categories}
            label='Thể loại in'
            control={control}
            name='category'
            hasAsterisk
          />
        </Row>
        <Row>
          <SelectField2
            isMulti
            options={tagList}
            label='Quy cách in'
            control={control}
            name='tags'
            hasAsterisk
          />
        </Row>
        {!!tag && (
          <Row>
            <div>
              <Table striped bordered hover size='sm'>
                <thead>
                  <tr>
                    <th>Thể loại</th>
                    <th>Quy cách</th>
                  </tr>
                </thead>
                <tbody>
                  {tag?.map((v) => {
                    return (
                      <tr>
                        <td className=''>{v?.label}</td>
                        <td>
                          <div
                            className='suggestion-content'
                            dangerouslySetInnerHTML={{ __html: v?.description }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
            <InputField
              placeholder='Vui lòng trả lời các câu hỏi ở bảng trên để nhân viên hiểu yêu cầu của bạn'
              control={control}
              name='instruction'
              as='textarea'
              rows={5}
              rules={{
                maxLength: {
                  value: 1000,
                  message: 'Độ dài tối đa 1000 ký tự',
                },
                required: 'Vui lòng nhập trường này',
              }}
              onClear={handleClearButton}
            />
          </Row>
        )}
        <div>
          <div className='custom-label'>Thông tin khách hàng</div>
          <div className='sub-label'></div>
          <Row>
            <Col className='mb-3'>
              <InputField
                label='Số điện thoại liên hệ'
                placeholder='Nhập số điện thoại của bạn'
                control={control}
                name='tel'
                rules={{
                  maxLength: {
                    value: 10,
                    message: 'Độ dài 10 ký tự',
                  },
                  minLength: {
                    value: 10,
                    message: 'Độ dài 10 ký tự',
                  },
                  required: 'Vui lòng nhập trường này',
                }}
                onClear={handleClearButton}
                hasAsterisk
              />
            </Col>
            <Col lg={6} className='mb-3'>
              <InputField
                label='Zalo nhận báo giá'
                placeholder='Nhập số zalo để nhận báo giá'
                control={control}
                name='zalo'
                rules={{
                  maxLength: {
                    value: 10,
                    message: 'Độ dài 10 ký tự',
                  },
                  minLength: {
                    value: 10,
                    message: 'Độ dài 10 ký tự',
                  },
                  required: 'Vui lòng nhập trường này',
                }}
                onClear={handleClearButton}
                hasAsterisk
              />
            </Col>
          </Row>
        </div>
        <div>
          <div className='custom-label'>Hình thức giao nhận</div>
          <div className='sub-label'></div>
          <div className='custom-area'>
            <RadioField2
              options={deliveryOptions}
              labelClasses='fw-bold'
              name='deliveryType'
              onChange={(val) => setDeliveryType(val)}
              checkValue={deliveryType || 'office'}
            />
          </div>
        </div>
        {couponData && <CouponArea {...couponData} />}
        <Row className='mt-5 py-5'>
          <Col lg={4} className='mb-3'>
            <Button
              className='py-2'
              variant='outline-secondary w-100'
              onClick={handlePreviewButton}
            >
              Xem trước đơn hàng
            </Button>
          </Col>
          <Col lg={8}>
            <Button
              className='py-2 w-100 text-white'
              variant='primary'
              disabled={isSubmitting}
              onClick={handleSubmitButton}
            >
              {isSubmitting ? 'Vui lòng chờ...' : 'Tạo đơn hàng in ấn'}
            </Button>
          </Col>
        </Row>
      </div>
      <OrderPreview
        show={!!previewData}
        setShow={setPreviewData}
        {...previewData}
      />
      <InstructionModal
        show={showInstructionModal}
        setShow={setShowInstructionModal}
      />
      <SearchModal show={showSearchModal} setShow={setShowSearchModal} />
      <CouponModal show={showCouponModal} setShow={setShowCouponModal} />
    </Styles>
  );
}

export default PhotocopyPage;

const Styles = styled.div`
  .instruction-btn {
    text-decoration: underline;
    font-size: 1.5rem;
    color: #0055ff;
    cursor: pointer;
  }

  .body {
    background-color: white;
    padding: 2rem 0rem;
    margin-top: 1rem;
    border-radius: 15px;

    .custom-area {
      padding: 1rem;
      border: 1px solid #ccc;
      border-radius: 15px;
      border-style: dashed;
      width: 100%;
    }

    .custom-label {
      font-size: 1rem;
      font-weight: 500;
      margin: 1.5rem 0 0;
    }

    .sub-label {
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      font-weight: 400;
      color: #595959;
    }

    .form-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #595959;
    }

    .apply-text {
      font-size: 0.9rem;
    }

    .remove-text {
      color: red;
      background-color: red;
    }

    .suggestion-label {
    }

    .suggestion-content {
      font-size: 0.9rem;
      color: #595959;
      font-style: italic;
    }
  }
`;
