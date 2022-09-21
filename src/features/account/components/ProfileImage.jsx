import React from 'react'
import styled from 'styled-components'

function ProfileImage({ src }) {
  return (
    <Styles>
      <img src={src || '/common/avatar.png'} alt="profile" />
    </Styles>
  )
}

export default ProfileImage

const Styles = styled.div`
  width: 100%;
  padding: 1rem;
  display: flex;
  justify-content: center;

  img {
    width: 7rem;
    height: 7rem;
    overflow: hidden;
    border-radius: 50%;
  }
`
