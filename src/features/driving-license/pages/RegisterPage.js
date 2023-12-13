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
import { Button, Col, Row } from "react-bootstrap";
import AccountModal from "../components/AccountModal";
import { BsFillCheckCircleFill } from "react-icons/bs";
import FileUploader from "components/form/FileUploader";
import InputField from "components/form/InputField";
import { useForm } from "react-hook-form";
import RadioField from "components/form/RadioField";
import { FILE_UPLOAD_URL } from "constants/endpoints";

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
  const [date, setDate] = useState(0);
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

  const imageExtensions = [
    "image/jpeg",
    "image/png",
    "image/svg+xml",
    "image/webp",
  ];

  useEffect(() => {
    drivingApi.getFormVisible().then((res) => {
      let dates = res?.data || [];
      dates = dates.map((child) => {
        return { label: child?.description, value: child };
      });

      setDateList(dates);
    }).catch((e) => {
      console.log(e)
    });  
  }, []);

  const handleSubmitButton = async () => {
    await handleSubmit((data) => {
      console.log(data)
    })();
    // setIsLoading(true);
    // if (!frontsideFile) {
    //   setIsLoading(false);

    //   return toastWrapper("Lỗi: Vui lòng tải lên mặt trước cmnd/cccd", "error");
    // }
    // if (!backsideFile) {
    //   setIsLoading(false);
    //   return toastWrapper("Lỗi: Vui lòng tải lên mặt sau cmnd/cccd", "error");
    // }
    // if (!portraitFile) {
    //   setIsLoading(false);
    //   return toastWrapper(
    //     "Lỗi: Vui lòng tải lên ảnh chân dung của bạn",
    //     "error"
    //   );
    // }

    // const fullname = document.getElementById("formName").value?.trim();
    // const tel = document.getElementById("formTel").value?.trim();
    // const zalo = document.getElementById("formZalo").value.trim();
    // const feedback = document.getElementById("formFeedback").value.trim();
    // let paidState = isPaid === 0;

    // if (!fullname || !tel || !zalo) {
    //   setIsLoading(false);
    //   return toastWrapper(
    //     "Vui lòng nhập đầy đủ: họ tên, số điện thoại và  zalo của bạn",
    //     "error"
    //   );
    // }

    // const formData = new FormData();

    // formData.append("name", fullname);
    // formData.append("tel", tel);
    // formData.append("zalo", zalo);
    // formData.append("frontside", frontsideFile);
    // formData.append("backside", backsideFile);
    // formData.append("portrait", portraitFile);
    // formData.append("receipt", receiptFile);
    // formData.append("isPaid", paidState);
    // formData.append("paymentMethod", paymentMethod);
    // formData.append("feedback", feedback);
    // formData.append("drivingType", drivingType);
    // formData.append("source", source);

    // if (drivingType === 0) {
    //   formData.append("date", dateList[date].date.getTime());
    //   localStorage.setItem('driving-link', dateList[date]?.link || '');
    // }

    // drivingApi.addDriving(formData)
    //   .then((res) => {
    //     console.log(res)
    //     localStorage.setItem('driving-info', JSON.stringify(res?.data));
    //     toastWrapper(
    //       `Đăng ký thành công. Trung tâm sẽ liên hệ với bạn trong thời gian sớm nhất. Nếu bạn cần hỗ trợ thêm, vui lòng liên hệ zalo: ${DRIVING_LICENSE_NUMBER} (Mr. Trung) để được xử lý.`,
    //       "success",
    //       { autoClose: 10000 }
    //     );

    //     document.getElementById("formName").value = "";
    //     document.getElementById("formTel").value = "";
    //     document.getElementById("formZalo").value = "";
    //     document.getElementById("formFeedback").value = "";

    //     setIsLoading(false);
    //   })
    //   .catch((error) => {
    //     toastWrapper(`${error.toString()}`, "error");
    //     setIsLoading(false);
    //   });
  };

  const handleDrivingTypeChange = (value) => {
    setDrivingType(value);
  };

  const handleDateChange = (value) => {
    setDate(value);
  };

  const handlePaymentMethodChange = (value) => {
    console.log(value)
  }

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
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
      {/* <SearchBar
        style={{ border: '1px solid' }}
        placeholder={"Tra cứu trạng thái hồ sơ"}
        focusText={"Nhập số điện thoại và nhấn Enter"}
        onChange={handleSearchChange}
        onKeyPress={handleSearchPress}
        value={searchValue}
      />
      {searchData &&
        searchData.map((child) => {
          const date = new Date(child.date);
          const processDate = new Date(date);
          processDate.setDate(date.getDate() - 14);
          let state = "";

          if (child.processState === 0) {
            state = "Đang chờ xử lý";
          } else if (child.processState === 1) {
            state = "Đang chờ cập nhật";
          } else if (child.processState === 2) {
            state = "Đang chờ thanh toán";
          } else if (child.processState === 3) {
            state = "Đã hoàn tất hồ sơ";
          } else if (child.processState === 4) {
            state = "Đã hủy hồ sơ";
          }

          return (
            <div className={styles.orderContainer}>
              <p>Họ tên: {child.name}</p>
              <p>
                Ngày dự thi:
                {` ${date.getDate()}/${date.getMonth() + 1
                  }/${date.getFullYear()}`}
              </p>
              <p>Trạng thái: {state}</p>
              <p>
                Hồ sơ của bạn sẽ được xử lý vào ngày:
                {` ${processDate.getDate()}/${processDate.getMonth() + 1
                  }/${processDate.getFullYear()}`}
              </p>
              <p>
                Vui lòng liên hệ Zalo OA{" "}
                <ZaloLink tel={ZALO_OA_NUMBER}>
                  {convertPhoneNumber(ZALO_OA_NUMBER, ".")}
                </ZaloLink>{" "}
                để được hỗ trợ trong trường hợp hồ sơ của bạn chưa được xử lý.
              </p>
            </div>
          );
        })} */}

      <Row>
        <Col>
          <LazyImage src={PortraitBanner} className='rounded'/>
        </Col>
      </Row>
        
      {drivingInfo?._id ? <div className="success-container d-flex flex-column align-items-center">
        <Row>
          <BsFillCheckCircleFill color='#019f91' size={45} />
        </Row>
        <h4 className='text-center mt-2 mb-3 text-uppercase'>
          Đăng ký hồ sơ thành công
        </h4>
        <p className="text-center text-danger fw-bold">Tham gia nhóm thi tại <a target="_blank" rel="noreferrer" href={drivingLink}>{drivingLink}</a></p>
        <p className="text-center">Bạn vui lòng hoàn thành lệ phí thi trước ngày dự thi 15 ngày.</p>
        <Button className="mb-3 ms-2" variant='outline-primary' onClick={() => {
          localStorage.removeItem('driving-info');
          window.location.reload();
        }}>Đăng ký hồ sơ mới</Button>
        <p className="text-center">
            Zalo hỗ trợ:<br/>
            <ZaloLink tel='4013961016678131109'>
              Trung tâm dịch vụ sinh viên iStudent
            </ZaloLink>
          </p>
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
                label='Số điện thoại Zalo'
                control={control}
                name='zalo'
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

        <Row className="mb-3">
            <Col>
              <FileUploader onResponse={setFrontData} url={FILE_UPLOAD_URL} name='file' uploading={frontUploading} setUploading={setFrontUploading}  label='Mặt trước CCCD/CMND' hasAsterisk={true} subLabel='Không chói loá hay mất góc'/>
            </Col>
        </Row>

        <Row className="mb-3">
            <Col>
              <FileUploader onResponse={setBackData} url={FILE_UPLOAD_URL} name='file' uploading={backUploading} setUploading={setBackUploading}  label='Mặt sau CCCD/CMND' hasAsterisk={true} subLabel='Không chói loá hay mất góc'/>
            </Col>
        </Row>

        <Row className="mb-3">
            <Col>
              <FileUploader onResponse={setPortraitData} url={FILE_UPLOAD_URL} name='file' uploading={portraitUploading} setUploading={setPortraitUploading} label='Ảnh chân dung' hasAsterisk={true} subLabel='Lấy đủ 2 vai từ thắt lưng, không đeo kính, tóc không che trán, nhìn rõ và không quá 3 tháng' />
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

      <AccountModal bankName='Ngân hàng Quân đội (MBBANK)' bankCode='970422' show={accountShow} setShow={setAccountShow} amount={690000} accountNumber='7899996886' accountName='NGUYEN NGOC HUAN' desc={`GPLX ${drivingInfo?.tel || '<Số điện thoại>'} ${drivingDate || '<Ngày dự thi>'}`} />
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
