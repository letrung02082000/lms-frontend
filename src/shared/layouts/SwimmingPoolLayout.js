import TitleBar from 'shared/components/TitleBar';
import { useNavigate } from 'react-router-dom';
import styles from './swimmingPoolLayout.module.css';

function SwimmingPoolTutorPage({ children, route }) {
  const navigate = useNavigate();

  const onNavigate = (route) => {
    navigate(route);
  };

  return (
    <div className={styles.container}>
      <TitleBar title='Mua vé hồ bơi' path="/"/>
      <div className={styles.ticketContainer}>
        <div className={styles.headerContainer}>
          <img src='/poolbanner.jpg' alt='banner' />
          <div className={styles.seeMoreButtonContainer}>
            <button
              className={styles.seeMoreButton}
              onClick={() => {
                navigate('/pool-info');
              }}
            >
              Thông tin hồ bơi
            </button>
            <a
              className={styles.seeMoreButton}
              target='_blank'
              rel='noopenner noreferrer'
              href='https://zalo.me/g/fpjnye186'
            >
              Tham gia nhóm
            </a>
          </div>
        </div>

        <div className={styles.ticketFormContainer}>
          <div className={styles.navigationContainer}>
            <button
              className={`${styles.navigationButton} ${
                route == '/ticket' ? styles.ticketButton : null
              }`}
              onClick={() => onNavigate('/pool-ticket', 0)}
            >
              Mua vé tháng
            </button>
            <button
              className={`${styles.navigationButton} ${
                route == '/tutor' ? styles.tutorButton : null
              }`}
              onClick={() => onNavigate('/pool-tutor', 1)}
            >
              Đăng ký học bơi
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default SwimmingPoolTutorPage;
