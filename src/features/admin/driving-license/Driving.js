import React, { useEffect, useState } from "react";
import DrivingApi from "api/drivingApi";
import { formatCurrency } from "utils/commonUtils";
import { Button, Col, Form, FormControl, Image, Modal, Row } from "react-bootstrap";
import FileUploader from "components/form/FileUploader";
import { FILE_UPLOAD_URL } from "constants/endpoints";
import { toastWrapper } from "utils";
import CopyToClipboardButton from "components/button/CopyToClipboardButton";
import { MdMoreVert, MdPhone, MdRotateLeft } from "react-icons/md";
import { DRIVING_STATE, DRIVING_STATE_LABEL, DRIVING_TYPE_LABEL } from "./constant";
import * as faceapi from '@vladmandic/face-api';
import { Jimp } from 'jimp';
import moment from 'moment'
import { FaQrcode } from "react-icons/fa";
import QRCode from "react-qr-code";
import ZaloImage from "assets/images/ZaloImage";
import { IoIosCloseCircle } from "react-icons/io";
import { IoClose } from "react-icons/io5";

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
  const [isPaid, setIsPaid] = useState(props?.info?.isPaid || false);
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
  const [showQrCode, setShowQrCode] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [portraitClip, setPortraitClip] = useState(null);
  const [portraitCrop, setPortraitCrop] = useState(null);
  const [portrait, setPortrait] = useState(null);
  const [front, setFront] = useState(null);
  const [back, setBack] = useState(null);
  const [invalidPortrait, setInvalidPortrait] = useState(props?.info?.invalidPortrait || false);
  const [invalidCard, setInvalidCard] = useState(props?.info?.invalidCard || false);
  createdAt = new Date(createdAt);
  const [isValidDob, setIsValidDob] = useState(true);
  const [qrData, setQrData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(date);
  const [dateInfo, setDateInfo] = useState(null);
  const [showDateInfo, setShowDateInfo] = useState(false);

  useEffect(() => {
    const dob = moment(identityInfo[1]?.info?.dob, 'DD/MM/YYYY').toDate();
    const today = new Date();

    if (identityInfo?.length > 0) {
      if (today.getFullYear() - dob.getFullYear() === 18) {
        if (today.getMonth() - dob.getMonth() > 0) {
          setIsValidDob(true);
        }

        if (today.getMonth() - dob.getMonth() === 0) {
          if (today.getDate() - dob.getDate() >= 0) {
            setIsValidDob(true);
          } else {
            setIsValidDob(false);
          }
        }

        if (today.getMonth() - dob.getMonth() < 0) {
          setIsValidDob(false);
        }
      } else if (today.getFullYear() - dob.getFullYear() < 18) {
        setIsValidDob(false);
      } else {
        setIsValidDob(true);
      }
    }
  }, [identityInfo]);

  useEffect(() => {
    if (imageVisible) {
      fetchImage();
      const loadModels = async () => {
        const MODEL_URL = '/models';

        Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        ]).then(setModelsLoaded(true)).catch(e => console.log(e));
      }
      loadModels();
    }
  }, [imageVisible]);

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
    if (!modelsLoaded) return toastWrapper('Đang tải mô hình, vui lòng thử lại sau', 'info');

    if (!portraitClip) return toastWrapper('Chưa tách nền ảnh', 'error');

    setCropping(true);
    const input = document.getElementById(`portrait_clip_${_id}`)
    const options = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.1, maxResults: 10 }); // set model options
    const result = await faceapi.detectSingleFace(input, options);
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
    if (processState === DRIVING_STATE.CANCELED)
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

  const handlePaidButton = () => {
    DrivingApi.updateDriving(_id, {
      isPaid: !isPaid
    }).then(res => {
      setIsPaid(res?.data?.isPaid);
    }).catch(e => {
      console.log(e);
      alert(e);
    });
  }

  const handleInvalidCard = () => {
    DrivingApi.updateDriving(_id, {
      invalidCard: !invalidCard
    })
      .then((res) => {
        setInvalidCard(res.data.invalidCard);
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  const handleInvalidPortrait = () => {
    DrivingApi.updateDriving(_id, {
      invalidPortrait: !invalidPortrait
    })
      .then((res) => {
        setInvalidPortrait(res.data.invalidPortrait);
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleDateInfoButton = () => {
    const dateInfo = props?.dateList?.find(d => new Date(d.date).toISOString() === new Date(selectedDate).toISOString());
    setDateInfo(dateInfo);
    setShowDateInfo(true);
  }

  const handleUpdateButton = (id, data, type) => {
    DrivingApi.updateDriving(id, data).then(res => {
      if(type === 'portrait') {
        fetchPortrait(res?.data?.portraitUrl);
      } else if(type === 'front') {
        fetchFront(res?.data?.frontUrl);
      } else if(type === 'back') {
        fetchBack(res?.data?.backUrl);
      }

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
            <Col xs={1}>
              <span className="form-text">{createdAt.toLocaleDateString("en-GB")}</span>
            </Col>
            <Col xs={2}>
              <p>{name}</p>
              {!isValidDob && <p className='text-danger fw-bold text-center'>Chưa đủ tuổi</p>}
            </Col>
            <Col xs={3}>
              <div className="d-flex align-items-center mb-3">
                <div><MdPhone size={25} className='text-primary' /></div>
                <span className="ms-3">{tel}</span>
                <Button variant="outline-primary" className="ms-3" onClick={() => {
                  setShowQrCode(true);
                  setQrData({
                    label: 'Mã QR số điện thoại',
                    value: `tel:${tel}`
                  });
                }}><FaQrcode /></Button>
                <CopyToClipboardButton value={tel} className='btn btn-outline-primary ms-3' />
              </div>
              <div className="d-flex align-items-center mb-3">
                <div><ZaloImage /></div>
                <span className='ms-3'>{zalo}</span>
                <Button variant="outline-primary" className="ms-3" onClick={() => {
                  setShowQrCode(true);
                  setQrData({
                    label: 'Mã QR Zalo',
                    value: `https://zalo.me/${zalo}`
                  });
                }}><FaQrcode /></Button>
                <CopyToClipboardButton value={zalo} className='btn btn-outline-primary ms-3' />
              </div>
            </Col>
            <Col xs={2} className="text-center">
              <p className="mb-2">
                Hạng thi
              </p>
              <p className="fw-bold">{DRIVING_TYPE_LABEL[drivingType]}</p>
            </Col>
            <Col xs={1} className="text-center">
              <p className="mb-2">
                {sent ? 'Đã' : 'Chưa'} vào nhóm
              </p>
              <Form.Check
                className="w-100 mb-2"
                type="switch"
                checked={sent}
                onClick={handleMessageSent} />
            </Col>
            <Col xs={2} className="text-center">
              <p className="mb-2">
                Chuyển khoản
              </p>
              <p className="fw-bold">{formatCurrency(cash)} VNĐ</p>
            </Col>
            <Col xs={1} className="text-center">
              <p className="mb-2">
                {isPaid ? 'Đã' : 'Chưa'} thanh toán
              </p>
              <Form.Check
                className="w-100"
                type="switch"
                checked={isPaid}
                onClick={handlePaidButton} />
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <p>Ngày thi</p>
              <Row>
                <Col xs={7}>
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
                <Col xs={3}>
                  <Button
                    className="w-100"
                    variant="outline-primary"
                    onClick={updateDate}
                  >
                    Lưu lại
                  </Button>
                </Col>
                <Col xs={2}>
                  <Button variant='outline-primary' onClick={handleDateInfoButton}>
                    <MdMoreVert />
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col>
              <p>Ghi chú</p>
              <Row>
                <Col>
                  <FormControl type="text" value={feedback} onChange={handleFeedbackChange} className="w-100" />
                </Col>
                <Col xs={2}>
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
          <div className="mt-3 d-flex justify-content-between">
            <div>
              {healthDate ? <p className="text-success">Đăng ký khám sức khoẻ ngày {new Date(healthDate).toLocaleDateString('en-GB')}</p> : <p>Chưa đăng ký khám sức khoẻ</p>}
              {identityInfo?.length > 0 && <p className="text-success">Đã trích xuất thông tin</p>}
            </div>
            <div>
              {invalidCard && <p className="text-danger">CCCD không hợp lệ</p>}
              {invalidPortrait && <p className="text-danger">Chân dung không hợp lệ</p>}
              {dup > 1 ? (
                <p className="text-danger">
                  Danh sách này có 1 hồ sơ tương tự
                </p>
              ) : null}
            </div>
          </div>
          {imageVisible && <>
            <Row>
              <Col xs={4}>
                <div className='d-flex justify-content-center mb-2'>
                  <a
                    href={portrait}
                    rel="noopener noreferrer"
                    download={`${name}-${tel}-portrait.jpg`}
                  >
                    {portraitLoading && <div className="spinner-border text-primary" role="status"></div>}
                    <img id={`portrait_${_id}`} width='100%'/>
                  </a>
                  {portraitClip && <a
                    href={portraitClip}
                    rel="noopener noreferrer"
                    download={`${name}-${tel}-clipped.jpg`}
                  >
                    {portraitLoading && <div className="spinner-border text-primary" role="status"></div>}
                    <img id={`portrait_clip_${_id}`} width='100%'/>
                  </a>}
                  {portraitCrop && <a href={portraitCrop} download={`${name}-${tel}-cropped.jpg`}>
                    <img className="ms-2" id={`portrait_crop_${_id}`} src={portraitCrop} height={portraitCrop && imageVisible ? 250 : 0} width='100%'/>
                  </a>}
                </div>
                <div className="d-flex justify-content-center">
                  <Button variant="outline-primary" onClick={() => rotateImage(`portrait_${_id}`)}>
                    <MdRotateLeft />
                  </Button>
                  <FileUploader className='ms-2' name='file' hasText={false} hasLabel={false} url={FILE_UPLOAD_URL} uploading={portraitUploading} setUploading={setPortraitUploading} onResponse={res => handleUpdateButton(_id, { portraitUrl: res?.data?.url }, 'portrait')} />
                  <div>
                    {
                      imageVisible && processState === DRIVING_STATE.APPROVED ? <>
                        <Button className="ms-2" disabled={clipping} variant='outline-primary' onClick={() => clipPortrait()}>{clipping ? 'Đang tách' : 'Tách nền'}</Button>
                        <Button className="ms-2" variant='outline-primary' onClick={() => cropPortrait()}>{cropping ? 'Đang cắt' : 'Cắt ảnh'}</Button>
                      </> : <Button className="ms-2" variant={invalidPortrait ? 'danger' : 'outline-primary'} onClick={handleInvalidPortrait}>
                        <IoClose />
                      </Button>
                    }
                  </div>
                </div>
              </Col>
              <Col xs={4}>
                <div className='d-flex justify-content-center mb-2'>
                  <a
                    href={front}
                    rel="noopener noreferrer"
                    download={`${name}-${tel}-front.jpg`}
                  >
                    {frontLoading && <div className="spinner-border text-primary" role="status"></div>}
                    <img id={`front_${_id}`} width='100%'/>
                  </a>
                </div>
                <div className="d-flex justify-content-center">
                  <Button variant="outline-primary" onClick={() => rotateImage(`front_${_id}`)}>
                    <MdRotateLeft />
                  </Button>
                  <FileUploader className='ms-2' name='file' hasText={false} hasLabel={false} url={FILE_UPLOAD_URL} uploading={frontUploading} setUploading={setFrontUploading} onResponse={res => handleUpdateButton(_id, { frontUrl: res?.data?.url }, 'front')} />
                  {
                    processState === DRIVING_STATE.APPROVED ? <>
                      {identityInfo?.length ? <Button className="ms-2" variant="outline-primary" onClick={() => setShowIdentityInfo(true)}>Xem thông tin trích xuất</Button> : <Button className="ms-2" disabled={extracting} variant="outline-primary" onClick={() => extractIdentity()}>{extracting ? 'Đang đọc' : 'Đọc CCCD'}</Button>}
                    </> : <>
                      <Button className="ms-2" variant={invalidCard ? 'danger' : 'outline-primary'} onClick={handleInvalidCard}>
                        <IoClose />
                      </Button>
                    </>
                  }
                </div>
              </Col>
              <Col xs={4}>
                <div className="d-flex justify-content-center mb-2">
                  <a
                    href={back}
                    rel="noopener noreferrer"
                    download={`${name}-${tel}-back.jpg`}
                  >
                    {backLoading && <div className="spinner-border text-primary" role="status"></div>}
                    <img id={`back_${_id}`} width='100%'/>
                  </a>
                </div>
                <div className="d-flex justify-content-center">
                  <Button variant="outline-primary" onClick={() => rotateImage(`back_${_id}`)}>
                    <MdRotateLeft />
                  </Button>
                  <FileUploader className='ms-2' name='file' hasText={false} hasLabel={false} url={FILE_UPLOAD_URL} uploading={backUploading} setUploading={setBackUploading} onResponse={res => handleUpdateButton(_id, { backUrl: res?.data?.url }, 'back')} />
                  {processState !== DRIVING_STATE.APPROVED && <Button className="ms-2" variant={invalidCard ? 'danger' : 'outline-primary'} onClick={handleInvalidCard}>
                    <IoClose />
                  </Button>}
                </div>
              </Col>
            </Row>
          </>}
          <div className="d-flex justify-content-end align-items-center mt-2">
            <Button variant="outline-primary" onClick={() => setImageVisible(!imageVisible)}>{imageVisible ? 'Ẩn đi' : 'Xem ảnh'}</Button>
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
              <p>Họ tên:<br /><b>{identityInfo[1]?.info?.name}</b></p>
              <p>Ngày sinh: <b>{identityInfo[1]?.info?.dob}</b></p>
              <p>Số CCCD: <b>{identityInfo[1]?.info?.id}</b></p>
              <p>Địa chỉ:<br /><b>{identityInfo[1]?.info?.address}</b></p>
              <p>Giới tính: <b>{identityInfo[1]?.info?.gender}</b></p>
            </div>}
              {identityInfo[0]?.type === IDENTITY_CARD_TYPE.CHIP_ID_CARD_BACK && <div>
                <p>Ngày cấp: <b>{identityInfo[0]?.info?.issue_date}</b></p>
                <p>Nơi cấp:<br /><b>{identityInfo[0]?.info?.issued_at}</b></p>
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
      <Modal show={showQrCode} onHide={() => setShowQrCode(false)} scrollable backdrop="static" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{qrData?.label}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <QRCode value={qrData?.value} />
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowQrCode(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showDateInfo} onHide={() => setShowDateInfo(false)} scrollable backdrop="static" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Thông tin ngày thi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <p>Ngày hệ thống: <b>{new Date(dateInfo?.date)?.toLocaleDateString('en-GB')}</b></p>
              <p>Mô tả: <b>{dateInfo?.description}</b></p>
              <p>Link nhóm: <a target="_blank" rel='noreferrer noopener' href={dateInfo?.link || ''}>{dateInfo?.link || ''}</a><CopyToClipboardButton className='ms-3 btn btn-outline-primary' value={dateInfo?.link || ''} /></p>
            </Col>
            <Col xs={3}>
              {dateInfo?.link && <QRCode value={dateInfo?.link} size={100} />}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDateInfo(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Driving;
