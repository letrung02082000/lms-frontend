import React, { useEffect } from 'react';
import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

function GcnModal({show, setShow, setInfo}) {
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  useEffect(() => {
    setName('');
    setSchool('');
  }, [show]);

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      scrollable={true}
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Thông tin của bạn</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form.Label>Tên của bạn</Form.Label>
        <Form.Control type='text' value={name} onChange={(e) => setName(e.target.value)} />
        <Form.Label className='mt-3'>Bạn học trường nào?</Form.Label>
        <Form.Control type='text' value={school} onChange={(e) => setSchool(e.target.value)} />
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant='success'
          onClick={() => {
            setInfo({name, school});
            setShow(false);
          }}
        >
          Tạo GCN
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default GcnModal;
