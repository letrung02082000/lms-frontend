import React from 'react';

function Asterisk({color='red', ...props}) {
  const style = {
    ...props?.style,
    color
  }

  return <span {...props} style={style}>*</span>;
}

export default Asterisk;
