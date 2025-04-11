import React from 'react'
import { FiChevronRight } from 'react-icons/fi'
function Tool(props) {
  return (
    <div onClick={props.handle}>
      <span>{props.title}</span>
      <FiChevronRight style={{ float: 'right' }} />
    </div>
  )
}

export default Tool
