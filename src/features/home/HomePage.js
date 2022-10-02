import MainLayout from 'shared/layouts/MainLayout'
import { BiSearchAlt } from 'react-icons/bi'
import useMediaQuery from 'hooks/useMediaQuery'
import HomeSlider from './components/HomeSlider'
import Logo from '../../shared/components/Logo'
import CategorySlider from './components/CategorySlider'
import HotSlider from './components/HotSlider'
import MainServices from './components/MainServices'
import Footer from '../../shared/components/Footer'

import styled from 'styled-components'
import useScrollDirection from 'hooks/useScrollDirection'

const HomePage = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const scrollDirection = useScrollDirection()

  return (
    <Styles isDesktop={isDesktop} status={scrollDirection}>
      <MainLayout className="homeContainer">
        {!isDesktop ? (
          <div className="logoContainer">
            <Logo />
            <div
              className="searchIcon"
              onClick={() => alert('Xin lỗi, tính năng này đang được phát triển. Vui lòng quay lại sau!')}
            >
              <BiSearchAlt size={25} />
            </div>
          </div>
        ) : null}
        <div className="mainLayout">
          <div className="homeSliderContainer">
            <HomeSlider />
          </div>

          <div className="categorySliderContainer">
            <p
              style={{
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }}
            >
              Loại hình
            </p>
            <CategorySlider />
          </div>

          <div className="hotSliderContainer">
            <HotSlider />
          </div>

          <div className="categorySliderContainer">
            <MainServices />
          </div>

          <Footer />
        </div>
      </MainLayout>
    </Styles>
  )
}

const Styles = styled.div`
  .mainLayout {
    margin: ${props => (props.isDesktop === true ? '0 15%' : '0 0%')};
  }

  .homeContainer {
    min-height: 150vh;
    position: relative;
  }

  .logoContainer {
    display: flex;
    height: 4.5rem;
    align-items: center;
    justify-content: center;
    background-color: white;

    position: sticky;
    z-index: 2000;
    top: ${props => (props.status === 'down' ? '-150px' : '0px')};
    transition: all;
    transition-duration: 0.25s;
  }

  .homeSliderContainer {
    width: 95%;
    margin: 0 auto;
  }

  .categorySliderContainer {
    width: 95%;
    margin: 1rem auto;
  }

  .hotSliderContainer {
    width: 95%;
    margin: 1rem auto;
  }

  .searchInput {
    width: 95%;
    background-color: white;
    display: flex;
    padding: 0.1rem 0 !important;
    margin: 0 auto 1rem;
    border-radius: 5px;
  }

  .searchIcon {
    width: 2.5rem;
    height: 2.5rem;
    padding: 0.5rem;
    margin: 0 1rem;
    background-color: rgb(226, 225, 225);
    border-radius: 50px;
    position: absolute;
    top: 1rem;
    right: 0rem;
  }

  .searchIcon svg {
    width: 100%;
    height: 100%;
    color: var(--primary);
  }

  .slogan {
    font-weight: bold;
    font-size: 0.8rem;
    color: #ee6a26;
    background-color: white;
    width: fit-content;
    border-radius: 50px;
    padding: 0 0.5rem;
    margin: 0.5rem 0;
  }
`

export default HomePage
