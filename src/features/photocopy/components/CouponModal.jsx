import React from 'react'
import { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { copyText } from 'utils/commonUtils';
import CouponImage from './CouponImage';

function CouponModal({ show, setShow }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copyText('THOIDAI10');
    setCopied(true);
  }

  return (
    <Modal show={show} onHide={() => setShow(false)} centered>
      <Modal.Body>
        <CouponImage />
      </Modal.Body>
      <Modal.Footer>
        {/* <Button variant='outline-primary' onClick={handleCopy}>
          {copied ? 'Đã chép' : 'Chép mã'}
        </Button> */}
        <Button onClick={()=>setShow(false)}>Đóng</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CouponModal
