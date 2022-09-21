import React from 'react'
import { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'

function ConfirmModal({ onConfirm, hideModal, data }) {
  return (
    <Modal show onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>{data?.title || 'Xác nhận'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{data?.body || 'Bạn có muốn tiếp tục thực hiện hành động này?'}</Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={hideModal}>
          Hủy bỏ
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Xác nhận
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ConfirmModal
