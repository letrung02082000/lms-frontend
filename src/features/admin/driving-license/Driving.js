import React, { useState } from "react";
import styles from "./driving.module.css";

import mime from "mime-types";

import DrivingApi from "api/drivingApi";
import { formatCurrency } from "utils/commonUtils";
import { Button } from "react-bootstrap";
import FileUploader from "components/form/FileUploader";
import { FILE_UPLOAD_URL } from "constants/endpoints";
import { toastWrapper } from "utils";
import { toast } from 'react-toastify'
import CopyToClipboardButton from "components/button/CopyToClipboardButton";
import { SiZalo } from "react-icons/si";

function Driving(props) {
  let {
    name,
    portraitId,
    frontsideId,
    backsideId,
    paymentMethod,
    isPaid,
    date,
    createdAt,
    zalo,
    tel,
    messageSent,
    drivingType,
    source,
    dup,
    _id,
    cash,
    portraitUrl,
    frontUrl,
    backUrl,
  } = props.info;

  const showImage = props.showImage;
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(messageSent);
  const [feedback, setFeedback] = useState(props.info.feedback || "");
  const [processState, setProcessState] = useState(props.info.processState);
  const [frontUploading, setFrontUploading] = useState(false);
  const [backUploading, setBackUploading] = useState(false);
  const [portraitUploading, setPortraitUploading] = useState(false);
  createdAt = new Date(createdAt);

  if (date) {
    date = new Date(date);
  } else {
    date = null;
  }

  let sourceText = "Không có";

  if (source === 1) {
    sourceText = "Langf";
  } else if (source === 2) {
    sourceText = "UEL";
  } else if (source === 3) {
    sourceText = "Anh Long";
  } else if (source === 4) {
    sourceText = "Thư quán UEL";
  } else if (source === 5) {
    sourceText = "5";
  } else if (source === 7) {
    sourceText = "Thủ Đức";
  }

  const [selectedDate, setSelectedDate] = useState(date);

  const updateDate = () => {
    const tmpDate = new Date(selectedDate);

    DrivingApi.updateDrivingDate(_id, tmpDate)
      .then((res) => {
        if (res.data) {
          toastWrapper("Đã cập nhật ngày thành " + new Date(res?.data?.date).toLocaleDateString(), "success")
        } else {
          toastWrapper("Không thể cập nhật ngày. Id không hợp lệ", 'error')
        }
      })
      .catch((e) => toastWrapper("Không thể cập nhật. Lỗi: " + e, 'error'));
  };

  const updateFeedback = () => {
    DrivingApi.updateDrivingFeedback(_id, feedback)
      .then((res) => {
        toastWrapper("Đã cập nhật ghi chú", "success")
      })
      .catch((e) => toastWrapper("Không thể cập nhật. Lỗi: " + e.toString(), 'error'));
  };

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleTelCopy = () => {
    navigator.clipboard.writeText(tel);
    setCopied(true);
  };

  const updateProcessState = (state) => {
    setLoading(true);
    DrivingApi.updateProcessState(props.id, state)
      .then((res) => {
        setProcessState(res.data.processState);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        alert(error);
      });
  };

  const handleMessageSent = () => {
    DrivingApi.updateMessageSent(props.id, !sent)
      .then((res) => {
        setSent(res.data.messageSent);
        setProcessState(res.data.processState);
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleUpdateButton = (id, data) => {
    DrivingApi.updateDriving(id, data).then(res => {
      toastWrapper('Cập nhật thành công', 'success')
    }).catch(e => {
      toastWrapper('Cập nhật thất bại', 'error')
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.firstRow}>
          {date ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <select
                className={styles.date}
                onChange={handleDateChange}
                defaultValue={selectedDate}
              >
                {props.dateList ? (
                  <>
                    {props.dateList.map((child) => {
                      let tmpDate = new Date(child.date);
                      return (
                        <option value={tmpDate}>
                          {tmpDate.toLocaleDateString("en-GB")}
                        </option>
                      );
                    })}
                  </>
                ) : null}
              </select>
              <button
                className="btn btn-outline-primary mt-2"
                onClick={updateDate}
              >
                Cập nhật
              </button>
            </div>
          ) : null}
          <p className={styles.date}>{createdAt.toLocaleDateString("en-GB")}</p>
          <p className={styles.name}>{name}</p>
          <div>
            <div className="mb-2 d-flex justify-content-between">
              <span><b>Di động:</b> {tel}</span>
              <CopyToClipboardButton value={tel} className='btn btn-outline-primary ms-2' /></div>
            <div className="mb-2 d-flex justify-content-between">
              <span><b>Zalo:</b> {zalo}</span>
              <CopyToClipboardButton value={zalo} className='btn btn-outline-primary ms-2' />
            </div>
          </div>
        </div>
        <div className={styles.thirdRow}>
          {drivingType === 0 ? (
            <p style={{ paddingLeft: "1rem", fontWeight: "bold" }}>
              Loại: Bằng A1
            </p>
          ) : null}
          {drivingType === 1 ? (
            <p
              style={{ color: "red", paddingLeft: "1rem", fontWeight: "bold" }}
            >
              Loại: Bằng A2
            </p>
          ) : null}
          {drivingType === 2 ? (
            <p
              style={{ color: "red", paddingLeft: "1rem", fontWeight: "bold" }}
            >
              Loại: Bằng B2
            </p>
          ) : null}
          <button
            className="btn btn-outline-primary ms-3"
            style={sent ? { background: "#F7B205", color: "white" } : null}
            onClick={handleMessageSent}
          >
            Đã gửi tin nhắn
          </button>
          <p style={{ color: "#F7B205", paddingLeft: "1rem" }}>
            Nguồn: {sourceText}
          </p>
          <p style={{ color: "#F7B205", paddingLeft: "1rem" }}>
            Ghi chú:{" "}
            <>
              <input value={feedback} onChange={handleFeedbackChange} />
              <button
                className="btn btn-outline-primary ms-2"
                onClick={updateFeedback}
              >
                Lưu lại
              </button>
            </>
          </p>
        </div>
        <div className='d-flex justify-content-between mt-5'>
          <div>
            <div className='d-flex align-items-start'>
              <a
                className='btn btn-outline-primary w-100 mb-3'
                href={portraitUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Chân dung
              </a>
            </div>
            <div className="d-flex align-items-start">
              <a
                className='btn btn-outline-primary me-2'
                target="_blank"
                rel="noopener noreferrer"
                href={`https://drive.google.com/file/d/${portraitId}/view`}
              >
                <img
                  src="/driveicon.png"
                  alt="icon"
                  className={styles.driveIcon}
                />
              </a>
              <FileUploader name='file' hasText={false} hasLabel={false} url={FILE_UPLOAD_URL} uploading={portraitUploading} setUploading={setPortraitUploading} onResponse={res => handleUpdateButton(_id, {portraitUrl: res?.data?.url})} />
            </div>
          </div>

          <div>
            <div className='d-flex align-items-start'>
              <a
                className='btn btn-outline-primary w-100 mb-3'
                href={frontUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Mặt trước
              </a>
            </div>
            <div className="d-flex align-items-start">
              <a
                className='btn btn-outline-primary me-2'
                target="_blank"
                rel="noopener noreferrer"
                href={`https://drive.google.com/file/d/${frontsideId}/view`}
              >
                <img
                  src="/driveicon.png"
                  alt="icon"
                  className={styles.driveIcon}
                />
              </a>
              <FileUploader name='file' hasText={false} hasLabel={false} url={FILE_UPLOAD_URL} uploading={frontUploading} setUploading={setFrontUploading} onResponse={res => handleUpdateButton(_id, {frontUrl: res?.data?.url})} />
            </div>
          </div>

          <div>
            <div className='d-flex align-items-start'>
              <a
                className='btn btn-outline-primary w-100 mb-3'
                href={backUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Mặt sau
              </a>
            </div>
            <div className="d-flex align-items-start">
              <a
                className='btn btn-outline-primary me-2'
                target="_blank"
                rel="noopener noreferrer"
                href={`https://drive.google.com/file/d/${backsideId}/view`}
              >
                <img
                  src="/driveicon.png"
                  alt="icon"
                  className={styles.driveIcon}
                />
              </a>
              <FileUploader name='file' hasText={false} hasLabel={false} url={FILE_UPLOAD_URL} uploading={backUploading} setUploading={setBackUploading} onResponse={res => handleUpdateButton(_id, {backUrl: res?.data?.url})} />
            </div>
          </div>

          <div className={styles.buttonContainer}>
          <a
              className='btn btn-outline-primary mb-3'
            >
              Thanh toán
            </a>
            <p className='text-center fw-bold'>{formatCurrency(cash)} VNĐ</p>
          </div>

        </div>
      </div>
      <div className={styles.processState}>
        <p
          onClick={() => updateProcessState(4)}
          className={styles.button}
          style={
            processState === 4
              ? {
                  backgroundColor: "#FF3131",
                  color: "white",
                  borderColor: "#FF3131",
                }
              : null
          }
        >
          Đã hủy
        </p>
        <p
          onClick={() => updateProcessState(0)}
          className={styles.button}
          style={
            processState === 0
              ? { backgroundColor: "var(--primary)", color: "white" }
              : null
          }
        >
          Đã tạo
        </p>
        <p
          onClick={() => updateProcessState(1)}
          className={styles.button}
          style={
            processState === 1
              ? { backgroundColor: "var(--primary)", color: "white" }
              : null
          }
        >
          Chờ cập nhật
        </p>
        <p
          onClick={() => updateProcessState(2)}
          className={styles.button}
          style={
            processState === 2
              ? { backgroundColor: "var(--primary)", color: "white" }
              : null
          }
        >
          Chờ thanh toán
        </p>
        <p
          onClick={() => updateProcessState(3)}
          className={styles.button}
          style={
            processState === 3
              ? {
                  backgroundColor: "#28a745",
                  color: "white",
                  borderColor: "#28a745",
                }
              : null
          }
        >
          Đã hoàn tất
        </p>
        {dup > 1 ? (
          <p style={{ color: "red", textAlign: "center" }}>
            Danh sách này có 1 hồ sơ tương tự
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default Driving;
