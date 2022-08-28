import React from "react";
import { useState } from "react";
import { SearchPlaceHolder } from "shared/components/search-bar";
import TitleBar from "shared/components/TitleBar";
import styled from "styled-components";
import CreationForm from "../components/CreationForm";
import SearchModal from "../../../shared/components/form/SearchModal";

function PhotocopyPage() {
  const [show, setShow] = useState(false);

  return (
    <Styles>
      <TitleBar>Gửi in ấn</TitleBar>
      <SearchPlaceHolder
        className="search-placeholder"
        text="Tra cứu tình trạng đơn hàng"
        onClick={() => setShow(true)}
      />
      <div className="form-body">
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
`;
