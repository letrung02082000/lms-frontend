import React, { useState } from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import styled from 'styled-components';

function OrderPreview({show, setShow, ...props}) {
  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      scrollable={true}
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Thông tin đơn hàng</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Styles>
          <Row>
            <Col xs={6}>
              <div className='custom-label'>Khách hàng</div>
              <div>{props?.name}</div>
            </Col>
            <Col xs={6}>
              <div className='custom-label'>Điện thoại</div>
              <div>{props?.tel}</div>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <div className='custom-label'>Zalo</div>
              <div>{props?.zalo}</div>
            </Col>
            <Col xs={6}>
              <div className='custom-label'>Email</div>
              <div>{props?.email || 'Không có'}</div>
            </Col>
          </Row>
          <Row>
            <div className='custom-label'>Thể loại</div>
            <div>{props?.category?.label}</div>
          </Row>
          <Row>
            <div className='custom-label'>Nhận hàng tại</div>
            <div>
              {props?.deliveryType === 'home'
                ? props?.address?.label
                : props?.office?.label}
            </div>
          </Row>
          <Row>
            <div className='custom-label'>Hướng dẫn in</div>
            <div>{props?.instruction}</div>
          </Row>
          <Row>
            <div className='custom-label'>Danh sách tài liệu</div>
            <div>
              {props?.uploadType === 'file'
                ? props?.document?.map((_item, _idx) => (
                    <div>{`${_idx + 1}. ${_item?.fileName}`}</div>
                  ))
                : props?.document?.map((_item, _idx) => (
                    <div>{`${_idx + 1}. ${_item?.fileUrl}`}</div>
                  ))}
            </div>
          </Row>
        </Styles>
      </Modal.Body>

      <Modal.Footer>
        <Button variant='secondary' onClick={() => setShow(false)}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default OrderPreview;

const Styles = styled.div`
    .custom-label {
      font-size: 1rem;
      font-weight: 500;
      margin: 1.5rem 0 0;
    }
`
