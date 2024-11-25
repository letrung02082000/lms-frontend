import React, { useEffect, useState } from "react";
import DrivingApi from "api/drivingApi";
import { blobToBase64, formatCurrency } from "utils/commonUtils";
import { Button, Col, FormControl, Image, Modal, Row } from "react-bootstrap";
import FileUploader from "components/form/FileUploader";
import { FILE_UPLOAD_URL } from "constants/endpoints";
import { toastWrapper } from "utils";
import CopyToClipboardButton from "components/button/CopyToClipboardButton";
import { MdRotateLeft } from "react-icons/md";
import { DRIVING_STATE, DRIVING_STATE_LABEL } from "./constant";
import * as canvas from 'canvas';
import * as faceapi from '@vladmandic/face-api';
import { Jimp } from 'jimp';

function Driving(props) {
  faceapi.env.monkeyPatch({
    Canvas: HTMLCanvasElement,
    Image: HTMLImageElement,
    ImageData: ImageData,
    Video: HTMLVideoElement,
    createCanvasElement: () => document.createElement('canvas'),
    createImageElement: () => document.createElement('img')
  })
  
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
  const IDENTITY_CARD_TYPE = {
    CHIP_ID_CARD_FRONT: 'chip_id_card_front',
    CHIP_ID_CARD_BACK: 'chip_id_card_back',
  }
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(messageSent);
  const [feedback, setFeedback] = useState(props.info.feedback || "");
  const [processState, setProcessState] = useState(props.info.processState);
  const [frontUploading, setFrontUploading] = useState(false);
  const [backUploading, setBackUploading] = useState(false);
  const [portraitUploading, setPortraitUploading] = useState(false);
  const [portraitLoading, setPortraitLoading] = useState(false);
  const [portraitClipLoading, setPortraitClipLoading] = useState(false);
  const [frontLoading, setFrontLoading] = useState(false);
  const [backLoading, setBackLoading] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);
  const [portraitClipUrl, setPortraitClipUrl] = useState(props?.info?.portraitClipUrl);
  const [clipping, setClipping] = useState(false);
  const [cropping, setCropping] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [identityInfo, setIdentityInfo] = useState(JSON.parse(props?.info?.identityInfo || '[]'));
  const [showIdentityInfo, setShowIdentityInfo] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [portraitClip, setPortraitClip] = useState(null);
  const [portraitCrop, setPortraitCrop] = useState(null);
  const [portrait, setPortrait] = useState(null);
  const [front, setFront] = useState(null);
  const [back, setBack] = useState(null);
  createdAt = new Date(createdAt);

  useEffect(() => {
    if(imageVisible) {
      fetchImage();
      const loadModels = async () => {
        const MODEL_URL =  '/models';
  
        Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        ]).then(setModelsLoaded(true)).catch(e => console.log(e));
      }
      loadModels();
    }
  }, [imageVisible])

  const fetchPortraitClip = async (portraitClipUrl) => {
    try {
      const urlCreator = window.URL || window.webkitURL;
      const portraitClipResponse = await fetch(portraitClipUrl);
      const portraitClipBlob = await portraitClipResponse.blob();
      const portraitClipImage = urlCreator.createObjectURL(portraitClipBlob);
      document.getElementById(`portrait_clip_${_id}`).src = portraitClipImage;
      document.getElementById(`portrait_clip_${_id}`).height = 250;
      document.getElementById(`portrait_clip_${_id}`).style.objectFit = 'contain';
      setPortraitClip(portraitClipImage);
      setPortraitClipLoading(false);
    } catch (error) {
      setPortraitClipLoading(false);
    }
  }

  const fetchPortrait = async (portraitUrl) => {
    try {
      const urlCreator = window.URL || window.webkitURL;
      const portraitResponse = await fetch(portraitUrl);
      const portraitBlob = await portraitResponse.blob();
      const portraitImage = urlCreator.createObjectURL(portraitBlob);
      document.getElementById(`portrait_${_id}`).src = portraitImage;
      document.getElementById(`portrait_${_id}`).height = 250;
      document.getElementById(`portrait_${_id}`).style.objectFit = 'contain';
      setPortrait(portraitImage);
      setPortraitLoading(false);
    } catch (error) {
      setPortraitLoading(false);
    }
  }

  const fetchFront = async (frontUrl) => {
    try {
      const urlCreator = window.URL || window.webkitURL;
      const frontResponse = await fetch(frontUrl);
      const frontBlob = await frontResponse.blob();
      const frontImage = urlCreator.createObjectURL(frontBlob);
      document.getElementById(`front_${_id}`).src = frontImage;
      document.getElementById(`front_${_id}`).height = 250;
      document.getElementById(`front_${_id}`).style.objectFit = 'contain';
      setFrontLoading(false);
      setFront(frontImage);
    } catch (error) {
      setFrontLoading(false);
    }
  }

  const fetchBack = async (backUrl) => {
    try {
      const urlCreator = window.URL || window.webkitURL;
      const backResponse = await fetch(backUrl);
      const backBlob = await backResponse.blob();
      const backImage = urlCreator.createObjectURL(backBlob);
      document.getElementById(`back_${_id}`).src = backImage;
      document.getElementById(`back_${_id}`).height = 250;
      document.getElementById(`back_${_id}`).style.objectFit = 'contain';
      setBack(backImage);
      setBackLoading(false);
    } catch (error) {
      setBackLoading(false);
    }
  }

  const cropPortrait = async () => {
    if(!modelsLoaded) return toastWrapper('Đang tải mô hình, vui lòng thử lại sau', 'info');

    if(!portraitClip) return toastWrapper('Chưa tách nền ảnh', 'error');

    setCropping(true);
    const input = document.getElementById(`portrait_clip_${_id}`)
    const options = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.1, maxResults: 10 }); // set model options
    const result = await faceapi.detectSingleFace(input, options);
    console.log(result)
    const x = result.box.x - (result.box._width * 0.75);
    const y = result.box.y - (result.box._height * 0.8);
    const width = result.box.width * 2.5;
    const height = width * 4 / 3;
    const img = await Jimp.read(portraitClip);
    const portraitCrop = await img.crop({ x, y, w: width, h: height }).getBase64('image/jpeg');
    setPortraitCrop(portraitCrop);
    setCropping(false);
  }

  const fetchImage = async () => {
    if (imageVisible) {
      setFrontLoading(true);
      setBackLoading(true);
      setPortraitLoading(true);
      fetchPortrait(portraitUrl);
      fetchFront(frontUrl);
      fetchBack(backUrl);

      if (portraitClipUrl) {
        fetchPortraitClip(portraitClipUrl);
      }
    } else {
      document.getElementById(`front_${_id}`).removeAttribute('src');
      document.getElementById(`back_${_id}`).removeAttribute('src');
      document.getElementById(`portrait_${_id}`).removeAttribute('src');
      document.getElementById(`portrait_clip_${_id}`).removeAttribute('src');
      document.getElementById(`front_${_id}`).height = 0;
      document.getElementById(`back_${_id}`).height = 0;
      document.getElementById(`portrait_${_id}`).height = 0;
      document.getElementById(`portrait_clip_${_id}`).height = 0;
    }
  }

  if (date) {
    date = new Date(date);
  } else {
    date = null;
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
    if(processState === DRIVING_STATE.CANCELED)
      return toastWrapper('Không thể cập nhật hồ sơ đã bị huỷ', 'error');
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

  const rotateImage = (id) => {
    const tmp = document.getElementById(id);
    tmp.style.transform = `rotate(${(tmp.getAttribute('data-rotate') || 0) - 90}deg)`;
    tmp.setAttribute('data-rotate', (tmp.getAttribute('data-rotate') || 0) - 90);
  }

  const clipPortrait = () => {
    setClipping(true);
    setImageVisible(true);
    DrivingApi.clipPortrait(_id).then(res => {
      setPortraitClipUrl(res?.data?.url);
      fetchPortraitClip(res?.data?.url);
      toastWrapper('Tách nền ảnh thành công', 'success')
    }).catch(e => {
      toastWrapper(e.toString(), 'error')
    }).finally(() => {
      setClipping(false);
    });
  }

  const extractIdentity = async () => {
    setExtracting(true);
    DrivingApi.extractIdentity(_id).then(res => {
      setIdentityInfo(res?.data);
      toastWrapper('Đọc CCCD thành công', 'success')
    }).catch(e => {
      toastWrapper(e.toString(), 'error')
    }).finally(() => {
      setExtracting(false);
    });
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
            {healthDate ? <p className="text-success">Đăng ký lịch thi/khám sức khoẻ ngày {new Date(healthDate).toLocaleDateString('en-GB')}</p> : <p className="">Chưa đăng ký khám sức khoẻ</p>}
          </Row>
          {dup > 1 ? (
            <p className="text-danger">
              Danh sách này có 1 hồ sơ tương tự
            </p>
          ) : null}
          {imageVisible && <Row>
            <div className='d-flex justify-content-between'>
              <div>
                <div className='d-flex align-items-start'>

                  <a
                    className='btn btn-outline-primary p-0 mb-2 border-0'
                    href={portrait}
                    rel="noopener noreferrer"
                    download={`${name}-${tel}_portrait.jpg`}
                  >
                    {portraitLoading && <div className="spinner-border text-primary" role="status"></div>}
                    <img id={`portrait_${_id}`} />
                  </a>
                  <a
                    className='btn btn-outline-primary p-0 mb-2 ms-2 border-0'
                    href={portraitClip}
                    rel="noopener noreferrer"
                    download={`${name}-${tel}_clipped.jpg`}
                  >
                    {portraitLoading && <div className="spinner-border text-primary" role="status"></div>}
                    <img id={`portrait_clip_${_id}`} />
                  </a>
                  <a href={portraitCrop} download={`${name}-${tel}_cropped.jpg`}>
                    <img className="ms-2" id={`portrait_crop_${_id}`} src={portraitCrop} height={portraitCrop && imageVisible ? 250 : 0} />
                  </a>
                </div>
                <div className="d-flex">
                  <FileUploader name='file' hasText={false} hasLabel={false} url={FILE_UPLOAD_URL} uploading={portraitUploading} setUploading={setPortraitUploading} onResponse={res => handleUpdateButton(_id, { portraitUrl: res?.data?.url })} />
                  <Button variant="outline-primary" className="ms-2" onClick={() => rotateImage(`portrait_${_id}`)}>
                    <MdRotateLeft />
                  </Button>
                  <div className="d-flex justify-content-start">
                    {
                      imageVisible && processState === DRIVING_STATE.APPROVED && <>
                        <Button className="ms-2" disabled={clipping} variant='outline-primary' onClick={() => clipPortrait()}>{clipping ? 'Đang tách...' : 'Tách nền'}</Button>
                        <Button className="ms-2" variant='outline-primary' onClick={() => cropPortrait()}>{cropping ? 'Đang cắt' : 'Cắt ảnh'}</Button>
                      </>
                    }
                  </div>
                </div>
              </div>
              <div>
                <div className='d-flex'>
                  <a
                    className='btn btn-outline-primary p-0 mb-2 border-0'
                    href={front}
                    rel="noopener noreferrer"
                    download={`${name}-${tel}_front.jpg`}
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
                  {
                    processState === DRIVING_STATE.APPROVED ? <>
                      {identityInfo?.length ? <Button className="ms-2" variant="outline-primary" onClick={() => setShowIdentityInfo(true)}>Xem thông tin trích xuất</Button> : <Button className="ms-2" disabled={extracting} variant="outline-primary" onClick={() => extractIdentity()}>{extracting ? 'Đang đọc CCCD...' : 'Đọc CCCD'}</Button>}
                    </> : <>
                      {identityInfo?.length > 0 && <Button className="ms-2" variant="outline-primary" onClick={() => setShowIdentityInfo(true)}>Xem thông tin trích xuất</Button>}
                    </>
                  }
                </div>
              </div>

              <div>
                <div className='d-flex'>
                  <a
                    className='btn btn-outline-primary p-0 mb-2 border-0'
                    href={back}
                    rel="noopener noreferrer"
                    download={`${name}-${tel}_back.jpg`}
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
          </Row>}
          <div className="d-flex justify-content-end mt-2">
              <Button variant="outline-primary" onClick={() => setImageVisible(!imageVisible)}>Ẩn/Hiện</Button>
          </div>
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
      {showIdentityInfo && <Modal show={showIdentityInfo} onHide={() => setShowIdentityInfo(false)} scrollable backdrop="static" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Thông tin trích xuất</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col xs={6}>{identityInfo[1]?.type === IDENTITY_CARD_TYPE.CHIP_ID_CARD_FRONT && <div>
              <p>Họ tên:<br/><b>{identityInfo[1]?.info?.name}</b></p>
              <p>Ngày sinh: <b>{identityInfo[1]?.info?.dob}</b></p>
              <p>Số CCCD: <b>{identityInfo[1]?.info?.id}</b></p>
              <p>Địa chỉ:<br/><b>{identityInfo[1]?.info?.address}</b></p>
              <p>Giới tính: <b>{identityInfo[1]?.info?.gender}</b></p>
            </div>}
              {identityInfo[0]?.type === IDENTITY_CARD_TYPE.CHIP_ID_CARD_BACK && <div>
                <p>Ngày cấp: <b>{identityInfo[0]?.info?.issue_date}</b></p>
                <p>Nơi cấp:<br/><b>{identityInfo[0]?.info?.issued_at}</b></p>
                <p>Ngày hết hạn: <b>{identityInfo[0]?.info?.due_date}</b></p>
              </div>}</Col>
            <Col xs={6}>
              <Image className="mb-2" width='100%' src={`data:image/jpeg;base64,${identityInfo[1]?.info?.image}`} />
              <Image width='100%' src={`data:image/jpeg;base64,${identityInfo[0]?.info?.image}`} />
            </Col>
          </Row>


        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowIdentityInfo(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>}
    </div>
  );
}

export default Driving;
