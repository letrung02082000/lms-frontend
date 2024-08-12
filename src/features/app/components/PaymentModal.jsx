import React, { useEffect } from 'react';
import { useState } from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { BiCopy } from 'react-icons/bi';
import CopyButton from 'components/button/CopyButton';
import styled from 'styled-components';
import { copyText, formatCurrency } from 'utils/commonUtils';
import storeApi from 'api/storeApi';
import Loading from 'components/Loading';

function PaymentModal({ storeId, show, setShow, amount, desc, onClose, defaultPaymentInfo }) {
  const [copied, setCopied] = useState(false);
  const [contentCopied, setContentCopied] = useState(false);
  const [amountCopied, setAmountCopied] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState(defaultPaymentInfo || null);

  const handleClose = () => {
    setIsPaid(true);
    setShow(false);
    onClose();
  };

  useEffect(() => {
    setPaymentInfo(null);
    setLoading(true);
    
    if(storeId) {
      storeApi
      .getStoreById(storeId)
      .then((res) => {
        setPaymentInfo(res?.data?.paymentInfo)
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
    }
  }, [storeId]);
  

  return (
    <>
      <Modal
        show={show}
        onHide={() => setShow(false)}
        scrollable={true}
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Thông tin thanh toán</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {!loading ? (
            !paymentInfo ? (
              <p>Cửa hàng chưa cập nhật thông tin thanh toán</p>
            ) : (
              <ModalStyles>
                <Row className='justify-content-center'>
                  <Col md={7}>
                    <img
                      src={`https://img.vietqr.io/image/${paymentInfo?.bankCode}-${paymentInfo?.bankAccount}-e59ZziA.jpg?accountName=${paymentInfo?.bankOwner}&amount=${amount}&addInfo=${desc}`}
                      alt='vietqr'
                      className='w-100'
                    />
                  </Col>
                  <Col>
                    <div className='text-uppercase fw-bold mb-3'>
                      {paymentInfo?.bankName}
                    </div>
                    <div className='mb-2'>
                      Chủ tài khoản
                      <br />
                      <b>{paymentInfo?.bankOwner?.toUpperCase()}</b>
                    </div>
                    <Row className='mb-2'>
                      <Col xs={12}>
                        Số tài khoản
                        <br />
                        <b>{paymentInfo?.bankAccount}{' '}</b>
                        <CopyButton
                          text={paymentInfo?.bankAccount}
                          copied={copied}
                          setCopied={setCopied}
                        >
                          <BiCopy />
                        </CopyButton>
                      </Col>
                      <Col>
                        
                      </Col>
                    </Row>
                    <Row className='mb-2'>
                      <Col xs={12}>
                        Nội dung
                        <br />
                        <b>{paymentInfo?.description || desc}{' '}</b>
                        <CopyButton
                          text={desc}
                          copied={contentCopied}
                          setCopied={setContentCopied}
                        >
                          <BiCopy />
                        </CopyButton>
                      </Col>
                      <Col>
                        
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12}>
                        Số tiền
                        <br />
                        <b>{formatCurrency(amount)} VNĐ{' '}</b>
                        <CopyButton
                          text={amount}
                          copied={amountCopied}
                          setCopied={setAmountCopied}
                        >
                          <BiCopy />
                        </CopyButton>
                      </Col>
                      <Col>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </ModalStyles>
            )
          ) : (
            <Loading />
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PaymentModal;

const ModalStyles = styled.div`
`;
