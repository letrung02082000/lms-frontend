import React, { useState, useEffect } from "react";
import Driving from "./Driving";
import { updateDrivingData } from "../../../store/drivingAdminSlice";
import { useDispatch } from "react-redux";
import Select from 'react-select'
import DrivingApi from "api/drivingApi";
import { Button, Form, Modal } from "react-bootstrap";
import { DOWNLOAD_OPTIONS, DOWNLOAD_OPTIONS_LABEL, DRIVING_STATE, DRIVING_STATE_LABEL } from "./constant";
import { MdDownload } from "react-icons/md";
import ocrApi from "api/ocrApi";
import { Document, Page, View, Image as PDFImage, Svg, Path, StyleSheet, pdf, Text } from "@react-pdf/renderer";
import QRCode from "react-qr-code";
import ReactDOMServer from 'react-dom/server'
import _ from "lodash";

function A1Driving() {
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
  const [action, setAction] = useState(null);

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
    dispatch(updateDrivingData(data));
  }, [data]);

  useEffect(() => {
    setLoading(true);
    DrivingApi
      .getDateVisible()
      .then(async (res) => {
        const temp = res.data;

        for (let e of temp) {
          e.date = new Date(e.date);
        }

        setDates(temp);

        if (temp[0]) {
          DrivingApi
            .queryDrivings(temp[0]?.date, DRIVING_STATE.CREATED)
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
  }, []);

  const queryDrivings = async (dateIndex, state) => {
    if (dateIndex === null) {
      DrivingApi
        .queryDrivings(null, state)
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
        .queryDrivings(dates[dateIndex].date, state)
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
    if(action === DOWNLOAD_OPTIONS.DOWNLOAD_PDF) {
      downloadPDF();
    }
  }

  const downloadPDF = async () => {
    let pdfData = [], pdfElements = [];
    const perPage = 4;
    const pages = Math.ceil(data.length / perPage);
    let count = 0;

    for (let child of data) {
      if (child?.identityInfo) {
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
      }
    }

    pdfData.push(pdfElements);

    console.log(pdfData);

    const MyDoc = (<Document>
      {pdfData.map((child) => (
        <>
          <Page size="A4" style={styles.imagePage}>
            {
              child.map((element) => {
                return (
                    <View style={styles.imageGroupSection}>
                      <PDFImage style={styles.image} src={`data:image/jpeg;base64,${element?.image[1]}`} />
                      <PDFImage style={styles.image} src={`data:image/jpeg;base64,${element?.image[0]}`} />
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
        </>
      ))}
    </Document>);
    pdf(MyDoc).toBlob().then(blob => {
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    }).catch(e => {
      console.log(e);
    });
  }

  return (
    <>
      <div className="d-flex flex-wrap justify-content-center">
        {dates.map((child, index) => {
          return (
            <Button
              variant={dateSelected === index ? "primary" : "text-secondary"}
              className="mx-2 my-1 rounded-pill border-primary px-2 py-1 form-label"
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
          className="mx-1"
          onClick={() => handleStateButton(null)}
          variant={state === null ? 'primary' : 'outline-primary'}
        >
          Tất cả {state === null ? `(${data.length})` : ''}
        </Button>

        {Object.keys(DRIVING_STATE).map((key) => {
          return (
            <Button
              className="mx-1"
              onClick={() => handleStateButton(DRIVING_STATE[key])}
              variant={state === DRIVING_STATE[key] ? 'primary' : 'outline-secondary'}
              key={key}
            >
              {DRIVING_STATE_LABEL[DRIVING_STATE[key]]} {state === DRIVING_STATE[key] ? `(${data.length})` : ''}
            </Button>
          );
        })}
        <Button className="mx-1" onClick={() => setShowActionModal(true)}><MdDownload/> Tải xuống</Button>
      </div>
      
      {data.length <= 0 && !loading && <p className="text-center mt-5">Không có dữ liệu</p>}

      {loading ? (
        <p className="text-center mt-5">Đang tải dữ liệu...</p>
      ) : (
        <div>
          {data.map((child) => {
            return (
              <Driving
                info={child}
                dateList={dates}
                key={child._id}
                id={child._id}
              />
            );
          })}
        </div>
      )}

      <Modal show={showActionModal} onHide={() => setShowActionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chọn thao tác</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Select
            onChange={(e) => setAction(e.value)}
            options={Object.keys(DOWNLOAD_OPTIONS_LABEL).map((key) => {
              return {
                value: key,
                label: DOWNLOAD_OPTIONS_LABEL[key],
              };
            })}
            defaultValue={action}
          />
          <p className="my-3 text-center">Tổng cộng {data.length} hồ sơ</p>
          <div className="mx-auto text-center">
            <Button variant='primary' onClick={handleActionButton}>
              Thực hiện
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='outline-primary' onClick={() => setShowActionModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default A1Driving;
