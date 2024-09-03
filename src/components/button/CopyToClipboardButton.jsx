import React from 'react';
import { Button } from 'react-bootstrap';
import { BiCopy } from 'react-icons/bi';

function CopyToClipboardButton({ value, children, className, ...props }) {
  const [copied, setCopied] = React.useState(false);

  return (
    <button
      className={`m-0 p-0 border-0 text-primary bg-white ${className}`}
      onClick={() => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }}
      {...props}
    >
      {children || <BiCopy />}
    </button>
  );
}

export default CopyToClipboardButton;
