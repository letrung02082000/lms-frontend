import React from "react";
import TitleBar from "shared/components/TitleBar";
import styled from "styled-components";
import RegistrationForm from "../components/RegistrationForm";
import LazyImage from 'shared/components/LazyImage';

function PhotocopyPage() {
  return (
    <Styles>
      <TitleBar>Đặt đồng phục</TitleBar>
      <LazyImage src={'/images/uniform/size.jpg'}/>
      <div className="form-body">
        <RegistrationForm />
      </div>
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
`;
