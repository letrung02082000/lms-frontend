import MainLayout from 'components/layouts/MainLayout';
import { BiSearchAlt } from 'react-icons/bi';
import styles from './homePage.module.css';

//utils
import useMediaQuery from 'hooks/useMediaQuery';

//components
import HomeSlider from './components/HomeSlider';
// import HomeLeftNavBar from '../components/HomePage/HomeLeftNavBar';
import Logo from '../../components/common/Logo';
import CategorySlider from './components/CategorySlider';
import HotSlider from './components/HotSlider';
import MainServices from './components/MainServices';

//bootstrap
import Footer from '../../components/common/Footer';

const HomePage = () => {
  const isTablet = useMediaQuery('(max-width: 991px)');

  return (
    <MainLayout className={styles.homeContainer}>
      {isTablet ? (
        <div className={styles.logoContainer}>
          <Logo />
          <div
            className={styles.searchIcon}
            onClick={() =>
              alert(
                'Xin lỗi, tính năng này đang được phát triển. Vui lòng quay lại sau!'
              )
            }
          >
            <BiSearchAlt size={25} />
          </div>
        </div>
      ) : null}
      <div className={styles.homeSliderContainer}>
        <HomeSlider />
      </div>

      <div className={styles.categorySliderContainer}>
        <p
          style={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
          }}
        >
          Loại hình
        </p>
        <CategorySlider />
      </div>
      <div className={styles.hotSliderContainer}>
        <HotSlider />
      </div>
      <div className={styles.categorySliderContainer}>
        <MainServices />
      </div>
      <Footer />
    </MainLayout>
  );
};

export default HomePage;
