import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import { convertToDateTime } from 'utils/commonUtils';
import motobikeApi from 'api/motobikeApi';
import { toastWrapper } from 'utils';
import MotobikeItem from './MotobikeItem';

function ListModal({ show, setShow }) {
  const [data, setData] = useState(false);
  useEffect(() => {
    motobikeApi
      .getMotobikeListByUser()
      .then((res) => {
        setData(res?.data);
      })
      .catch((e) => {
        return toastWrapper(e?.response?.data?.message);
      });
  }, [show]);

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      scrollable
      backdrop={'static'}
    >
      <Modal.Header closeButton>
        <Modal.Title className='fw-bold text-uppercase'>
          Tin của bạn
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {data.length > 0 ? (
          data.map((item) => {
            return <MotobikeItem {...item} key={item?._id} hasToggleVisbleButton/>;
          })
        ) : (
          <div>
            <p className='text-center mt-3'>Không có dữ liệu</p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant='secondary'
          type='button'
          onClick={() => setShow(false)}
        >
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ListModal;
