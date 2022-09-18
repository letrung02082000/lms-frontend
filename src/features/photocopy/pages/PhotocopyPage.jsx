import React from 'react';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { ModalProvider, useModal } from 'react-modal-hook';
import { SearchPlaceHolder } from 'shared/components/search-bar';
import TitleBar from 'shared/components/TitleBar';
import styled from 'styled-components';
import CreationForm from '../components/CreationForm';
import InstructionModal from '../components/InstructionModal';
import SearchModal from '../components/SearchModal';

function PhotocopyPage() {
  const [show, setShow] = useState(false);
  const [showModal, hideModal] = useModal(() => <InstructionModal hideModal={hideModal}/>);

  const openInstruction = () => {
    showModal();
  }

  return (
    <Styles>
      <TitleBar>Gửi in ấn</TitleBar>

      <SearchPlaceHolder
        className='search-placeholder'
        text='Tra cứu tình trạng đơn hàng'
        onClick={() => setShow(true)}
      />
      <div className='action-btn-group d-flex justify-content-center'>
        <button
          className='btn btn-outline-primary instruction-btn'
          onClick={openInstruction}
        >
          <b>
            Xem hướng dẫn tạo đơn hàng để được xử lý nhanh chỉ trong 2
            giờ
          </b>
        </button>
      </div>
      <div className='form-body'>
        <CreationForm />
      </div>
      <SearchModal show={show} handleClose={() => setShow(false)} />
    </Styles>
  );
}

export default PhotocopyPage;

const Styles = styled.div`
  .form-body {
    width: 95%;
    margin: 1rem auto;
    background-color: white;
    padding: 1rem;
    border-radius: 15px;
  }

  .search-placeholder {
    width: 95%;
    margin: 1rem auto;
    top: 0.5rem;
    z-index: 100;
  }

  .action-btn-group {
    width: 95%;
    margin: 0 auto;
  }
`;
