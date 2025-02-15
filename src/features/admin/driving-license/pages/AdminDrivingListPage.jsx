import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Driving from "../Driving";
import { updateDrivingData } from "store/drivingAdminSlice";
import { useDispatch } from "react-redux";
import Select from 'react-select'
import DrivingApi from "api/drivingApi";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { DOWNLOAD_FILE_FIELDS, DOWNLOAD_FILE_FIELDS_LABEL, ACTION_OPTIONS, ACTION_OPTIONS_LABEL, DRIVING_STATE, DRIVING_STATE_LABEL, DRIVING_TYPE_LABEL, EXPORT_EXAM_EXCEL_FIELDS_TEMPLATE, EXPORT_EXCEL_FIELDS, EXPORT_EXCEL_FIELDS_LABEL, EXPORT_EXCEL_OPTIONS, EXPORT_EXCEL_OPTIONS_LABEL, EXPORT_INPUT_EXCEL_FIELDS_TEMPLATE, IDENTITY_CARD_TYPE, PAYMENT_METHODS, UPLOAD_FILE_OPTIONS, UPLOAD_FILE_OPTIONS_LABEL } from "../constant";
import { MdDelete, MdDownload } from "react-icons/md";
import ocrApi from "api/ocrApi";
import { Document, Page, View, Image as PDFImage, Svg, Path, StyleSheet, pdf } from "@react-pdf/renderer";
import QRCode from "react-qr-code";
import ReactDOMServer from 'react-dom/server';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import _ from "lodash";
import fileApi from "api/fileApi";
import { useSearchParams } from "react-router-dom";
import FileUploader from "components/form/FileUploader";
import { FILE_UPLOAD_URL } from "constants/endpoints";
import { IoMdEye } from "react-icons/io";
import { toastWrapper } from "utils";

