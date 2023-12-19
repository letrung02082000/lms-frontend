import React from 'react';
import { Button } from 'react-bootstrap';
import { FaRegCopy, FaCopy } from 'react-icons/fa';

function CopyToClipboardButton({ value, children, ...props }) {
  const [copied, setCopied] = React.useState(false);

  return (
    <Button
      onClick={() => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }}
      {...props}
    >
      {children || copied ? <FaCopy /> : <FaRegCopy />}
    </Button>
  );
}

export default CopyToClipboardButton;
