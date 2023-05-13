import motobikeApi from 'api/motobikeApi';
import ZaloImage from 'assets/images/ZaloImage';
import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import { Button, Col, Container, Modal, Row } from 'react-bootstrap';
import { BiPhoneCall } from 'react-icons/bi';
import {
  BsArrowLeftRight,
  BsArrowRight,
  BsFillChatLeftTextFill,
} from 'react-icons/bs';
import ZaloLink from 'components/link/ZaloLink';
import styled from 'styled-components';
import { toastWrapper } from 'utils';
import { convertToDateTime } from 'utils/commonUtils';

function MotobikeItem({
  _id,
  from,
  to,
  time1,
  time2,
  tip,
  note,
  isDriver,
  twoWay,
  user,
  hasInfoButton,
  hasToggleVisbleButton,
  visible,
  tel,
  zalo,
}) {
  const [showInfo, setShowInfo] = useState(false);
  const [isVisble, setIsVisble] = useState(visible);
  const switchRef = useRef(isVisble);

  useEffect(() => {
    if (switchRef.current != isVisble) {
      switchRef.current = isVisble;
      motobikeApi
        .updateMotobikeRequest(_id, { visible: isVisble })
        .then((res) => {
          return toastWrapper('Cập nhật thành công!', 'success');
        })
        .catch((e) => {
          return toastWrapper(
            e?.respose?.data?.message || 'Không thể hoàn tất thao tác này'
          );
        });
    }
  }, [isVisble]);

  const handleClose = () => {
    setShowInfo(false);
  };

  const handleToggleVisble = () => {
    setIsVisble((_prev) => {
      return !isVisble;
    });
  };

  return (
    <Styles className='border p-3 rounded my-3'>
      <Row>
        <div className='d-flex fw-bold justify-content-between pt-1 pb-2 mb-3 border-bottom'>
          {isDriver ? (
            <span className='text-success'>Tìm yên sau</span>
          ) : (
            <span className='text-danger'>Tìm tài xế</span>
          )}
          <span className='text-primary'>
            {twoWay ? 'Hai chiều' : 'Một chiều'}
          </span>
        </div>
      </Row>
      <Row>
        <Col xs={5}>
          <b>{from}</b>
          <div className='date-time'>
            {convertToDateTime(time1, true, ' lúc ')}
          </div>
        </Col>
        <Col xs={2}>{twoWay ? <BsArrowLeftRight /> : <BsArrowRight />}</Col>
        <Col xs={5}>
          <b>{to}</b>
          <div className='date-time'>
            {twoWay && time2 && convertToDateTime(time2, true, ' lúc ')}
          </div>
        </Col>
      </Row>

      <Row className='mt-2'>
        <b>Chia tiền xăng</b>
        <div>{tip}</div>
      </Row>

      <Row>
        <b>Ghi chú</b>
        <div>{note}</div>
      </Row>

      {hasInfoButton && (
        <Row>
          <div className='d-flex justify-content-end mt-3'>
            <Button variant='outline-primary' onClick={() => setShowInfo(true)}>
              Xem thông tin liên hệ
            </Button>
          </div>
        </Row>
      )}

      {hasToggleVisbleButton && (
        <Row>
          <div class='form-check form-switch ms-3'>
            <label class='form-check-label fw-bold' for='visible-switch'>
              Hiện tin
            </label>
            <input
              class='form-check-input'
              type='checkbox'
              role='switch'
              id='visible-switch'
              onChange={handleToggleVisble}
              checked={isVisble}
            />
          </div>
        </Row>
      )}

      <Modal show={showInfo} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Thông tin liên hệ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <div className='d-flex fw-bold justify-content-between pt-1 pb-2 mb-3'>
              <span className='text-primary'>
                {twoWay ? 'Hai chiều' : 'Một chiều'}
              </span>
              {isDriver ? (
                <span className='text-success'>Tìm yên sau</span>
              ) : (
                <span className='text-danger'>Tìm tài xế</span>
              )}
            </div>
          </Row>
          <Row className='border-success border rounded p-2 my-2 mx-1'>
            <Col xs={5}>
              <b>{from}</b>
              <div className='date-time'>
                {convertToDateTime(time1, true, ' lúc ')}
              </div>
            </Col>
            <Col xs={2}>{twoWay ? <BsArrowLeftRight /> : <BsArrowRight />}</Col>
            <Col xs={5}>
              <b>{to}</b>
              <div className='date-time'>
                {twoWay && time2 && convertToDateTime(time2, true, ' lúc ')}
              </div>
            </Col>
          </Row>

          <Row className='border-success border rounded p-2 my-3 mx-1'>
            <Col md={6}>
              <b>Di động</b>
              <div>{tel || 'Không có'}</div>
            </Col>
            <Col>
              {tel ? (
                <Button as='a' href={`tel:${tel}`} rel='noopener noreferrer'>
                  <BiPhoneCall />
                </Button>
              ) : (
                ''
              )}

              {tel ? (
                <Button
                  className='ms-3'
                  as='a'
                  href={`sms:+${tel}?&body=Ch%C3%A0o%20b%E1%BA%A1n%2C%20m%C3%ACnh%20li%C3%AAn%20h%E1%BB%87%20b%E1%BA%A1n%20t%E1%BB%AB%20Y%C3%8AN%20SHARE%2C%20b%E1%BA%A1n%20%C4%91ang%20c%E1%BA%A7n%20t%C3%ACm%20t%C3%A0i%20x%E1%BA%BF%2Fy%C3%AAn%20sau%20ph%E1%BA%A3i%20kh%C3%B4ng%3F`}
                  rel='noopener noreferrer'
                >
                  <BsFillChatLeftTextFill />
                </Button>
              ) : (
                ''
              )}

              {zalo ? (
                <button className='btn p-0 ms-3'>
                  <ZaloLink tel={zalo}>
                    <ZaloImage />
                  </ZaloLink>
                </button>
              ) : (
                ''
              )}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <p className='text-primary'>
            Đừng quên kiểm tra thẻ sinh viên và đội mũ bảo hiểm để đảm bảo an
            toàn cho cả 2 bạn nhé!
          </p>
          <Button variant='secondary' onClick={handleClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </Styles>
  );
}

const Styles = styled.div`
  background-color: white;

  .date-time {
    font-size: 0.9rem;
  }
`;

export default MotobikeItem;
