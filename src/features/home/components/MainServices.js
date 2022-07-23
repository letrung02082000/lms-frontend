import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUser } from '../../../store/userSlice';
import styles from './mainservices.module.css';

function MainServices(props) {
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const handleBuyTicketButton = () => {
    if (!user.isLoggedIn) {
      navigateTo('/login', { message: 'Vui lòng đăng nhập để tiếp tục!' });
    } else {
      navigateTo('/pool-ticket');
    }
  };

  const navigateTo = (url, state) => {
    navigate(url, state);
  };

  return (
    <div className={styles.itemsContainer}>
      <div
        className={styles.itemContainer}
        onClick={() => navigateTo('/pool-ticket')}
      >
        <div>
          <img
            src='/main-icon/pool.png'
            alt='pool'
            className={styles.mainIcon}
          />
        </div>
        <p>
          Dịch vụ
          <br />
          hồ bơi
        </p>
      </div>
      <div
        className={styles.itemContainer}
        onClick={() => navigateTo('/driving-test')}
      >
        <div>
          <img
            src='/main-icon/motorbike.png'
            alt='pool'
            className={styles.mainIcon}
          />
        </div>
        <p>Thi sát hạch lái xe</p>
      </div>
      <div className={styles.itemContainer} onClick={() => navigateTo('/jobs')}>
        <div>
          <img
            src='/main-icon/job.png'
            alt='pool'
            className={styles.mainIcon}
          />
        </div>
        <p>
          Việc làm <br /> sinh viên
        </p>
      </div>
      <div
        className={styles.itemContainer}
        onClick={() => navigateTo('/maintain')}
      >
        <div>
          <img
            src='/main-icon/photocopy.png'
            alt='pool'
            className={styles.mainIcon}
          />
        </div>
        <p>Gửi in ấn</p>
      </div>
      <div
        className={styles.itemContainer}
        onClick={() => navigateTo('/bicycles')}
      >
        <div>
          <img
            src='/main-icon/bicycle.png'
            alt='bicycle'
            className={styles.mainIcon}
          />
        </div>
        <p>
          Xe đạp
          <br />
          công cộng
        </p>
      </div>
      <div
        className={styles.itemContainer}
        onClick={() => navigateTo('/uniforms')}
      >
        <div>
          <img
            src='/main-icon/uniform.png'
            alt='pool'
            className={styles.mainIcon}
          />
        </div>
        <p>Đặt đồng phục</p>
      </div>

      <div
        className={styles.itemContainer}
        onClick={() => navigateTo('/guides')}
      >
        <div>
          <img
            src='/main-icon/instruction.png'
            alt='pool'
            className={styles.mainIcon}
          />
        </div>
        <p>
          Cẩm nang <br /> sinh viên
        </p>
      </div>

      <div
        className={styles.itemContainer}
        onClick={() => navigateTo('/healths')}
      >
        <div>
          <img
            src='/main-icon/health.png'
            alt='pool'
            className={styles.mainIcon}
          />
        </div>
        <p>
          Sức khỏe <br /> sinh viên
        </p>
      </div>

      <div
        className={styles.itemContainer}
        onClick={() => navigateTo('/maintain')}
      >
        <div>
          <img
            src='/main-icon/course.png'
            alt='pool'
            className={styles.mainIcon}
          />
        </div>
        <p>Khóa học</p>
      </div>

      <a
        className={styles.itemContainer}
        href='https://thiennguyen.app/donate-target/1546845406237835264'
        target={'_blank'}
        rel='noopener noreferrer'
      >
        <div>
          <img
            src='/main-icon/volunteer.png'
            alt='pool'
            className={styles.mainIcon}
          />
        </div>
        <p>Thiện nguyện</p>
      </a>
    </div>
  );
}

export default MainServices;
