import React from 'react'

function ZaloLink({children, tel}) {
  return (
    <a
      href={`https://zalo.me/${tel}`}
      target='_blank'
      rel='noopenner noreferrer'
    >
      {children || tel || 'Zalo'}
    </a>
  );
}

export default ZaloLink