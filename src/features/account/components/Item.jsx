import React from 'react'
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
      <button className="btn" onClick={handleClick}>
        <span>{children}</span>
        <i class="bi bi-chevron-right"></i>
      </button>
    </Styles>
  )
}

export default Item

const Styles = styled.div`
  button {
    display: flex;
    justify-content: space-between;
    background-color: white;
    padding: 0.7rem 1rem;
    margin-top: 0.2rem;
    width: 100%;
  }
`
