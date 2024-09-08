import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import SearchBar from "components/SearchBar";
import styles from "./registerPage.module.css";
import LazyImage from "components/LazyImage";
import PortraitBanner from "assets/images/driving-license/portrait.jpg";
import styled from "styled-components";
import { toastWrapper } from "utils";

import { DRIVING_LICENSE_NUMBER, ZALO_OA_NUMBER } from "constants/contact";
import { convertPhoneNumber } from "utils";
import ZaloLink from "components/link/ZaloLink";

import drivingApi from "api/drivingApi";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import AccountModal from "../components/AccountModal";
import { BsFillCheckCircleFill } from "react-icons/bs";
import FileUploader from "components/form/FileUploader";
import InputField from "components/form/InputField";
import { useForm } from "react-hook-form";
import RadioField from "components/form/RadioField";
import { FILE_UPLOAD_URL } from "constants/endpoints";
import { formatCurrency } from "utils/commonUtils";

export default function DrivingRegisterPage() {
  const categories = [
    {
      value: 0,
      label: "Bằng A1 (Mô tô 2 bánh có dung tích xi lanh từ 50cc cho đến dưới 175cc, chọn ngày thi ở mục bên dưới)",
    },
    {
      value: 1,
      label: "Bằng A2 (Mô tô 2 bánh không giới hạn dung tích xi lanh, trung tâm liên hệ hướng dẫn qua điện thoại)",
    },
    {
      value: 2,
      label: "Bằng B1/B2 (Bằng lái xe ô tô, trung tâm liên hệ hướng dẫn qua điện thoại)",
    }
  ]

  const paymentMethods = [
    {
      value: 0,
      label: "Đóng trực tiếp tại Nhà khách ĐHQG-HCM",
    },
    {
      value: 1,
      label: "Chuyển khoản ngân hàng",
    },
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

  // const imageExtensions = [
  //   "image/jpeg",
  //   "image/png",
  //   "image/svg+xml",
  //   "image/webp",
  // ];

  useEffect(() => {
    drivingApi.getFormVisible().then((res) => {
      let dates = res?.data || [];
      dates = dates.map((child) => {
        return { label: child?.description, value: child?._id, link: child?.link, date: new Date(child?.date), aPrice: child?.aPrice, bPrice: child?.bPrice };
      });

      setDateList(dates);
    }).catch((e) => {
      toastWrapper('Lỗi hệ thống, vui lòng thử lại sau', 'error');
    });  
  }, []);

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
      <p className="text-center">Xem hướng dẫn đăng ký dự thi <a href="/driving-instruction" target="_blank" rel="noopener noreferrer">tại đây.</a></p>
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
          let state = "";

          if (child?.processState === 4) {
            state = "Đã hủy hồ sơ";
          } else {
            state = "Đang xử lý";
          }

          return (
            <Card key={child?._id} className="my-3">
              <Card.Body>
              <div className={styles.orderContainer}>
              <p>Họ tên: {child?.name}</p>
              <p>Trạng thái: {state}</p>
              <p>
                Ngày xử lý:
                {` ${processDate.getDate()}/${processDate.getMonth() + 1
                  }/${processDate.getFullYear()}`}
              </p>
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
        <p className="text-center">Học viên vui lòng hoàn thành lệ phí và tham gia khám sức khoẻ để hoàn tất thủ tục dự thi. Danh sách và lịch khám sức khoẻ sẽ được cập nhật hàng tuần trên nhóm thi.</p>
        <Button className="mb-3 text-white fw-bold" variant='primary' onClick={() => setAccountShow(true)}>Thanh toán online</Button>
        <a className="btn btn-outline-primary mb-3" href='driving-instruction#offline' target='_blank' rel="noopener noreferrer">Thanh toán trực tiếp</a>
        
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
              <FileUploader fileName={frontData?.originalName} onResponse={(res) => setFrontData(res?.data)} url={FILE_UPLOAD_URL} name='file' uploading={frontUploading} setUploading={setFrontUploading}  label='Mặt trước CCCD' hasAsterisk={true} subLabel='Không chói loá hay mất góc'/>
            </Col>
        </Row>

        <Row className="mb-3">
            <Col>
              <FileUploader fileName={backData?.originalName} onResponse={res => setBackData(res?.data)} url={FILE_UPLOAD_URL} name='file' uploading={backUploading} setUploading={setBackUploading}  label='Mặt sau CCCD' hasAsterisk={true} subLabel='Không chói loá hay mất góc'/>
            </Col>
        </Row>

        <Row className="mb-3">
            <Col>
              <FileUploader fileName={portraitData?.originalName} onResponse={res => setPortraitData(res?.data)} url={FILE_UPLOAD_URL} name='file' uploading={portraitUploading} setUploading={setPortraitUploading} label='Ảnh chân dung' hasAsterisk={true} subLabel='Lấy đủ 2 vai từ thắt lưng, không đeo kính, tóc không che trán, nhìn rõ và không quá 3 tháng' />
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
              label='Chọn ngày dự thi'
              control={control}
              name='date'
              onClear={handleClearButton}
              onChange={handleDateChange}
            />
              <Form.Text>Xem hướng dẫn chi tiết điểm thi và các gói thi <a href="/driving-instruction" target="_blank" rel="noopener noreferrer">tại đây.</a></Form.Text>
          </Col>
        </Row>}

        <Row className="mb-3">
          <Col>
              <InputField
                label='Bằng lái hạng khác/Mã ưu đãi'
                subLabel='Vui lòng ghi rõ loại bằng lái hạng khác hoặc mã ưu đãi (nếu có)'
                control={control}
                name='feedback'
                as='textarea'
                rules={{
                  required: false,
                }}
                onClear={handleClearButton}
              />
          </Col>
        </Row>

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
          <p style={{ margin: "1rem 0" }}>
            Trong quá trình đăng ký, nếu xảy ra lỗi hệ thống, vui lòng chụp màn
            hình lỗi gửi về Zalo OA:{" "}
            <ZaloLink tel='4013961016678131109'>Trung tâm dịch vụ sinh viên iStudent</ZaloLink>{' '}
            để được hỗ trợ nhanh nhất.
          </p>
      </form>}

      <AccountModal bankName='Ngân hàng Quân đội (MBBANK)' bankCode='970422' show={accountShow} setShow={setAccountShow} amount={690000} accountNumber='7899996886' accountName='NGUYEN NGOC HUAN' tel={drivingTel} aPrice={drivingDateInfo?.aPrice} bPrice={drivingDateInfo?.bPrice}/>
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
