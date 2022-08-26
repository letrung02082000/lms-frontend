import React from 'react'
import LazyLoad from 'react-lazyload';

function LazyImage({src, alt, ...props}) {
  return (
    <LazyLoad>
        <img src={src} alt={alt || "no-alt"} width="100%" {...props}/>
    </LazyLoad>
  )
}

export default LazyImage