import { MdArrowBack } from 'react-icons/md'
import { useNavigate, useLocation } from 'react-router-dom'
import styled from 'styled-components'

function TitleBar(props) {
  const navigate = useNavigate()
  // const isTablet = useMediaQuery('(max-width: 768px)')
  const bcolor = props?.backgroundColor || '#019f91'

  const goBack = () => {
    if (props?.path) {
      return navigate(props?.path,  { state: props?.state })
    }

    navigate(-1)
  }

  return (
    <Wrapper>
      <BackButton size={25} onClick={goBack}/>
      <Title>{props?.title || props?.children || ''}</Title>
    </Wrapper>
  )
}

export default TitleBar

const Wrapper = styled.div`
  background-color: ${({theme}) => theme.color.header};
  width: 100%;
  padding: 1rem 0;
`

const BackButton = styled(MdArrowBack)`
  color: ${({theme}) => theme.color.button.text};
  cursor: pointer;
  position: absolute;
  margin: 0 1rem;
`

const Title = styled.p`
  color:  ${({theme}) => theme.color.text};
  font-weight: bold;
  margin: 0;
  text-align: center;
  text-transform: uppercase;
`