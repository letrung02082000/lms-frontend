import MainLayout from "components/layouts/MainLayout";
import useMediaQuery from "hooks/useMediaQuery";
import HomeSlider from "../components/HomeSlider";
import Logo from "../../../components/Logo";
import CategorySlider from "../components/CategorySlider";
import HotSlider from "../components/HotSlider";
import MainServices from "../components/MainServices";
import Footer from "../../../components/Footer";

import styled from "styled-components";
import useScrollDirection from "hooks/useScrollDirection";

const HomePage = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const scrollDirection = useScrollDirection();

  return (
    <div>
      <Styles isDesktop={isDesktop} status={scrollDirection}>
        {!isDesktop ? (
          <div className="logoContainer">
            <Logo />
          </div>
        ) : null}
        <div className="mainLayout">
          <div className="homeSliderContainer">
            <HomeSlider />
          </div>
          <div className="hotSliderContainer">
            <HotSlider />
          </div>

          <div className="categorySliderContainer">
            <MainServices />
          </div>
        </div>
      </Styles>
      <Footer />
    </div>
  );
};

const Styles = styled.div`
  .mainLayout {
    margin: ${(props) => (props.isDesktop === true ? "0 15%" : "0 5%")};
  }

  .homeContainer {
    min-height: 150vh;
    position: relative;
  }

  .logoContainer {
    display: flex;
    padding: 0.5rem 0;
    align-items: center;
    justify-content: center;
    background-color: white;
    /* position: sticky;
    z-index: 2000;
    top: ${(props) => (props.status === "down" ? "-150px" : "0px")};
    transition: all; */
    /* transition-duration: 0.25s; */
  }

  .homeSliderContainer {
    margin: 0 auto;
  }

  .categorySliderContainer {
    margin: 1rem auto;
  }

  .hotSliderContainer {
    margin: 1rem auto;
  }

  .searchInput {
    background-color: white;
    display: flex;
    padding: 0.1rem 0 !important;
    margin: 0 auto 1rem;
    border-radius: 5px;
  }

  .logoContainer {
    display: flex;
    align-items: center;
    justify-content: center;
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
    right: 0;
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
`;

export default HomePage;
