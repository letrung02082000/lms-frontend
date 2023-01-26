import React from 'react';
import { BiCopy } from 'react-icons/bi';
import styled from 'styled-components';
import { copyText } from 'utils/commonUtils';

function CopyButton({ copied, setCopied, text, ...props }) {
  const handleCopyButton = () => {
    copyText(text);
    setCopied(true);
  };

  return (
    <Styles className='btn btn-outline-primary' onClick={handleCopyButton} type='button' {...props}>
      <BiCopy /> <span className='copy-text'>{copied ? 'Đã chép' : 'Sao chép'}</span>
    </Styles>
  );
}

export default CopyButton;

const Styles = styled.button`
  .copy-text {
    font-size: 0.7rem;
  }
`;
