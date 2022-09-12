import React from 'react';
import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

function InstructionModal({ onConfirm, hideModal, data }) {

  return (
    <Modal show onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Hướng dẫn in</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>1. Quy trình in chỉ trong 2 giờ</h5>
      </Modal.Body>
    </Modal>
  );
}

export default InstructionModal;
