import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import SearchBar from "components/SearchBar";
import styles from "./registerPage.module.css";
import styled from "styled-components";
import { toastWrapper } from "utils";

import { DRIVING_LICENSE_NUMBER, ZALO_OA_NUMBER } from "constants/contact";
import { convertPhoneNumber } from "utils";
import ZaloLink from "components/link/ZaloLink";

import drivingApi from "api/drivingApi";
import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import AccountModal from "../components/AccountModal";
import { BsFillCheckCircleFill } from "react-icons/bs";
import FileUploader from "components/form/FileUploader";
import InputField from "components/form/InputField";
import { useForm } from "react-hook-form";
import RadioField from "components/form/RadioField";
import { FILE_UPLOAD_URL } from "constants/endpoints";
import { formatCurrency } from "utils/commonUtils";
import { DRIVING_STATE, DRIVING_STATE_LABEL, DRIVING_TYPE_LABEL } from "features/admin/driving-license/constant";
import { PATH } from "constants/path";

export default function DrivingRegisterPage() {
  const centerShortName = useParams().shortName || '';
  
  const MAP_URL ='https://maps.app.goo.gl/kyq58xK5b8p4rEi1A';
  const categories = [
    {
      value: 0,
      label: "Bằng A1 (Mô tô 2 bánh có dung tích xi lanh đến 125 cm3)",
    },
    {
      value: 1,
      label: "Bằng A (Mô tô 2 bánh không giới hạn dung tích xi lanh, trung tâm liên hệ hướng dẫn qua điện thoại)",
    },
    {
      value: 2,
      label: "Bằng B1/B2/C (Bằng lái xe ô tô, trung tâm liên hệ hướng dẫn qua điện thoại)",
    }
  ]

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
    defaultValues: {
      feedback: '',
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
  }

  const drivingInfo = JSON.parse(localStorage.getItem('driving-info') || '{}');
  const drivingDateInfo = JSON.parse(localStorage.getItem('driving-date') || '{}');
  const [drivingTel, setDrivingTel] = useState(drivingInfo?.tel || '');
  const drivingLink = localStorage.getItem("driving-link") || '';
  const drivingDate = useMemo(()=>{
    if(drivingInfo?.date) {
      return new Date(drivingInfo?.date).toLocaleDateString('en-GB').split("/").join("");
    } else return null;
  }, [drivingInfo?.date]);
  const { search } = useLocation();
  const source = new URLSearchParams(search).get("s") || 0;

  const [accountShow, setAccountShow] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(1);
  const [drivingType, setDrivingType] = useState(0);
  const [date, setDate] = useState(false);
  const [dateList, setDateList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchData, setSearchData] = useState(null);
  const[frontUploading, setFrontUploading] = useState(false);
  const[backUploading, setBackUploading] = useState(false);
  const[portraitUploading, setPortraitUploading] = useState(false);
  const [frontData, setFrontData] = useState(null);
  const [backData, setBackData] = useState(null);
  const [portraitData, setPortraitData] = useState(null);
  const [drivingCenter, setDrivingCenter] = useState(null);

  useEffect(() => {
    const getDrivingDates = async (center) => {
      drivingApi.getFormVisible(center).then((res) => {
        let dates = res?.data || [];
        dates = dates.map((child) => {
          return { label: child?.description, value: child?._id, link: child?.link, date: new Date(child?.date), aPrice: child?.aPrice, bPrice: child?.bPrice, center: child?.center?._id };
        });

        setDateList(dates);
      }).catch((e) => {
        toastWrapper('Lỗi hệ thống, vui lòng thử lại sau', 'error');
      });
    }

    if(centerShortName) {
      drivingApi.queryDrivingCenters({shortName: centerShortName}).then((res) => {
        if (res?.data?.length > 0) {
          const center = res?.data[0]
          document.title = center.name;
          setDrivingCenter(center);
          getDrivingDates(center?._id);
        }
      }).catch((e) => {
        toastWrapper('Lỗi hệ thống, vui lòng thử lại sau', 'error');
      });
    } else {
      getDrivingDates();
    }
  }, []);

  useEffect(() => {
    if (date) {
      const dateObj = dateList.filter((child) => child.value == date)[0];

      drivingApi.getDrivingCenterById(dateObj?.center).then((res) => {
        setDrivingCenter(res?.data);
      }).catch((e) => {
        toastWrapper('Lỗi hệ thống, vui lòng thử lại sau', 'error');
      });
    }
  }, [date]);

  const handleSubmitButton = async () => {
    await handleSubmit((formData) => {
      setIsLoading(true);

    if(!frontData) {
      toastWrapper('Vui lòng tải lên mặt trước CCCD', 'error');
      setIsLoading(false);
      return;
    }

    if(!backData) {
      toastWrapper('Vui lòng tải lên mặt sau CCCD', 'error');
      setIsLoading(false);
      return;
    }

    if(!portraitData) {
      toastWrapper('Vui lòng tải lên ảnh chân dung', 'error');
      setIsLoading(false);
      return;
    }

    if(parseInt(drivingType) === 0 && !date) {
      toastWrapper('Vui lòng chọn ngày dự thi', 'error');
      setIsLoading(false);
      return;
    }

    let drivingLink = '';
    
    if(drivingType == 0) {
      const dateObj = dateList.filter((child) => child.value == date)[0];
      drivingLink = dateObj?.link;
      localStorage.setItem('driving-link', drivingLink || '');
      localStorage.setItem('driving-date', JSON.stringify(dateObj));
      localStorage.setItem('driving-type', drivingType);
      formData.date = dateObj?.date?.getTime();
      formData.center = dateObj?.center;
    } else {
      localStorage.setItem('driving-link', '');
      localStorage.setItem('driving-type', drivingType);
    }

    const data = {
      ...formData,
      frontUrl: frontData?.url,
      backUrl: backData?.url,
      portraitUrl: portraitData?.url,
      isPaid: false,
      paymentMethod: paymentMethod,
      drivingType: drivingType,
      source: source,
      link: drivingLink,
    }

    drivingApi.addDriving(data)
    .then((res) => {
      localStorage.setItem('driving-info', JSON.stringify(res?.data));
      setDrivingTel(res?.data?.tel);
    })
    .catch((error) => {
      toastWrapper(`${error.toString()}`, "error");
    }).finally(() => {
      setIsLoading(false);
    }
    );
    })();
  };

  const handleDrivingTypeChange = (value) => {
    setDate(false);
    setDrivingType(value);
  };

  const handleDateChange = (value) => {
    setDate(value);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value.trim());
  };

  const handleSearchPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      drivingApi.searchDriving(searchValue)
        .then((res) => {
          const data = res.data;

          if (data.length === 0) {
            toastWrapper(
              "Không tìm thấy hồ sơ khớp với số điện thoại " + searchValue,
              "error"
            );
          } else {
            setDrivingTel(searchValue);
            setSearchData(data);
          }
        })
        .catch((e) => {
          toastWrapper(
            "Không tìm thấy hồ sơ khớp với số điện thoại " + searchValue,
            "error"
          );
        });
    }
  };

  return (
    <Styles className={styles.drivingRegisterContainer}>
      <SearchBar
        placeholder={"Tra cứu trạng thái hồ sơ"}
        focusText={"Nhập số điện thoại và nhấn Enter"}
        onChange={handleSearchChange}
        onKeyPress={handleSearchPress}
        value={searchValue}
      />
      {searchData &&
        searchData.map((child) => {
          const date = new Date(child.createdAt);
          const processDate = new Date(date);
          processDate.setDate(date.getDate() + 1);

          return (
            <Card key={child?._id} className="my-3">
              <Card.Body>
                <div className={styles.orderContainer}>
                  <p>Họ tên: {child?.name}</p>
                  <p>Tình trạng: {DRIVING_STATE_LABEL[child.processState]}</p>
                  <p>
                    Ngày xử lý:
                    {` ${processDate.getDate()}/${processDate.getMonth() + 1
                      }/${processDate.getFullYear()}`}
                  </p>
                  <p>Hạng thi: {DRIVING_TYPE_LABEL[child?.drivingType]}</p>
                  {child?.center && <p>Điểm thi: {child?.center?.name}</p>}
                  {child?.cash > 0 && <p>Đã chuyển khoản: {formatCurrency(child?.cash || 0)} VNĐ</p>}
                  <p>
                    Vui lòng gửi biên lai qua Zalo{" "}
                    <ZaloLink tel={DRIVING_LICENSE_NUMBER}>
                      {convertPhoneNumber(DRIVING_LICENSE_NUMBER, ".")}
                    </ZaloLink>{" "}
                    trong trường hợp hồ sơ của bạn chưa được xử lý.
                  </p>
                </div>
              </Card.Body>
            </Card>
          );
        })}
        
      {drivingInfo?._id ? <div className="success-container d-flex flex-column align-items-center">
        <Row className="mb-3">
          <BsFillCheckCircleFill color='#019f91' size={45} />
        </Row>
        <p className="text-center text-danger fw-bold">Tham gia nhóm thi tại <a target="_blank" rel="noreferrer" href={drivingLink}>{drivingLink}</a></p>
        <p className="text-center">Học viên vui lòng tham gia khám sức khoẻ để hoàn tất thủ tục dự thi. Danh sách và lịch khám sức khoẻ sẽ được cập nhật hàng tuần trên nhóm thi.</p>
        <Button className="mb-3 text-white fw-bold" variant='primary' onClick={() => setAccountShow(true)}>Thanh toán chuyển khoản</Button>
        <Button className="mb-3" variant='outline-primary' onClick={() => setPaymentMethod(0)}>Thanh toán trực tiếp</Button>
        
        <p className="text-center">
            Zalo hỗ trợ:<br/>
            <ZaloLink tel='4013961016678131109'>
              Trung tâm dịch vụ sinh viên iStudent
            </ZaloLink>
          </p>
          <Button className="mb-3" variant='outline-primary' onClick={() => {
          localStorage.removeItem('driving-info');
          window.location.reload();
        }}>Đăng ký hồ sơ mới</Button>
      </div> : <form className={styles.drivingFormContainer}>
        <p className="my-3 text-danger">* bắt buộc</p>

        <Row className="mb-3">
          <Col>
              <InputField
                hasAsterisk={true}
                label='Tên của bạn'
                subLabel='Nhập họ tên đầy đủ, có dấu'
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

        <Row className="mb-3">
          <Col>
              <InputField
                hasAsterisk={true}
                label='Số điện thoại liên hệ'
                control={control}
                name='tel'
                type='number'
                rules={{
                  maxLength: {
                    value: 10,
                    message: 'Số điện thoại phải có 10 chữ số',
                  },
                  minLength: {
                    value: 10,
                    message: 'Số điện thoại phải có 10 chữ số',
                  },
                  required: 'Vui lòng nhập trường này',
                }}
                onClear={handleClearButton}
              />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
              <InputField
                hasAsterisk={true}
                label='Số điện thoại Zalo'
                control={control}
                name='zalo'
                type='number'
                rules={{
                  maxLength: {
                    value: 10,
                    message: 'Số điện thoại Zalo phải có 10 chữ số',
                  },
                  minLength: {
                    value: 10,
                    message: 'Số điện thoại Zalo phải có 10 chữ số',
                  },
                  required: 'Vui lòng nhập trường này',
                }}
                onClear={handleClearButton}
              />
          </Col>
        </Row>

        <Row className="mb-3">
            <Col>
              <FileUploader fileName={frontData?.originalName} onResponse={(res) => setFrontData(res?.data)} url={FILE_UPLOAD_URL} name='file' uploading={frontUploading} setUploading={setFrontUploading}  label='Mặt trước CCCD' hasAsterisk={true} subLabel='Không chói loá hay mất góc' accept={{
                'image/png': ['.png'], 
                'image/jpeg': ['.jpg', '.jpeg'],
              }}/>
            </Col>
        </Row>

        <Row className="mb-3">
            <Col>
              <FileUploader fileName={backData?.originalName} onResponse={res => setBackData(res?.data)} url={FILE_UPLOAD_URL} name='file' uploading={backUploading} setUploading={setBackUploading}  label='Mặt sau CCCD' hasAsterisk={true} subLabel='Không chói loá hay mất góc' accept={{
                'image/png': ['.png'], 
                'image/jpeg': ['.jpg', '.jpeg'] 
              }}/>
            </Col>
        </Row>

        <Row className="mb-3">
            <Col>
              <FileUploader fileName={portraitData?.originalName} onResponse={res => setPortraitData(res?.data)} url={FILE_UPLOAD_URL} name='file' uploading={portraitUploading} setUploading={setPortraitUploading} label='Ảnh chân dung' hasAsterisk={true} subLabel='Lấy đủ 2 vai từ thắt lưng, không đeo kính, tóc không che trán, nhìn rõ và không quá 3 tháng' accept={{
                'image/png': ['.png'],
                'image/jpeg': ['.jpg', '.jpeg'] 
              }} />
            </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <RadioField
              hasAsterisk={true}
              options={categories}
              label='Chọn loại bằng lái'
              control={control}
              name='category'
              onClear={handleClearButton}
              onChange={handleDrivingTypeChange}
              defaultChecked={0}
            />
          </Col>
        </Row>

        {drivingType == categories[0]?.value && <Row className="mb-3">
          <Col>
            <RadioField
              hasAsterisk={true}
              options={dateList}
              label='Chọn điểm thi và ngày dự thi'
              control={control}
              name='date'
              onClear={handleClearButton}
              onChange={handleDateChange}
            />
              {date && <Form.Text>Xem hướng dẫn chi tiết điểm thi và các gói thi <a href={drivingCenter?.instructionLink || PATH.DRIVING.CENTER.HUONG_DAN.replace(':shortName/', centerShortName)} target="_blank" rel="noopener noreferrer">tại đây.</a></Form.Text>}
          </Col>
        </Row>}

        <Row className="mb-3">
          <Col>
              <InputField
                label='Bằng lái hạng khác'
                subLabel='Vui lòng ghi rõ loại bằng lái hạng khác (nếu có)'
                control={control}
                name='feedback'
                as='textarea'
                rules={{
                  required: false,
                  maxLength: {
                    value: 500,
                    message: 'Độ dài không vượt quá 500 ký tự',
                  }
                }}
                onClear={handleClearButton}
              />
          </Col>
        </Row>

        <p style={{ margin: "1rem 0" }}>
            Bằng cách bấm Đăng ký, khách hàng đã đồng ý với <a href="https://file.uniapp.vn/-ff2ZVv45XH" target='_blank' rel='noopener noreferrer'>Điều khoản sử dụng dữ liệu</a> của chúng tôi, mọi thắc mắc vui lòng liên hệ Zalo Offical Account{" "}
            <ZaloLink tel='4013961016678131109'>Trung tâm dịch vụ sinh viên iStudent</ZaloLink>{' '}
            để được hỗ trợ nhanh nhất.
          </p>

        {isLoading ? (
          <>
            <p>Hệ thống đang xử lý, vui lòng chờ trong ít nhất 15 giây</p>
            <p className={styles.formSubmitButton}>Đang đăng ký</p>
          </>
        ) : (
          <button
            type="button"
            onClick={handleSubmitButton}
            className={styles.formSubmitButton}
          >
            Đăng ký
          </button>
        )}
      </form>}
      <Modal show={paymentMethod === 0} onHide={() => setPaymentMethod(1)} size="lg">
        <Modal.Header>
          <Modal.Title>Thanh toán trực tiếp</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Tại văn phòng iSinhvien:</p>
          <p>- Địa chỉ: Đ. Nguyễn Du, Đông Hoà, Dĩ An, Bình Dương
            (Tầng trệt Nhà khách ĐHQG-HCM)</p>
          <p>- Giờ làm việc: Từ thứ 2 - thứ 7 (14h00-17h00).</p>
          <p>- Mang theo CCCD để làm thủ tục.</p>
          <p>- Hotline: <ZaloLink tel={DRIVING_LICENSE_NUMBER}>0876 877 789</ZaloLink></p>
          <p>- Zalo OA tư vấn và hỗ trợ: <ZaloLink tel={ZALO_OA_NUMBER}>Trung tâm dịch vụ sinh viên iStudent</ZaloLink></p>
          <p>- Google maps:{" "}
            <a
              href={MAP_URL}
              target="_blank"
              rel="noreferrer"
            >
              Văn phòng iSinhvien
            </a></p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setPaymentMethod(1)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
      <AccountModal bankName='Ngân hàng Quân đội (MBBANK)' bankCode='970422' show={accountShow} setShow={setAccountShow} accountNumber='7899996886' accountName='NGUYEN NGOC HUAN' tel={drivingTel} aPrice={drivingDateInfo?.aPrice} bPrice={drivingDateInfo?.bPrice}/>
    </Styles>
  );
}

const Styles = styled.div`
  .portrait-rules {
    margin: 0 auto;
    width: 95%;
    border-radius: 0.5rem;
    overflow: hidden;
  }

  .filename {
    margin: 1rem 0 0;
    font-weight: bold;
  }

  .info-area {
    background-color: white;
    margin: 1rem auto;
    padding: 1rem 0;
    width: 95%;
    border-radius: 15px;
  }

  .info-area ul {
    list-style: none;
  }

  .success-container {
    background-color: white;
    margin: 1rem auto;
    padding: 1rem;
    width: 95%;
    border-radius: 15px;

  }
`;
