import { MdArrowBack } from 'react-icons/md'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './titleBar.module.css'

import useMediaQuery from 'hooks/useMediaQuery'
import styled from 'styled-components'

function TitleBar(props) {
  const navigate = useNavigate()
  const isTablet = useMediaQuery('(max-width: 768px)')
  const bcolor = props?.backgroundColor || '#019f91'

  const goBack = () => {
    if (props?.path) {
      return navigate(props?.path)
    }

    if (!window.location.key) {
      return navigate('/')
    }

    navigate(-1)
  }

  return (
    <div className={styles.titleBar} style={{ backgroundColor: bcolor }}>
      <TitleBarStyled isTablet={isTablet}>
        <button onClick={goBack} className={styles.goBackButton}>
          <MdArrowBack size={25} color="#fff" />
        </button>
      </TitleBarStyled>
      <p className={styles.pageTitle}>{props?.title || props?.children || ''}</p>
    </div>
  )
}

export default TitleBar

const TitleBarStyled = styled.div`
  margin: ${props => (props.isTablet === true ? '0 0%' : '0 15%')};
`
