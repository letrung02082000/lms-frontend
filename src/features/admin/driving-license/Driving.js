import React, { useEffect, useState } from "react";
import DrivingApi from "api/drivingApi";
import { formatCurrency } from "utils/commonUtils";
import { Button, Col, FormControl, Row } from "react-bootstrap";
import FileUploader from "components/form/FileUploader";
import { FILE_UPLOAD_URL } from "constants/endpoints";
import { toastWrapper } from "utils";
import CopyToClipboardButton from "components/button/CopyToClipboardButton";
import { MdRotateLeft } from "react-icons/md";
import { DRIVING_STATE, DRIVING_STATE_LABEL } from "./constant";

function Driving(props) {
  let {
    name,
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
    healthDate,
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
  const [portraitLoading, setPortraitLoading] = useState(false);
  const [frontLoading, setFrontLoading] = useState(false);
  const [backLoading, setBackLoading] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);
  createdAt = new Date(createdAt);

  useEffect(() => {
    fetchImage();
  }, [imageVisible])

  const fetchImage = async () => {
    if (imageVisible) {
      setFrontLoading(true);
      setBackLoading(true);
      setPortraitLoading(true);

      try {
        const urlCreator = window.URL || window.webkitURL;
        const portraitResponse = await fetch(portraitUrl);
        const portraitBlob = await portraitResponse.blob();
        const portraitImage = urlCreator.createObjectURL(portraitBlob);
        document.getElementById(`portrait_${_id}`).src = portraitImage;
        document.getElementById(`portrait_${_id}`).height = 250;
        document.getElementById(`portrait_${_id}`).style.objectFit = 'contain';
        setPortraitLoading(false);
      } catch (error) {
        setPortraitLoading(false);
      }

      try {
        const urlCreator = window.URL || window.webkitURL;
        const frontResponse = await fetch(frontUrl);
        const frontBlob = await frontResponse.blob();
        const frontImage = urlCreator.createObjectURL(frontBlob);
        document.getElementById(`front_${_id}`).src = frontImage;
        document.getElementById(`front_${_id}`).height = 250;
        document.getElementById(`front_${_id}`).style.objectFit = 'contain';
        setFrontLoading(false);
      } catch (error) {
        setFrontLoading(false);
      }

      try {
        const urlCreator = window.URL || window.webkitURL;
        const backResponse = await fetch(backUrl);
        const backBlob = await backResponse.blob();
        const backImage = urlCreator.createObjectURL(backBlob);
        document.getElementById(`back_${_id}`).src = backImage;
        document.getElementById(`back_${_id}`).height = 250;
        document.getElementById(`back_${_id}`).style.objectFit = 'contain';
        setBackLoading(false);
      } catch (error) {
        setBackLoading(false);
      }

    } else {
      document.getElementById(`front_${_id}`).removeAttribute('src');
      document.getElementById(`back_${_id}`).removeAttribute('src');
      document.getElementById(`portrait_${_id}`).removeAttribute('src');
      document.getElementById(`front_${_id}`).height = 0;
      document.getElementById(`back_${_id}`).height = 0;
      document.getElementById(`portrait_${_id}`).height = 0;
    }
  }

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

    DrivingApi.updateDriving(_id, {
      date: tmpDate,
    })
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

  const updateProcessState = (state) => {
    setLoading(true);
    DrivingApi.updateProcessState(props.id, state)
      .then((res) => {
        console.log(res)
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

  const rotateImage = (id) => {
    const tmp = document.getElementById(id);
    tmp.style.transform = `rotate(${(tmp.getAttribute('data-rotate') || 0) - 90}deg)`;
    tmp.setAttribute('data-rotate', (tmp.getAttribute('data-rotate') || 0) - 90);
  }

  return (
    <div className="border border-primary m-2 p-3 rounded">
      <Row>
        <Col xs={10}>
          <Row className="mb-2">
            <div className="d-flex justify-content-between">
              <div>
                <p className="form-text">{createdAt.toLocaleDateString("en-GB")}</p>
              </div>

              <div>
                <p>{name}</p>
              </div>
              <div>
                <div className="mb-2 d-flex justify-content-between">
                  <span><b>Di động:</b> {tel}</span>
                  <CopyToClipboardButton value={tel} className='btn btn-outline-primary ms-2' /></div>
                <div className="mb-2 d-flex justify-content-between">
                  <span><b>Zalo:</b> {zalo}</span>
                  <CopyToClipboardButton value={zalo} className='btn btn-outline-primary ms-2' />
                </div>
              </div>
              <div>
                <div className="mb-2">
                  <span>CK</span>
                  <span className='text-center fw-bold'> {formatCurrency(cash)} VNĐ</span>
                </div>
                <Button
                  variant={sent ? "warning" : "outline-primary"}
                  className="w-100"
                  onClick={handleMessageSent}
                >
                  Đã gửi tin nhắn
                </Button>
              </div>

            </div>
          </Row>
          <Row>
            <Col xs={6}>
              <Row>
                <p>Ngày thi</p>
              </Row>
              <Row>
                <Col xs={8}>
                  <select
                    className="w-100 form-control"
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
                </Col>
                <Col>
                  <Button
                    className="w-100"
                    variant="outline-primary"
                    onClick={updateDate}
                  >
                    Cập nhật
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col>
              <Row>
                <p>Ghi chú</p>
              </Row>
              <Row>
                <Col xs={8}>
                  <FormControl type="text" value={feedback} onChange={handleFeedbackChange} className="w-100" />
                </Col>
                <Col>
                  <Button
                    variant="outline-primary w-100"
                    onClick={updateFeedback}
                  >
                    Lưu lại
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="my-2">
            <div className="d-flex">
              {drivingType === 0 ? (
                <span className="fw-bold">
                  Bằng A1
                </span>
              ) : null}
              {drivingType === 1 ? (
                <span className="fw-bold"
                >
                  Bằng A2
                </span>
              ) : null}
              {drivingType === 2 ? (
                <span className="fw-bold"
                >
                  Bằng B1/B2/C
                </span>
              ) : null}
            </div>
          </Row>
          <Row>
            {healthDate ? <p className="text-success">Đăng ký khám sức khoẻ ngày: {new Date(healthDate).toLocaleDateString('en-GB')}</p> : <p>Chưa đăng ký khám sức khoẻ</p>}
          </Row>
          {dup > 1 ? (
            <p className="text-danger">
              Danh sách này có 1 hồ sơ tương tự
            </p>
          ) : null}
          <Row>
        <div className='d-flex justify-content-between'>
          <div>
            <div className='d-flex align-items-start'>

              <a
                className='btn btn-outline-primary p-0 mb-2 border-0'
                href={portraitUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {portraitLoading && <div className="spinner-border text-primary" role="status"></div>}
                <img id={`portrait_${_id}`} />
              </a>
            </div>
            <div className="d-flex">
              <FileUploader name='file' hasText={false} hasLabel={false} url={FILE_UPLOAD_URL} uploading={portraitUploading} setUploading={setPortraitUploading} onResponse={res => handleUpdateButton(_id, { portraitUrl: res?.data?.url })} />
              <Button variant="outline-primary" className="ms-2" onClick={() => rotateImage(`portrait_${_id}`)}>
                <MdRotateLeft />
              </Button>
            </div>
          </div>
          <div>
            <div className='d-flex'>
              <a
                className='btn btn-outline-primary p-0 mb-2 border-0'
                href={frontUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {frontLoading && <div className="spinner-border text-primary" role="status"></div>}
                <img id={`front_${_id}`} />
              </a>
            </div>
            <div className="d-flex">
              <FileUploader name='file' hasText={false} hasLabel={false} url={FILE_UPLOAD_URL} uploading={frontUploading} setUploading={setFrontUploading} onResponse={res => handleUpdateButton(_id, { frontUrl: res?.data?.url })} />
              <Button variant="outline-primary" className="ms-2" onClick={() => rotateImage(`front_${_id}`)}>
                <MdRotateLeft />
              </Button>
            </div>
          </div>

          <div>
            <div className='d-flex'>
              <a
                className='btn btn-outline-primary p-0 mb-2 border-0'
                href={backUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {backLoading && <div className="spinner-border text-primary" role="status"></div>}
                <img id={`back_${_id}`} />
              </a>
            </div>
            <div className="d-flex">
              <FileUploader name='file' hasText={false} hasLabel={false} url={FILE_UPLOAD_URL} uploading={backUploading} setUploading={setBackUploading} onResponse={res => handleUpdateButton(_id, { backUrl: res?.data?.url })} />
              <Button variant="outline-primary" className="ms-2" onClick={() => rotateImage(`back_${_id}`)}>
                <MdRotateLeft />
              </Button>
            </div>
          </div>
        </div>
      </Row>
        </Col>
        <Col>
          <Row>
            <div className="d-flex flex-column">
              {Object.keys(DRIVING_STATE).map((key) => {
                if (DRIVING_STATE[key] === DRIVING_STATE.CANCELED) return (
                  <Button
                    className="mb-2"
                    onClick={() => updateProcessState(DRIVING_STATE[key])}
                    variant={processState === DRIVING_STATE[key] ? "danger" : "outline-danger"}
                    key={key}
                  >
                    {DRIVING_STATE_LABEL[DRIVING_STATE[key]]}
                  </Button>
                )

                if (DRIVING_STATE[key] === DRIVING_STATE.FINISHED) return (
                  <Button
                    className="mb-2"
                    onClick={() => updateProcessState(DRIVING_STATE[key])}
                    variant={processState === DRIVING_STATE[key] ? "success" : "outline-success"}
                    key={key}
                  >
                    {DRIVING_STATE_LABEL[DRIVING_STATE[key]]}
                  </Button>
                )

                return (
                  <Button
                    className="mb-2"
                    onClick={() => updateProcessState(DRIVING_STATE[key])}
                    variant={processState === DRIVING_STATE[key] ? "primary" : "outline-primary"}
                    key={key}
                  >
                    {DRIVING_STATE_LABEL[DRIVING_STATE[key]]}
                  </Button>
                );
              })}
            </div>
          </Row>
        </Col>
      </Row>
      

      <Button variant="outline-primary" className="mt-2" onClick={() => setImageVisible(!imageVisible)}>Ẩn/Hiện</Button>
    </div>
  );
}

export default Driving;
