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
import { Button, Row } from "react-bootstrap";
import AccountModal from "../components/AccountModal";
import { BsFillCheckCircleFill } from "react-icons/bs";
import Asterisk from "components/form/Asterisk";

export default function DrivingRegisterPage() {
  const drivingInfo = JSON.parse(localStorage.getItem('driving-info') || '{}');
  const drivingLink = localStorage.getItem("driving-link") || '';
  const drivingDate = useMemo(()=>{
    if(drivingInfo?.date) {
      return new Date(drivingInfo?.date).toLocaleDateString('en-GB').split("/").join("");
    } else return null;
  }, [drivingInfo?.date]);
  const { search } = useLocation();
  const source = new URLSearchParams(search).get("s") || 0;

  const [frontsideName, setFrontsideName] = useState(null);
  const [accountShow, setAccountShow] = useState(false);
  const [frontsideFile, setFrontsideFile] = useState(null);
  const [backsideName, setBacksideName] = useState(null);
  const [backsideFile, setBacksideFile] = useState(null);
  const [portraitName, setPortraitName] = useState(null);
  const [portraitFile, setPortraitFile] = useState(null);
  const [receiptName, setReceiptName] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(1);
  const [isPaid, setIsPaid] = useState(1);
  const [drivingType, setDrivingType] = useState(0);
  const [date, setDate] = useState(0);
  const [dateList, setDateList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchData, setSearchData] = useState(null);

  const imageExtensions = [
    "image/jpeg",
    "image/png",
    "image/svg+xml",
    "image/webp",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await drivingApi.getFormVisible();
        let data = response.data;

        if (data.length > 0) {
          data = data.map((child) => {
            return {
              ...child,
              date: new Date(child.date),
            };
          });

          setDateList(data);
        } else {
          toastWrapper("Chưa có danh sách ngày thi mới", "info");
        }
      } catch (e) {
        toastWrapper("Lỗi khi lấy danh sách ngày thi", "error");
      }
    };

    fetchData();
  }, []);

  const handleSubmitButton = (e) => {
    setIsLoading(true);
    if (!frontsideFile) {
      setIsLoading(false);

      return toastWrapper("Lỗi: Vui lòng tải lên mặt trước cmnd/cccd", "error");
    }
    if (!backsideFile) {
      setIsLoading(false);
      return toastWrapper("Lỗi: Vui lòng tải lên mặt sau cmnd/cccd", "error");
    }
    if (!portraitFile) {
      setIsLoading(false);
      return toastWrapper(
        "Lỗi: Vui lòng tải lên ảnh chân dung của bạn",
        "error"
      );
    }

    const fullname = document.getElementById("formName").value?.trim();
    const tel = document.getElementById("formTel").value?.trim();
    const zalo = document.getElementById("formZalo").value.trim();
    const feedback = document.getElementById("formFeedback").value.trim();
    let paidState = isPaid === 0;

    if (!fullname || !tel || !zalo) {
      setIsLoading(false);
      return toastWrapper(
        "Vui lòng nhập đầy đủ: họ tên, số điện thoại và  zalo của bạn",
        "error"
      );
    }

    const formData = new FormData();

    formData.append("name", fullname);
    formData.append("tel", tel);
    formData.append("zalo", zalo);
    formData.append("frontside", frontsideFile);
    formData.append("backside", backsideFile);
    formData.append("portrait", portraitFile);
    formData.append("receipt", receiptFile);
    formData.append("isPaid", paidState);
    formData.append("paymentMethod", paymentMethod);
    formData.append("feedback", feedback);
    formData.append("drivingType", drivingType);
    formData.append("source", source);

    if (drivingType === 0) {
      formData.append("date", dateList[date].date.getTime());
      localStorage.setItem('driving-link', dateList[date]?.link || '');
    }

    drivingApi.addDriving(formData)
      .then((res) => {
        console.log(res)
        localStorage.setItem('driving-info', JSON.stringify(res?.data));
        toastWrapper(
          `Đăng ký thành công. Trung tâm sẽ liên hệ với bạn trong thời gian sớm nhất. Nếu bạn cần hỗ trợ thêm, vui lòng liên hệ zalo: ${DRIVING_LICENSE_NUMBER} (Mr. Trung) để được xử lý.`,
          "success",
          { autoClose: 10000 }
        );

        document.getElementById("formName").value = "";
        document.getElementById("formTel").value = "";
        document.getElementById("formZalo").value = "";
        document.getElementById("formFeedback").value = "";

        setIsLoading(false);
      })
      .catch((error) => {
        toastWrapper(`${error.toString()}`, "error");
        setIsLoading(false);
      });
  };

  const handlePaymentMethodChange = (value) => {
    setPaymentMethod(value);
  };

  const handleDrivingTypeChange = (value) => {
    setDrivingType(value);
  };

  const handleDateChange = (value) => {
    setDate(value);
  };

  const uploadFrontside = (e) => {
    if (imageExtensions.includes(e.target.files[0].type)) {
      setFrontsideFile(e.target.files[0]);
      setFrontsideName(e.target.files[0].name);
    } else {
      setFrontsideName("Lỗi: Tệp tải lên không phải là tệp hình ảnh");
    }
  };
  const uploadBackside = (e) => {
    if (imageExtensions.includes(e.target.files[0].type)) {
      setBacksideFile(e.target.files[0]);
      setBacksideName(e.target.files[0].name);
    } else {
      setBacksideName("Lỗi: Tệp tải lên không phải là tệp hình ảnh");
    }
  };
  const uploadPortrait = (e) => {
    if (imageExtensions.includes(e.target.files[0].type)) {
      setPortraitFile(e.target.files[0]);
      setPortraitName(e.target.files[0].name);
    } else {
      setPortraitName("Lỗi: Tệp tải lên không phải là tệp hình ảnh");
    }
  };

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
      <SearchBar
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
        })}

      <div className="portrait-rules">
        <LazyImage src={PortraitBanner} />
      </div>
      <div className="info-area d-flex flex-column align-items-center">
        <ul className="px-2">
          <li style={{ margin: 0 }}>
            Xem hướng dẫn đăng ký dự thi{" "}
            <a
              href="/driving-instruction"
              target="_blank"
              rel="noopener noreferrer"
            >
              tại đây
            </a>
          </li>
        </ul>
        <button className="mb-3 ms-2 btn btn-outline-primary" onClick={() => setAccountShow(true)}>Xem hướng dẫn chuyển khoản</button>
      </div>

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
        <p style={{ margin: 0, color: " #ff0000 " }}>* bắt buộc</p>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}> Tên của bạn<Asterisk/></label>
          <input
            className={styles.formInput}
            id="formName"
            type="text"
            placeholder="Nhập họ tên đầy đủ, có dấu"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Số điện thoại liên hệ<Asterisk/></label>
          <input
            className={styles.formInput}
            id="formTel"
            type="text"
            placeholder="Nhập số điện thoại của bạn"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Số điện thoại Zalo<Asterisk/></label>
          <input
            className={styles.formInput}
            id="formZalo"
            type="text"
            placeholder="Nhập số điện thoại Zalo của bạn"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Mặt trước CMND/CCCD<Asterisk/></label>
          <label className={styles.formUploadButton}>
            <input
              className={styles.formInput}
              type="file"
              accept="image/*"
              id="frontside"
              name="frontside"
              onChange={uploadFrontside}
              required
            />
            Tải tệp lên
          </label>
          {frontsideName ? <p className="filename">{frontsideName}</p> : null}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Mặt sau CMND/CCCD<Asterisk/></label>
          <label className={styles.formUploadButton}>
            <input
              className={styles.formInput}
              type="file"
              accept="image/*"
              id="backside"
              name="backside"
              onChange={uploadBackside}
              required
            />
            Tải tệp lên
          </label>
          {backsideName ? <p className="filename">{backsideName}</p> : null}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            Ảnh chụp chân dung<Asterisk/> (không chụp ảnh thẻ, xem ảnh mẫu trong hướng dẫn{" "}
            <a
              href="/driving-instruction#online"
              target="_blank"
              rel="noopener noreferrer"
            >
              tại đây
            </a>
            )
          </label>
          <label className={styles.formUploadButton}>
            <input
              className={styles.formInput}
              type="file"
              accept="image/*"
              id="portrait"
              name="portrait"
              onChange={uploadPortrait}
              required
            />
            Tải tệp lên
          </label>
          {portraitName ? <p className="filename">{portraitName}</p> : null}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Chọn loại bằng lái<Asterisk/></label>
          <div className={styles.selectContainer}>
            <input
              className={styles.formInput}
              type="radio"
              onChange={() => handleDrivingTypeChange(0)}
              checked={drivingType === 0}
            />
            <p onClick={() => handleDrivingTypeChange(0)}>
              Bằng A1 (Mô tô 2 bánh có dung tích xi lanh từ 50cc cho đến dưới
              175cc, lệ phí thi 650.000 đồng, chọn ngày thi ở mục bên dưới)
            </p>
          </div>
          <div className={styles.selectContainer}>
            <input
              className={styles.formInput}
              type="radio"
              onChange={() => handleDrivingTypeChange(1)}
              checked={drivingType === 1}
            />
            <p onClick={() => handleDrivingTypeChange(1)}>
              Bằng A2 (Mô tô 2 bánh không giới hạn dung tích xi lanh, trung tâm liên hệ hướng dẫn qua điện thoại)
            </p>
          </div>
          <div className={styles.selectContainer}>
            <input
              className={styles.formInput}
              type="radio"
              onChange={() => handleDrivingTypeChange(2)}
              checked={drivingType === 2}
            />
            <p onClick={() => handleDrivingTypeChange(2)}>
              Bằng B1/B2 (Bằng lái xe ô tô, trung tâm liên hệ hướng dẫn qua điện
              thoại)
            </p>
          </div>
        </div>

        {drivingType === 0 ? (
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Chọn ngày thi<Asterisk/>
            </label>

            {dateList.map((child, index) => {
              return (
                <div className={styles.selectContainer} key={child._id}>
                  <input
                    className={styles.formInput}
                    type="radio"
                    onChange={() => handleDateChange(index)}
                    checked={date === index}
                  />
                  <p onClick={() => handleDateChange(index)}>
                    {child.description || child.date.toLocaleDateString()}
                  </p>
                </div>
              );
            })}
          </div>
        ) : null}

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Hình thức đóng lệ phí<Asterisk/></label>
          <div className={styles.selectContainer}>
            <input
              className={styles.formInput}
              type="radio"
              onChange={() => handlePaymentMethodChange(0)}
              checked={paymentMethod === 0}
            />
            <p onClick={() => handlePaymentMethodChange(0)}>
              Đóng trực tiếp tại nhà khách ĐHQG-HCM
            </p>
          </div>
          <div className={styles.selectContainer}>
            <input
              className={styles.formInput}
              type="radio"
              onChange={() => handlePaymentMethodChange(1)}
              checked={paymentMethod === 1}
            />
            <p onClick={() => handlePaymentMethodChange(1)}>
              Chuyển khoản ngân hàng
            </p>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Thắc mắc/Góp ý</label>
          <textarea className={styles.formFeedbackInput} id="formFeedback" />
        </div>

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

      <AccountModal bankName='Ngân hàng Quân đội (MBBANK)' bankCode='970422' show={accountShow} setShow={setAccountShow} amount={590000} accountNumber='7899996886' accountName='NGUYEN NGOC HUAN' desc={`GPLX ${drivingInfo?.tel || '<Số điện thoại>'} ${drivingDate || '<Ngày dự thi>'}`} />
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
