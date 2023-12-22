import React from 'react';
import { useState } from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { BiCopy } from 'react-icons/bi';
import CopyButton from 'components/button/CopyButton';
import styled from 'styled-components';
import { copyText, formatCurrency } from 'utils/commonUtils';

function AccountModal({
  show,
  setShow,
  amount,
  accountNumber,
  desc,
  accountName,
  bankName,
  bankCode,
}) {
  const [copied, setCopied] = useState(false);
  const [contentCopied, setContentCopied] = useState(false);
  const [amountCopied, setAmountCopied] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const handleClose = () => {
    setIsPaid(true);
    setShow(false);
  };

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
          <Row>
            <Col md={7}>
              <img
                src={`https://img.vietqr.io/image/${
                  bankCode || '970415'
                }-${accountNumber}-e59ZziA.jpg?accountName=${accountName}&amount=${amount}&addInfo=${desc}`}
                alt='vietqr'
                className='w-100 mb-2'
              />
            </Col>
            <Col>
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
                  <b>{accountNumber}</b>
                </Col>
                <Col>
                  <CopyButton
                    className='btn btn-outline-primary copy-btn'
                    text={accountNumber}
                    copied={copied}
                    setCopied={setCopied}
                  >
                    <BiCopy /> {copied ? 'Đã chép' : 'Sao chép'}
                  </CopyButton>
                </Col>
              </Row>
              <Row className='mb-2'>
                <Col xs={12}>
                  Nội dung
                  <br />
                  <b>{desc}</b>
                </Col>
                <Col>
                  <CopyButton
                    className='btn btn-outline-primary copy-btn'
                    text={desc}
                    copied={contentCopied}
                    setCopied={setContentCopied}
                  >
                    <BiCopy /> {contentCopied ? 'Đã chép' : 'Sao chép'}
                  </CopyButton>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  Số tiền
                  <br />
                  <b>{formatCurrency(amount)} VNĐ</b>
                </Col>

                <Col>
                  <CopyButton
                    className='btn btn-outline-primary copy-btn'
                    text={amount}
                    copied={amountCopied}
                    setCopied={setAmountCopied}
                  >
                    <BiCopy /> {amountCopied ? 'Đã chép' : 'Sao chép'}
                  </CopyButton>
                </Col>
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
