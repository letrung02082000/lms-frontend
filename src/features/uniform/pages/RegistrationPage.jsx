import React from 'react'
import TitleBar from 'components/TitleBar'
import styled from 'styled-components'
import RegistrationForm from '../components/RegistrationForm'
import LazyImage from 'components/LazyImage'

function PhotocopyPage() {
  return (
    <Styles>
      <LazyImage src={'/images/uniform/size.jpg'} />
      <div className="form-body">
        <RegistrationForm />
      </div>
    </Styles>
  )
}

export default PhotocopyPage

const Styles = styled.div`
  .form-body {
    margin: 1rem auto;
  }
`
