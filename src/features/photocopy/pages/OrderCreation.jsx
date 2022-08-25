import React from 'react';
import TitleBar from 'shared/components/TitleBar';
import styled from 'styled-components';
import CreationForm from '../components/CreationForm';

function OrderCreation() {
  return (
    <Styles>
      <TitleBar>Gửi in ấn</TitleBar>
      <div className='form-body'>
        <CreationForm />
      </div>
    </Styles>
  );
}

export default OrderCreation;

const Styles = styled.div`  
  .form-body {
    width: 95%;
    margin: 1rem auto;
    background-color: white;
    padding: 1rem;
    border-radius: 15px;
  }
`;
