import React from 'react'

function ZaloLink({ children, tel, className }) {
  return (
    <a
      href={`https://zalo.me/${tel}`}
      target='_blank'
      rel='noopenner noreferrer'
      className={className}
    >
      {children || tel || 'Zalo'}
    </a>
  );
}

export default ZaloLink
