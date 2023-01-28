import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import { convertToDateTime } from 'utils/commonUtils';
import motobikeApi from 'api/motobikeApi';
import { checkLogin, toastWrapper } from 'utils';
import MotobikeItem from './MotobikeItem';
import { useSelector } from 'react-redux';
import { selectUser } from 'store/userSlice';
import { Navigate } from 'react-router-dom';

function ListModal({ show, setShow }) {
  const [data, setData] = useState(false);
  const user = useSelector(selectUser)

  useEffect(()=> {
    checkLogin();
  }, [show])

  useEffect(() => {
    motobikeApi
      .getMotobikeListByUser()
      .then((res) => {
        setData(res?.data);
      })
      .catch((e) => {
        const errMsg = e?.response?.data?.message || 'Đã có lỗi xảy ra';
        console.log(errMsg)
        // toastWrapper(errMsg, 'error');
      });
  }, [show]);

  if(!user?.isLoggedIn && show) {
    return <Navigate to='/login'/>
  }

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