function AdminDrivingListPage() {
  const { center, role : userRole } = JSON.parse(localStorage.getItem('user-info'));
  const [searchParams, setSearchParams] = useSearchParams();
  const [drivingType, setDrivingType] = useState(searchParams.get('type') || 0);
  const [drivingTypes, setDrivingTypes] = useState([]);
  const [loadingAction, setLoadingAction] = useState(0);
  const [exportExcelFields, setExportExcelFields] = useState(EXPORT_EXAM_EXCEL_FIELDS_TEMPLATE);
  const [downloadFileFields, setDownloadFileFields] = useState({
    [DOWNLOAD_FILE_FIELDS.CARD]: false,
    [DOWNLOAD_FILE_FIELDS.PORTRAIT]: true,
    [DOWNLOAD_FILE_FIELDS.PORTRAIT_CROP]: false,
  });
  const [exportExcelOption, setExportExcelOption] = useState({
    value: EXPORT_EXCEL_OPTIONS.EXPORT_EXAM_EXCEL,
    label: EXPORT_EXCEL_OPTIONS_LABEL[EXPORT_EXCEL_OPTIONS.EXPORT_EXAM_EXCEL],
  });
  const [uploadFileOption, setUploadFileOption] = useState({
    value: UPLOAD_FILE_OPTIONS.ALL,
    label: UPLOAD_FILE_OPTIONS_LABEL[UPLOAD_FILE_OPTIONS.ALL],
  });
  const uploadFileOptionRef = useRef(uploadFileOption);

  useEffect(() => {
    uploadFileOptionRef.current = uploadFileOption;
  }, [uploadFileOption]);

  const styles = StyleSheet.create({
    imagePage: {
      flexDirection: 'column',
      marginVertical: 15,
      marginHorizontal: 5,
    },
    qrPage: {
      flexDirection: 'column',
      marginVertical: 15,
      marginHorizontal: 10,
    },
    imageGroupSection: {
      height: '19%',
      flexDirection: 'row',
      margin: 15,
    },
    image: {
      width: '100%',
      height: '100%',
      flexGrow: 1,
      paddingHorizontal: 15,
    },
    qrSection: {
      margin: 15,
      paddingBottom: 15,
      height: '19%',
      justifyContent: 'flex-end',
    },
  });
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [dates, setDates] = useState([]);
  const [dateSelected, setDateSelected] = useState(null);
  const [state, setState] = useState(DRIVING_STATE.CREATED);
  const [showActionModal, setShowActionModal] = useState(false);
  const [action, setAction] = useState(ACTION_OPTIONS.EXPORT_EXCEL);
  const [uploading, setUploading] = useState(false);
  const [preventActionButton, setPreventActionButton] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const checkDuplicate = (data) => {
    const newData = data.map((child) => {
      let dup = 0;

      for (let element of data) {
        if (element.tel == child.tel) {
          ++dup;
        }
      }

      child.dup = dup;

      return child;
    });
    return newData;
  };

  useEffect(() => {
    DrivingApi
      .queryDrivingType()
      .then((res) => {
        const drivingTypes = res.data.map((drivingType) => {
          return {
            label: drivingType.label,
            value: drivingType._id,
          }
        });
        setDrivingTypes(drivingTypes);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [])
  
  const DRIVING_TYPES_LABEL = useMemo(() => {
    return drivingTypes.reduce((acc, cur) => {
      acc[cur.value] = cur.label;
      return acc;
    }, {});
  }, [drivingTypes]);

  useEffect(() => {
    dispatch(updateDrivingData(data));
  }, [data]);

  useEffect(() => {
    const drivingType = searchParams.get('type');
    setDrivingType(drivingType);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    DrivingApi
      .getDrivingDate({
        isVisible: true,
        drivingType,
        center,
      })
      .then(async (res) => {
        const temp = res.data;

        for (let e of temp) {
          e.date = new Date(e.date);
        }

        setDates(temp);

        if (temp[0]) {
          DrivingApi
            .queryDrivings(temp[0]?.date, state, drivingType)
            .then((res) => {
              const newData = checkDuplicate(res.data);
              setData(newData);
              setDateSelected(0);
              setLoading(false);
            })
            .catch((error) => {
              alert(error);
              setLoading(false);
            });
        }

        setLoading(false);
      })
      .catch((error) => {
        alert(error);
        setLoading(false);
      });
  }, [drivingType]);

  const queryDrivings = async (dateIndex, state) => {
    if (dateIndex === null) {
      DrivingApi
        .queryDrivings(null, state, drivingType)
        .then((res) => {
          const newData = checkDuplicate(res.data);
          setData(newData);
          setDateSelected(dateIndex);
          setLoading(false);
        })
        .catch((error) => {
          alert(error);
          setLoading(false);
        });
    } else {
      DrivingApi
        .queryDrivings(dates[dateIndex].date, state, drivingType)
        .then((res) => {
          const newData = checkDuplicate(res.data);
          setData(newData);
          setDateSelected(dateIndex);
          setLoading(false);
        })
        .catch((error) => {
          alert(error);
          setLoading(false);
        });
    }
  };

  const handleDateButton = async (index) => {
    setLoading(true);

    if (index === null) {
      await queryDrivings(null, state);
      return;
    }

    await queryDrivings(index, state);
    setDateSelected(index);
  };

  const handleStateButton = async (value) => {
    setLoading(true);
    setState(value);
    await queryDrivings(dateSelected, value);
  };

  const handleActionButton = () => {
    console.log(uploadFileOption)
    if (action === ACTION_OPTIONS.DOWNLOAD_PDF) {
      downloadPDF();
    } else if (action === ACTION_OPTIONS.EXPORT_EXCEL) {
      exportExcel();
    } else if (action === ACTION_OPTIONS.DOWNLOAD_FILE) {
      if (downloadFileFields[DOWNLOAD_FILE_FIELDS.CARD]) {
        zipFile(data, DOWNLOAD_FILE_FIELDS.CARD);
      }

      if (downloadFileFields[DOWNLOAD_FILE_FIELDS.CARD_CROP]) {
        zipFile(data, DOWNLOAD_FILE_FIELDS.CARD_CROP);
      }

      if (downloadFileFields[DOWNLOAD_FILE_FIELDS.PORTRAIT]) {
        zipFile(data, DOWNLOAD_FILE_FIELDS.PORTRAIT);
      }
    } else if(action === ACTION_OPTIONS.UPLOAD_FILE) {
      if (uploadFileOption.value === UPLOAD_FILE_OPTIONS.ALL) {

      }
    }
  }

  const exportExcel = async () => {
    let exportData = [], idx = 0, identityInfo, detailAddress, addressTownCode, address, dob, identityNumber, error='';
    for (let child of data) {
      ++idx;
      setLoadingAction(idx);
      let invalidState = 'Hồ sơ hợp lệ', paymentMethod = '';

      if (exportExcelFields[EXPORT_EXCEL_FIELDS.INVALID_STATE]) {
        if (child?.invalidCard && child?.invalidPortrait) {
          invalidState = 'Căn cước và chân dung không hợp lệ';
        } else if (child?.invalidPortrait) {
          invalidState = 'Ảnh chân dung không hợp lệ';
        } else if (child?.invalidCard) {
          invalidState = 'Căn cước không hợp lệ';
        }
      }

      if (exportExcelFields[EXPORT_EXCEL_FIELDS.PAYMENT_METHOD]) {
        if (child?.paymentMethod === PAYMENT_METHODS.BANK_TRANSFER) {
          paymentMethod = 'Chuyển khoản';
        } else if (child?.paymentMethod === PAYMENT_METHODS.DIRECT) {
          paymentMethod = 'Tiền mặt';
        }
      }

      if (child.identityInfo && (exportExcelFields[EXPORT_EXCEL_FIELDS.DOB] || exportExcelFields[EXPORT_EXCEL_FIELDS.GENDER] || exportExcelFields[EXPORT_EXCEL_FIELDS.IDENTITY_CARD_NUMBER] || exportExcelFields[EXPORT_EXCEL_FIELDS.ADDRESS] || exportExcelFields[EXPORT_EXCEL_FIELDS.ADDRESS_TOWN_CODE] || exportExcelFields[EXPORT_EXCEL_FIELDS.DETAIL_ADDRESS] || exportExcelFields[EXPORT_EXCEL_FIELDS.CARD_PROVIDED_DATE] || exportExcelFields[EXPORT_EXCEL_FIELDS.CARD_PROVIDED_PLACE])) {
        try {
          const res = await ocrApi.getOcrInfo(child?.identityInfo);
          identityInfo = res?.data?.info;
          address = res?.data?.frontType === IDENTITY_CARD_TYPE.CHIP_ID_CARD_FRONT ? identityInfo[1]?.address : identityInfo[0]?.address;
          addressTownCode = res?.data?.frontType === IDENTITY_CARD_TYPE.CHIP_ID_CARD_FRONT ? identityInfo[1]?.address_ward_code : identityInfo[0]?.address_ward_code;
          detailAddress = res?.data?.frontType === IDENTITY_CARD_TYPE.CHIP_ID_CARD_FRONT ? identityInfo[1]?.address?.split(identityInfo[1]?.address_ward)[0] : identityInfo[0]?.address?.split(identityInfo[1]?.address_ward)[0];
          error =
            identityInfo[1]?.dob !== identityInfo[0]?.dob
              ? 'Ngày sinh không khớp trên 2 mặt căn cước, '
              : '';
          dob = identityInfo[1]?.dob;
          identityNumber = identityInfo[1]?.id
          error =
            identityInfo[1]?.id !== identityInfo[0]?.person_number
              ? (error += 'Số căn cước không khớp trên 2 mặt căn cước')
              : '';
        } catch (error) {
          console.log(error);
        }
      } else {
        identityInfo = null;
        address = null;
        addressTownCode = null;
        detailAddress = null;
        dob = null;
        identityNumber = null;
        error = 'Không có thông tin căn cước';
      }

      const temp = {
        ...(exportExcelFields[EXPORT_EXCEL_FIELDS.NO] && { STT: idx }),
        ...(exportExcelFields[EXPORT_EXCEL_FIELDS.TIMESTAMP] && { 'Thời gian đăng ký': new Date(child?.createdAt).toLocaleString('en-GB') }),
        ...(exportExcelFields[EXPORT_EXCEL_FIELDS.FULL_NAME] && { 'Họ và tên': child?.name }),
        ...(exportExcelFields[EXPORT_EXCEL_FIELDS.LAST_NAME] && { 'Họ và tên đệm': child?.name?.trim()?.split(' ')?.slice(0, -1)?.join(' ') }),
        ...(exportExcelFields[EXPORT_EXCEL_FIELDS.FIRST_NAME] && { 'Tên': child?.name?.trim()?.split(' ')?.slice(-1)?.join(' ') }),
        ...(exportExcelFields[EXPORT_EXCEL_FIELDS.DRIVING_DATE] && { 'Ngày thi': new Date(child?.date).toLocaleDateString('en-GB') }),
        ...(exportExcelFields[EXPORT_EXCEL_FIELDS.DRIVING_TYPE] && { 'Hạng thi': DRIVING_TYPE_LABEL[child?.drivingType] }),
        ...(exportExcelFields[EXPORT_EXCEL_FIELDS.PHONE_NUMBER] && { 'Số điện thoại': [child?.tel?.trim()?.slice(0, 4), child?.tel?.trim()?.slice(4, 7), child?.tel?.trim()?.slice(7)].join(' ') }),
        ...(exportExcelFields[EXPORT_EXCEL_FIELDS.ZALO] && { 'Zalo': [child?.zalo?.trim()?.slice(0, 4), child?.zalo?.trim()?.slice(4, 7), child?.zalo?.trim()?.slice(7)].join(' ') }),
        ...(exportExcelFields[EXPORT_EXCEL_FIELDS.HIDDEN_PHONE_NUMBER] && { 'Số điện thoại (đã ẩn)': child?.tel?.slice(0, 4) + '***' + child?.tel?.slice(-3) }),
        ...(exportExcelFields[EXPORT_EXCEL_FIELDS.PROCESS_STATE] && { 'Trạng thái xử lý': DRIVING_STATE_LABEL[child?.processState] }),
        ...(exportExcelFields[EXPORT_EXCEL_FIELDS.INVALID_STATE] && { 'Trạng thái hồ sơ': invalidState }),
        ...(exportExcelFields[EXPORT_EXCEL_FIELDS.PAYMENT_STATE] && { 'Trạng thái thanh toán': child?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán' }),
        ...(exportExcelFields[EXPORT_EXCEL_FIELDS.PAYMENT_AMOUNT] && { 'Số tiền': child?.cash }),
        ...(exportExcelFields[EXPORT_EXCEL_FIELDS.PAYMENT_METHOD] && { 'Phương thức thanh toán': paymentMethod }),
        ...(exportExcelFields[EXPORT_EXCEL_FIELDS.NOTE] && { 'Ghi chú': child?.feedback }),
        ...(exportExcelFields[EXPORT_EXCEL_FIELDS.PORTRAIT_URL] && { 'Ảnh chân dung': child?.portraitUrl }),
        ...(exportExcelFields[EXPORT_EXCEL_FIELDS.FRONT_URL] && { 'Ảnh căn cước mặt trước': child?.frontUrl }),
        ...(exportExcelFields[EXPORT_EXCEL_FIELDS.BACK_URL] && { 'Ảnh căn cước mặt sau': child?.backUrl }),
        ...(exportExcelFields[EXPORT_EXCEL_FIELDS.DOB] && { 'Ngày sinh': dob }),
        ...(exportExcelFields[EXPORT_EXCEL_FIELDS.GENDER] && { 'Giới tính': identityInfo && identityInfo[1]?.gender }),
        ...(exportExcelFields[EXPORT_EXCEL_FIELDS.IDENTITY_CARD_NUMBER] && { 'Số căn cước': identityNumber }),
        ...(exportExcelFields[EXPORT_EXCEL_FIELDS.ADDRESS] && { 'Địa chỉ': address }),
        ...(exportExcelFields[EXPORT_EXCEL_FIELDS.ADDRESS_TOWN_CODE] && { 'Mã xã/phường': addressTownCode }),
        ...(exportExcelFields[EXPORT_EXCEL_FIELDS.DETAIL_ADDRESS] && { 'Địa chỉ chi tiết': detailAddress }),
        ...(exportExcelFields[EXPORT_EXCEL_FIELDS.CARD_PROVIDED_DATE] && { 'Ngày cấp': identityInfo && identityInfo[0]?.issue_date }),
        ...(exportExcelFields[EXPORT_EXCEL_FIELDS.CARD_PROVIDED_PLACE] && { 'Nơi cấp': identityInfo && identityInfo[0]?.issued_at }),
        ...(exportExcelFields[EXPORT_EXCEL_FIELDS.HEALTH_CHECKED_DATE] && { 'Ngày khám sức khỏe': child?.healthDate ? new Date(child?.healthDate).toLocaleString('en-GB') : '' }),
        ...(exportExcelFields[EXPORT_EXCEL_FIELDS.ERROR] && { 'Lỗi': error }),
      };

      exportData.push(temp);
    }

    setLoadingAction(0);

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const excelData = new Blob([excelBuffer], { type: fileType });
    const fileName = `${EXPORT_EXCEL_OPTIONS.EXPORT_EXAM_EXCEL ? 'DS_THI' : (EXPORT_EXCEL_OPTIONS.EXPORT_INPUT_EXCEL ? 'DS_NHAP' : '')}_${new Date(data[0]?.date).toLocaleDateString('en-GB')}_TC_${exportData?.length}`;
    FileSaver.saveAs(excelData, fileName + fileExtension)
  }

  const downloadPDF = async () => {
    let pdfData = [], pdfElements = [];
    const perPage = 4;
    let count = 0, idx = 0;

    for (let child of data) {
      if (child?.identityInfo) {
        setLoadingAction(idx);
        const ocrData = await ocrApi.getOcrImage(child.identityInfo);
        const qrCodeString = ReactDOMServer.renderToString(<QRCode value={child?.tel} size={45} />)
        const qrCodeData = new DOMParser().parseFromString(qrCodeString, 'image/svg+xml').getElementsByTagName('path');

        if (count < perPage) {
          pdfElements.push({
            tel: child.tel,
            image: ocrData?.data?.image,
            qrCodeData,
          });
        } else {
          pdfData.push(pdfElements);
          pdfElements = [];
          pdfElements.push({
            tel: child.tel,
            image: ocrData?.data?.image,
            qrCodeData,
          });
          count = 0;
        }

        count++;
        ++idx;
      }
    }

    pdfData.push(pdfElements);

    const MyDoc = (<Document>
      {pdfData.map((child) => (
        <React.Fragment key={_.uniqueId()}>
          <Page size="A4" style={styles.imagePage}>
            {
              child.map((element) => {
                return (
                  <View style={styles.imageGroupSection}>
                    <PDFImage style={styles.image} src={`data:image/jpeg;base64,${element?.image?.[1]}`} />
                    <PDFImage style={styles.image} src={`data:image/jpeg;base64,${element?.image?.[0]}`} />
                  </View>
                );
              })
            }
          </Page>
          <Page size="A4" style={styles.qrPage}>
            {
              child.map((element) => {
                return (
                  <View style={styles.qrSection}>
                    <Svg width='45' height='45' viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                      <Path fill="#FFFFFF" d={element?.qrCodeData?.[0].getAttribute('d')}>
                      </Path>
                      <Path fill="#000000" d={element?.qrCodeData?.[1].getAttribute('d')}>
                      </Path>
                    </Svg>
                  </View>
                );
              })
            }
          </Page>
        </React.Fragment>
      ))}
    </Document>);
    pdf(MyDoc).toBlob().then(blob => {
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    }).catch(e => {
      console.log(e);
    }).finally(() => {
      setLoadingAction(0);
    });
  }

  const getSignedUrl = async (url) => {
    try {
      const res = await fileApi.getSignedUrl(url);
      return res?.data?.signedUrl;
    } catch (error) {
      return url;
    }
  }

  const zipFile = async (data, type) => {
    if (type === DOWNLOAD_FILE_FIELDS.CARD) {
      const frontZip = new JSZip()

      for (let drivingInfo of data) {
        setLoadingAction(prev => prev + 1);

        if (drivingInfo?.frontUrl) {
          const fileMimeType = drivingInfo.frontUrl.split('.').pop();
          const frontResponse = await fetch(await getSignedUrl(drivingInfo.frontUrl));
          const frontBlob = await frontResponse.blob();
          frontZip.file(`${drivingInfo.name}-${drivingInfo.tel}.${fileMimeType}`, frontBlob, { binary: true });
        }
      }

      frontZip.generateAsync({ type: "blob" }).then(function (content) {
        FileSaver.saveAs(content, `front_${new Date(data[0]?.date).toLocaleDateString('en-GB')}_TC_${data.length}.zip`);
      });

      const backZip = new JSZip()

      for (let drivingInfo of data) {
        setLoadingAction(prev => prev + 1);

        if (drivingInfo.backUrl) {
          const fileMimeType = drivingInfo.backUrl.split('.').pop();
          const backResponse = await fetch(await getSignedUrl(drivingInfo.backUrl));
          const backBlob = await backResponse.blob();
          backZip.file(`${drivingInfo.name}-${drivingInfo.tel}.${fileMimeType}`, backBlob, { binary: true });
        }
      }

      backZip.generateAsync({ type: "blob" }).then(function (content) {
        FileSaver.saveAs(content, `back_${new Date(data[0]?.date).toLocaleDateString('en-GB')}_TC_${data.length}.zip`);
      });
    }

    if (type === DOWNLOAD_FILE_FIELDS.PORTRAIT) {
      const portraitZip = new JSZip()

      for (let drivingInfo of data) {
        setLoadingAction(prev => prev + 1);

        if (drivingInfo.portraitUrl) {
          const fileMimeType = drivingInfo.portraitUrl.split('.').pop();
          const portraitResponse = await fetch(await getSignedUrl(drivingInfo.portraitUrl));
          const portraitBlob = await portraitResponse.blob();
          portraitZip.file(`${drivingInfo.name}-${drivingInfo.tel}.${fileMimeType}`, portraitBlob, { binary: true });
        }
      }

      portraitZip.generateAsync({ type: "blob" }).then(function (content) {
        FileSaver.saveAs(content, `portrait_${new Date(data[0]?.date).toLocaleDateString('en-GB')}_TC_${data.length}.zip`);
      });
    }

    if (type === DOWNLOAD_FILE_FIELDS.CARD_CROP) {
      const frontCropZip = new JSZip()
      const backCropZip = new JSZip()

      for (let drivingInfo of data) {
        setLoadingAction(prev => prev + 1);

        if (drivingInfo?.identityInfo) {
          const frontFileName = `${drivingInfo.name}-${drivingInfo.tel}-1.jpg`;
          const backFileName = `${drivingInfo.name}-${drivingInfo.tel}-2.jpg`;
          const { data: identityInfo } = await ocrApi.getOcrImage(drivingInfo.identityInfo);
          frontCropZip.file(frontFileName, identityInfo?.image[1], { base64: true });
          backCropZip.file(backFileName, identityInfo?.image[0], { base64: true });
        }
      }

      frontCropZip.generateAsync({ type: "blob" }).then(function (content) {
        FileSaver.saveAs(content, `front-crop_${new Date(data[0]?.date).toLocaleDateString('en-GB')}_TC_${data.length}.zip`);
      });
      backCropZip.generateAsync({ type: "blob" }).then(function (content) {
        FileSaver.saveAs(content, `back-crop_${new Date(data[0]?.date).toLocaleDateString('en-GB')}_TC_${data.length}.zip`);
      });
    }
    setLoadingAction(0);
  }

  useEffect(() => {
    if(uploadedFiles.length > 0 && action === ACTION_OPTIONS.UPLOAD_FILE) {
      setPreventActionButton(true);
    } else {
      setPreventActionButton(false);
    }
  }, [uploadedFiles, action]);
  console.log(uploadedFiles)
  const handleResponse = useCallback((res) => {
    let file = res.data;

    if (!file.originalName) {
      console.error("Lỗi: File không có originalName");
      return;
    }

    const infos = file.originalName.split("-");
    file.name = infos[0]?.trim() || "";
    file.tel = infos[1]?.trim() || "";
    file.zalo = infos[1]?.trim() || "";

    const currentUploadFileOption = uploadFileOptionRef.current;

    if (!currentUploadFileOption || !currentUploadFileOption.value) {
      console.error("Lỗi: uploadFileOption không hợp lệ", currentUploadFileOption);
      return;
    }

    let newFileData = { ...file };

    if (currentUploadFileOption.value === UPLOAD_FILE_OPTIONS.ALL) {
      if (file.originalName.includes('front')) {
        newFileData[UPLOAD_FILE_OPTIONS.FRONT] = file.url;
      } else if (file.originalName.includes('back')) {
        newFileData[UPLOAD_FILE_OPTIONS.BACK] = file.url;
      } else if (file.originalName.includes('portrait')) {
        newFileData[UPLOAD_FILE_OPTIONS.PORTRAIT] = file.url;
      } else {
        newFileData[UPLOAD_FILE_OPTIONS.FRONT] = file.url;
      }
    } else {
      newFileData[currentUploadFileOption.value] =
        file.url;
    }

    setUploadedFiles((prev) => {
      const fileIndex = prev.findIndex((child) => child.name === file.name);

      if (fileIndex !== -1) {
        const updatedFiles = [...prev];
        updatedFiles[fileIndex] = {
          ...updatedFiles[fileIndex],
          ...newFileData,
        };
        return updatedFiles;
      } else {
        return [...prev, newFileData];
      }
    });
}, []);
  
  return (
    <div
      style={{
        height: '100vh',
        overflow: 'scroll',
      }}
    >
      <div className='d-flex flex-wrap justify-content-center'>
        {dates.map((child, index) => {
          return (
            <Button
              variant={dateSelected === index ? 'primary' : 'text-secondary'}
              className='mx-2 my-1 rounded-pill border-primary px-2 py-1 form-label'
              onClick={() => handleDateButton(index)}
              key={child._id}
              style={{ minWidth: '100px' }}
            >
              <span>{child.date.toLocaleDateString('en-GB')}</span>
            </Button>
          );
        })}
      </div>
      <div className='my-3 d-flex justify-content-center'>
        <Button
          className='mx-1'
          onClick={() => handleStateButton(null)}
          variant={state === null ? 'primary' : 'outline-primary'}
        >
          Tất cả {state === null ? `(${data.length})` : ''}
        </Button>

        {Object.keys(DRIVING_STATE).map((key) => {
          return (
            <Button
              className='mx-1'
              onClick={() => handleStateButton(DRIVING_STATE[key])}
              variant={
                state === DRIVING_STATE[key] ? 'primary' : 'outline-secondary'
              }
              key={key}
            >
              {DRIVING_STATE_LABEL[DRIVING_STATE[key]]}{' '}
              {state === DRIVING_STATE[key] ? `(${data.length})` : ''}
            </Button>
          );
        })}
        <Button className='mx-1' onClick={() => setShowActionModal(true)}>
          <MdDownload /> Thao tác
        </Button>
      </div>

      {data.length <= 0 && !loading && (
        <p className='text-center mt-5'>Không có dữ liệu</p>
      )}

      {loading ? (
        <p className='text-center mt-5'>Đang tải dữ liệu...</p>
      ) : (
        <div>
          {data.map((child) => {
            return (
              <Driving
                info={child}
                dateList={dates}
                key={child._id}
                id={child._id}
                drivingTypesLabel={DRIVING_TYPES_LABEL}
              />
            );
          })}
        </div>
      )}

      <Modal
        show={showActionModal}
        onHide={() => setShowActionModal(false)}
        size={action === ACTION_OPTIONS.UPLOAD_FILE ? 'xl' : 'lg'}
      >
        <Modal.Header closeButton>
          <Modal.Title>Chọn thao tác</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Select
            onChange={(e) => setAction(e.value)}
            options={Object.keys(ACTION_OPTIONS_LABEL).map((key) => {
              return {
                value: key,
                label: ACTION_OPTIONS_LABEL[key],
              };
            })}
            defaultValue={{
              value: ACTION_OPTIONS.EXPORT_EXCEL,
              label: ACTION_OPTIONS_LABEL[ACTION_OPTIONS.EXPORT_EXCEL],
            }}
            value={{
              value: action,
              label: ACTION_OPTIONS_LABEL[action],
            }}
          />
          {action === ACTION_OPTIONS.EXPORT_EXCEL && (
            <Select
              className='mt-3'
              onChange={(e) => {
                if (e.value === EXPORT_EXCEL_OPTIONS.EXPORT_EXAM_EXCEL) {
                  setExportExcelOption(e);
                  setExportExcelFields(EXPORT_EXAM_EXCEL_FIELDS_TEMPLATE);
                } else if (
                  e.value === EXPORT_EXCEL_OPTIONS.EXPORT_INPUT_EXCEL
                ) {
                  setExportExcelOption(e);
                  setExportExcelFields(EXPORT_INPUT_EXCEL_FIELDS_TEMPLATE);
                }
              }}
              options={Object.keys(EXPORT_EXCEL_OPTIONS_LABEL).map((key) => {
                return {
                  value: key,
                  label: EXPORT_EXCEL_OPTIONS_LABEL[key],
                };
              })}
              defaultValue={exportExcelOption}
              value={exportExcelOption}
            />
          )}
          {action === ACTION_OPTIONS.EXPORT_EXCEL && (
            <>
              <p className='my-3 text-center'>Chọn các trường danh sách</p>
              <div className='d-flex flex-wrap mt-3'>
                {Object.keys(exportExcelFields).map((key) => {
                  return (
                    <Form.Check
                      className='w-50'
                      name={key}
                      key={key}
                      type='checkbox'
                      label={EXPORT_EXCEL_FIELDS_LABEL[key]}
                      checked={exportExcelFields[key]}
                      onChange={(e) =>
                        setExportExcelFields({
                          ...exportExcelFields,
                          [e.target.name]: e.target.checked,
                        })
                      }
                    />
                  );
                })}
              </div>
              <div className='my-3 mx-auto text-center'>
                {loadingAction ? (
                  <Button disabled={true}>
                    Đang thực hiện {loadingAction}
                  </Button>
                ) : (
                  <Button
                    variant='primary'
                    onClick={handleActionButton}
                    disabled={preventActionButton}
                  >
                    Thực hiện
                  </Button>
                )}
              </div>
            </>
          )}
          {action === ACTION_OPTIONS.DOWNLOAD_FILE && (
            <p className='my-3 text-center'>Chọn ảnh</p>
          )}
          {action === ACTION_OPTIONS.DOWNLOAD_FILE && (
            <>
              <div className='d-flex flex-wrap justify-content-around mt-3'>
                {Object.keys(downloadFileFields).map((key) => {
                  return (
                    <Form.Check
                      name={key}
                      key={key}
                      type='checkbox'
                      label={DOWNLOAD_FILE_FIELDS_LABEL[key]}
                      checked={downloadFileFields[key]}
                      onChange={(e) =>
                        setDownloadFileFields({
                          ...downloadFileFields,
                          [e.target.name]: e.target.checked,
                        })
                      }
                    />
                  );
                })}
              </div>
              <div className='my-3 mx-auto text-center'>
                {loadingAction ? (
                  <Button disabled={true}>
                    Đang thực hiện {loadingAction}
                  </Button>
                ) : (
                  <Button
                    variant='primary'
                    onClick={handleActionButton}
                    disabled={preventActionButton}
                  >
                    Thực hiện
                  </Button>
                )}
              </div>
            </>
          )}
          {action === ACTION_OPTIONS.UPLOAD_FILE && (
            <Select
              className='mt-3'
              onChange={(e) => setUploadFileOption(e)}
              options={Object.keys(UPLOAD_FILE_OPTIONS_LABEL).map((key) => {
                return {
                  value: key,
                  label: UPLOAD_FILE_OPTIONS_LABEL[key],
                };
              })}
              value={uploadFileOption}
            />
          )}
          {uploadedFiles.length > 0 &&
            action === ACTION_OPTIONS.UPLOAD_FILE && (
              <Table striped bordered hover className='mt-3 text-center'>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Họ và tên</th>
                    <th>SĐT</th>
                    <th>Zalo</th>
                    <th>Mặt trước</th>
                    <th>Mặt sau</th>
                    <th>Chân dung</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {uploadedFiles.map((child, index) => {
                    return (
                      <tr key={index} className='align-middle text-center'>
                        <td>{index + 1}</td>
                        <td>{child.name}</td>
                        <td>{child.tel}</td>
                        <td>{child.zalo}</td>
                        <td>
                          {child.frontUrl && (
                            <Button
                              variant='white'
                              onClick={async () => {
                                window.open(
                                  await getSignedUrl(child.frontUrl),
                                  '_blank'
                                );
                              }}
                              rel='noreferrer'
                            >
                              <IoMdEye className='text-primary' />
                            </Button>
                          )}
                        </td>
                        <td>
                          {child.backUrl && (
                            <Button
                              variant='white'
                              onClick={async () => {
                                window.open(
                                  await getSignedUrl(child.backUrl),
                                  '_blank'
                                );
                              }}
                              rel='noreferrer'
                            >
                              <IoMdEye className='text-primary' />
                            </Button>
                          )}
                        </td>
                        <td>
                          {child.portraitUrl && (
                            <Button
                              variant='white'
                              onClick={async () => {
                                window.open(
                                  await getSignedUrl(child.portraitUrl),
                                  '_blank'
                                );
                              }}
                              rel='noreferrer'
                            >
                              <IoMdEye className='text-primary' />
                            </Button>
                          )}
                        </td>
                        <td>
                          <Button
                            variant='white'
                            onClick={() => {
                              const confirm = window.confirm(
                                'Bạn có chắc chắn muốn xóa hồ sơ này?'
                              );

                              if (!confirm) return;

                              setUploadedFiles((prev) => {
                                return prev.filter((child, i) => i !== index);
                              });
                            }}
                          >
                            <MdDelete className='text-danger' />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
          {action === ACTION_OPTIONS.UPLOAD_FILE && (
            <div className='d-flex flex-wrap justify-content-center my-3'>
              <FileUploader
                multiple={true}
                name='file'
                text='Tải lên'
                hasLabel={false}
                url={FILE_UPLOAD_URL}
                uploading={uploading}
                setUploading={setUploading}
                onResponse={handleResponse}
              />
              <Button
                className='ms-3'
                onClick={() => {
                  const confirm = window.confirm(
                    `Bạn có chắc chắn muốn lưu tất cả ${uploadedFiles.length} hồ sơ đã tải lên?`
                  );

                  if (!confirm) return;

                  for (let child of uploadedFiles) {
                    DrivingApi.addDriving({
                      ...child,
                      date: dates[dateSelected].date,
                      drivingType,
                      center: dates[dateSelected]?.center?._id,
                    })
                      .then((res) => {
                        toastWrapper(
                          'Tải lên ' + child.name + ' thành công',
                          'success'
                        );
                        setUploadedFiles((prev) =>
                          prev.filter((item) => item.tel !== child.tel)
                        );
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  }
                }}
              >
                Lưu tất cả
              </Button>
            </div>
          )}

          {action === ACTION_OPTIONS.UPLOAD_FILE ? (
            <p className='my-3 text-center'>
              Tổng cộng {uploadedFiles.length} hồ sơ
            </p>
          ) : (
            <p className='my-3 text-center'>Tổng cộng {data.length} hồ sơ</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='outline-primary'
            onClick={() => setShowActionModal(false)}
          >
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminDrivingListPage;
