import React, { useEffect } from 'react';
import { useState } from 'react';
import {
  Button,
  ButtonGroup,
  ButtonToolbar,
  Col,
  Modal,
  Row,
} from 'react-bootstrap';
import { BiCopy } from 'react-icons/bi';
import CopyButton from 'components/button/CopyButton';
import styled from 'styled-components';
import { copyText, formatCurrency } from 'utils/commonUtils';

function AccountModal({ show, setShow, tel }) {
  const [copied, setCopied] = useState(false);
  const [contentCopied, setContentCopied] = useState(false);
  const [bankCode, setBankCode] = useState('MB');
  const [accountNumber, setAccountNumber] = useState('7899996886');
  const [desc, setDesc] = useState('GPLX <Số điện thoại>');
  const [accountName, setAccountName] = useState('NGUYỄN NGỌC HUÂN');
  const [bankName, setBankName] = useState('Ngân hàng Quân đội MB');
  const [amount, setAmount] = useState(690000);
  const [drivingClass, setDrivingClass] = useState('A1');
  const [isStudent, setIsStudent] = useState(true);
  const [hasCheckup, setHasCheckup] = useState(true);
  const [group, setGroup] = useState(1);

  const handleClose = () => {
    setShow(false);
  };

  useEffect(() => {
    if (drivingClass === 'A1') {
      if (isStudent) {
        if (hasCheckup) {
          if (group === 1) {
            setAmount(690000);
          } else if (group === 2) {
            setAmount(680000);
          } else if (group === 3) {
            setAmount(660000);
          }
        } else {
          setAmount(650000);
        }
      } else {
        if (hasCheckup) {
          setAmount(720000);
        } else {
          setAmount(690000);
        }
      }
    }

    if (drivingClass === 'A2') {
      if (hasCheckup) {
        setAmount(1590000);
      } else {
        setAmount(1450000);
      }
    }

    if (drivingClass === '') {
      setAmount(0);
    }

    if (group === 1) {
      setDesc('GPLX ' + (tel || '<Số điện thoại>'));
    } else if (group === 2) {
      setDesc('GPLX <SĐT1> <SĐT2>');
    } else if (group === 3) {
      setDesc('GPLX <SĐT1> <SĐT2> <SĐT3>');
    }
  }, [drivingClass, isStudent, hasCheckup, group, tel]);

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      scrollable={true}
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Thông tin chuyển khoản</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <ModalStyles>
          <Row className='justify-content-center'>
            <Col md={7}>
              <img
                src={`https://img.vietqr.io/image/${
                  bankCode || '970415'
                }-${accountNumber}-e59ZziA.jpg?accountName=${accountName}&amount=${
                  amount * group
                }&addInfo=${desc}`}
                alt='vietqr'
                className='w-100'
              />
              <p className='text-center m-0'>
                Lệ phí thi hạng {drivingClass}{' '}
                {isStudent ? 'đối với sinh viên' : ''} khi{' '}
                {hasCheckup
                  ? 'khám sức khoẻ tại trung tâm.'
                  : 'tự khám sức khoẻ.'}
              </p>
              <p className='text-center'>
                {formatCurrency(amount)} VNĐ
                {group === 1 ? '' : ` x ${group} người`}
              </p>
              {group > 1 && (
                <p className='text-center m-0'>Ưu đãi đăng ký theo nhóm {group} người chỉ áp dụng khi đăng ký trực tiếp.</p>
              )}
            </Col>

            <Col>
              <Row>
                <ButtonToolbar className='mb-3 justify-content-center'>
                  <ButtonGroup className='m-1' size='sm'>
                    <Button
                      onClick={() => setDrivingClass('A1')}
                      variant={
                        drivingClass === 'A1'
                          ? 'secondary'
                          : 'outline-secondary'
                      }
                      className='fw-bold'
                    >
                      Hạng A1
                    </Button>
                    <Button
                      onClick={() => setDrivingClass('A2')}
                      variant={
                        drivingClass === 'A2'
                          ? 'secondary'
                          : 'outline-secondary'
                      }
                      className='fw-bold'
                    >
                      Hạng A2
                    </Button>
                    <Button
                      onClick={() => setDrivingClass('')}
                      variant={
                        drivingClass === '' ? 'secondary' : 'outline-secondary'
                      }
                      className='fw-bold'
                    >
                      Hạng khác
                    </Button>
                  </ButtonGroup>
                  <ButtonGroup className='m-1' size='sm'>
                    <Button
                      onClick={() => setIsStudent(true)}
                      variant={isStudent ? 'secondary' : 'outline-secondary'}
                      className='fw-bold'
                    >
                      Sinh viên
                    </Button>
                    <Button
                      onClick={() => setIsStudent(false)}
                      variant={!isStudent ? 'secondary' : 'outline-secondary'}
                      className='fw-bold'
                    >
                      Không phải sinh viên
                    </Button>
                  </ButtonGroup>
                  <ButtonGroup className='m-1' size='sm'>
                    <Button
                      onClick={() => setHasCheckup(true)}
                      variant={hasCheckup ? 'secondary' : 'outline-secondary'}
                      className='fw-bold'
                    >
                      Khám tại trung tâm
                    </Button>
                    <Button
                      onClick={() => setHasCheckup(false)}
                      variant={!hasCheckup ? 'secondary' : 'outline-secondary'}
                      className='fw-bold'
                    >
                      Tự khám sức khoẻ
                    </Button>
                  </ButtonGroup>
                  <ButtonGroup className='m-1' size='sm'>
                    <Button
                      onClick={() => setGroup(1)}
                      variant={group === 1 ? 'secondary' : 'outline-secondary'}
                      className='fw-bold'
                    >
                      1 người
                    </Button>
                    <Button
                      onClick={() => setGroup(2)}
                      variant={group === 2 ? 'secondary' : 'outline-secondary'}
                      className='fw-bold'
                    >
                      Nhóm 2
                    </Button>
                    <Button
                      onClick={() => setGroup(3)}
                      variant={group === 3 ? 'secondary' : 'outline-secondary'}
                      className='fw-bold'
                    >
                      Nhóm 3
                    </Button>
                  </ButtonGroup>
                </ButtonToolbar>
              </Row>
              <Row>
                <div className='text-uppercase fw-bold mb-3'>{bankName}</div>
                <div className='mb-2'>
                  Chủ tài khoản
                  <br />
                  <b>{accountName?.toUpperCase()}</b>
                </div>
                <Row className='mb-2'>
                  <Col xs={12}>
                    Số tài khoản
                    <br />
                    <b>{accountNumber}{' '}</b>
                    <CopyButton
                      text={accountNumber}
                      copied={copied}
                      setCopied={setCopied}
                    >
                      <BiCopy />
                    </CopyButton>
                  </Col>
                </Row>
                <Row className='mb-2'>
                  <Col xs={12}>
                    Nội dung
                    <br />
                    <b>{desc}{' '}</b>
                    <CopyButton
                      text={desc}
                      copied={contentCopied}
                      setCopied={setContentCopied}
                    >
                      <BiCopy />
                    </CopyButton>
                  </Col>
                </Row>
              </Row>
            </Col>
          </Row>
        </ModalStyles>
      </Modal.Body>

      <Modal.Footer>
        <Button variant='secondary' onClick={handleClose}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AccountModal;

const ModalStyles = styled.div`
  .custom-label {
    font-size: 1rem;
    font-weight: 500;
    margin: 0.5rem 0 0;
  }
`;
