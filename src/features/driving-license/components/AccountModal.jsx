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

function AccountModal({ show, setShow, tel, aPrice, bPrice }) {
  const [copied, setCopied] = useState(false);
  const [contentCopied, setContentCopied] = useState(false);
  const [bankCode, setBankCode] = useState('MB');
  const [accountNumber, setAccountNumber] = useState('7899996886');
  const [desc, setDesc] = useState(`GPLX ${tel}` || 'GPLX <Số điện thoại>');
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

  const DRIVING_PRICES = {
    A1: {
      student: {
        checkup: 730000,
        noCheckup: 650000,
      },
      normal: {
        checkup: 770000,
        noCheckup: 690000,
      },
    },

    A: {
      checkup: 1690000,
      noCheckup: 1550000,
    },

    other : 0,
    }

  useEffect(() => {
    if (group === 1) {
      setDesc('GPLX ' + (tel || '<Số điện thoại>'));
    } else if (group === 2) {
      setDesc('GPLX <SĐT1> <SĐT2>');
    } else if (group === 3) {
      setDesc('GPLX <SĐT1> <SĐT2> <SĐT3>');
    }
    
    if (drivingClass === 'A1') {
      if (!hasCheckup && aPrice) {
        return setAmount(aPrice);
      }

      if (hasCheckup && bPrice) {
        return setAmount(bPrice);
      }

      if (isStudent) {
        if (hasCheckup) {
          if (group === 1) {
            setAmount(DRIVING_PRICES.A1.student.checkup);
          } else if (group === 2) {
            setAmount(DRIVING_PRICES.A1.student.checkup);
          } else if (group === 3) {
            setAmount(DRIVING_PRICES.A1.student.checkup);
          }
        } else {
          setAmount(DRIVING_PRICES.A1.student.noCheckup);
        }
      } else {
        if (hasCheckup) {
          setAmount(DRIVING_PRICES.A1.normal.checkup);
        } else {
          setAmount(DRIVING_PRICES.A1.normal.noCheckup);
        }
      }
    }

    if (drivingClass === 'A') {
      if (hasCheckup) {
        setAmount(DRIVING_PRICES.A.checkup);
      } else {
        setAmount(DRIVING_PRICES.A.noCheckup);
      }
    }

    if (drivingClass === '') {
      setAmount(DRIVING_PRICES.other);
    }
  }, [drivingClass, isStudent, hasCheckup, group, tel, aPrice, bPrice]);

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      scrollable={true}
      keyboard={false}
      size='lg'
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
                      onClick={() => setDrivingClass('A')}
                      variant={
                        drivingClass === 'A'
                          ? 'secondary'
                          : 'outline-secondary'
                      }
                      className='fw-bold'
                    >
                      Hạng A
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

                  {/* <ButtonGroup className='m-1' size='sm'>
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
                  </ButtonGroup> */}
                </ButtonToolbar>
              </Row>
              <Row>
                <p className='text-center text-primary m-0'>
                  Lệ phí thi hạng {drivingClass}{' '}
                  {isStudent ? 'đối với sinh viên' : ''} khi{' '}
                  {hasCheckup
                    ? 'khám sức khoẻ tại trung tâm.'
                    : 'tự khám sức khoẻ.'}
                </p>
                <p className='text-center'>
                  <strong>{formatCurrency(amount)}</strong> VNĐ
                  {group === 1 ? '' : ` x ${group} người`}
                </p>
                {group > 1 && (
                  <p className='text-center text-danger'>
                    Ưu đãi đăng ký theo nhóm {group} người chỉ áp dụng khi đăng
                    ký trực tiếp.
                  </p>
                )}
              </Row>
              <Row>
                <div className='text-uppercase fw-bold mb-3'>{bankName}</div>
                <div className='mb-2'>
                  <small>Chủ tài khoản</small>
                  <br />
                  <b>{accountName?.toUpperCase()}</b>
                </div>
                <Row className='mb-2'>
                  <Col xs={12}>
                    <small>Số tài khoản</small>
                    <br />
                    <b>{accountNumber} </b>
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
                    <small>Nội dung</small>
                    <br />
                    <b>{desc} </b>
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
