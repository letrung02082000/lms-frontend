import { MdArrowBack } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

function TitleBar(props) {
  const navigate = useNavigate()

  const goBack = () => {
    if (props?.path) {
      return navigate(props?.path, { state: props?.state })
    }

    navigate(-1)
  }

  return (<Wrapper>
    <BackButton size={25} onClick={goBack} />
    <Title>{props?.title || props?.children || ''}</Title>
  </Wrapper>)
}

export default TitleBar

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.isDesktop ? theme.color.header.background.desktop : theme.color.header.background.mobile};
  width: 100%;
  padding: 1rem 0;
`

const BackButton = styled(MdArrowBack)`
  color: ${({ theme }) => theme.isDesktop ? theme.color.header.button.desktop : theme.color.header.button.mobile};
  cursor: pointer;
  position: absolute;
  margin: 0 1rem;
`

const Title = styled.p`
  color:  ${({ theme }) => theme.color.header.text.mobile};
  font-weight: bold;
  margin: 0;
  text-align: center;
  text-transform: uppercase;
`