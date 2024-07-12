import React from 'react'
import { MdKeyboardArrowRight } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

function Item({ children, path, onClick }) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (path) {
      navigate(path)
    }

    if (onClick) {
      onClick()
    }
  }

  return (
    <Styles>
      <button className="btn my-2 d-flex justify-content-between w-100 p-3" onClick={handleClick}>
        <span className='fw-bold'>{children}</span>
        <MdKeyboardArrowRight size={25}/>
      </button>
    </Styles>
  )
}

export default Item

const Styles = styled.div`
  button {
    background-color: ${({theme}) => theme.colors.whiteSmoke};;
  }
`
