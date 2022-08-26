import React from 'react';
import { BiSearch } from 'react-icons/bi';
import styled from 'styled-components';

function PlaceHolder(props) {
  return (
    <Styles {...props}>
      <div className='placeholder-text'>
        <p className='form-text'>{props?.text}</p>
      </div>
      <div className='search-icon'>
        <BiSearch size={25} />
      </div>
    </Styles>
  );
}

export default PlaceHolder;

const Styles = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 0.6rem 1rem;
  border-radius: 5px;
  border: 2px solid var(--primary);

  .search-icon {
    color: var(--primary);
  }

  .placeholder-text {
    width: 85%;

    p {
      width: 100%;
      margin: 0;
    }
  }
`;
