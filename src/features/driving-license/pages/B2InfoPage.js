import TitleBar from 'components/common/TitleBar'
import React from 'react'
import { Image } from 'react-bootstrap';
import styled from 'styled-components'

function B2InfoPage() {
  return (
    <>
      <TitleBar title="Hướng dẫn B1-B2"/>
      <Styles>
        <Image src={'/driving-license/b2-banner.jpg'} alt="b2-banner" fluid/>
        <Image src={'/driving-license/b2-info.jpg'} alt="b2-info" fluid/>
      </Styles>
    </>
  );
}

export default B2InfoPage

const Styles = styled.div`
    width: 100%;
`