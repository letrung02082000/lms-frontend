import React from 'react'
import { BiSearchAlt } from 'react-icons/bi'
import { MdSearch } from 'react-icons/md';
import styled from 'styled-components'

function PlaceHolder(props) {
  return (
    <Styles {...props} onClick={() => props?.setShow(true)}>
      <div className='form-control'>
        <span>{props?.text}</span>
      </div>
      <div className='search-icon mx-3'>
        <MdSearch size={30} />
      </div>
    </Styles>
  );
}

export default PlaceHolder

const Styles = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 0.6rem 1rem;
  border-radius: 10px;
  margin: 0;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;

  .search-icon {
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 0.2rem;
  }

  .placeholder-text {
    width: 85%;

    p {
      width: 100%;
      margin: 0.5rem;
    }
  }
`
