import React from 'react'
import LazyLoad from 'react-lazyload';

function LazyImage({src, alt, height}) {
  return (
    <LazyLoad height={height || 200}>
        <img src={src} alt={alt || "no-alt"} width="100%"/>
    </LazyLoad>
  )
}

export default LazyImage