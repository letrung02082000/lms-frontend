import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectUser } from '../../../store/userSlice'
import styles from './mainservices.module.css'
import ServiceItem from './ServiceItem'

function MainServices(props) {
  const navigate = useNavigate()
  const user = useSelector(selectUser)

  const navigateTo = (url, state) => {
    navigate(url, state)
  }

  return (
    <div className={styles.itemsContainer}>
      <div className={styles.itemContainer} onClick={() => navigateTo('/pool-ticket')}>
        <div>
          <img src="/main-icon/pool.png" alt="pool" className={styles.mainIcon} />
        </div>
        <p>
          Dịch vụ
          <br />
          hồ bơi
        </p>
      </div>
      <div className={styles.itemContainer} onClick={() => navigateTo('/driving-test')}>
        <div>
          <img src="/main-icon/motorbike.png" alt="pool" className={styles.mainIcon} />
        </div>
        <p>Thi sát hạch lái xe</p>
      </div>
      <div className={styles.itemContainer} onClick={() => navigateTo('/jobs')}>
        <div>
          <img src="/main-icon/job.png" alt="pool" className={styles.mainIcon} />
        </div>
        <p>
          Việc làm <br /> sinh viên
        </p>
      </div>
      <ServiceItem path="photocopy" iconSrc="/main-icon/photocopy.png" alt="photo">
        Gửi in ấn
      </ServiceItem>
      <div className={styles.itemContainer} onClick={() => navigateTo('/bicycles')}>
        <div>
          <img src="/main-icon/bicycle.png" alt="bicycle" className={styles.mainIcon} />
        </div>
        <p>
          Xe đạp
          <br />
          công cộng
        </p>
      </div>
      <div className={styles.itemContainer} onClick={() => navigateTo('/uniform')}>
        <div>
          <img src="/main-icon/uniform.png" alt="pool" className={styles.mainIcon} />
        </div>
        <p>Đặt đồng phục</p>
      </div>

      <div className={styles.itemContainer} onClick={() => navigateTo('/guides')}>
        <div>
          <img src="/main-icon/instruction.png" alt="pool" className={styles.mainIcon} />
        </div>
        <p>
          Cẩm nang <br /> sinh viên
        </p>
      </div>

      <div className={styles.itemContainer} onClick={() => navigateTo('/maintain')}>
        <div>
          <img src="/main-icon/health.png" alt="pool" className={styles.mainIcon} />
        </div>
        <p>
          Sức khỏe <br /> sinh viên
        </p>
      </div>

      <div className={styles.itemContainer} onClick={() => navigateTo('/maintain')}>
        <div>
          <img src="/main-icon/course.png" alt="pool" className={styles.mainIcon} />
        </div>
        <p>Khóa học</p>
      </div>

      <a
        className={styles.itemContainer}
        href="https://thiennguyen.app/donate-target/1546845406237835264"
        target={'_blank'}
        rel="noopener noreferrer"
      >
        <div>
          <img src="/main-icon/volunteer.png" alt="pool" className={styles.mainIcon} />
        </div>
        <p>Thiện nguyện</p>
      </a>

      <div className={styles.itemContainer} onClick={() => navigateTo('/bus-registration')}>
        <div>
          <img src="/main-icon/bus-service.png" alt="pool" className={styles.mainIcon} />
        </div>
        <p>Xe dịch vụ</p>
      </div>

      <div className={styles.itemContainer} onClick={() => navigateTo('/maintain')}>
        <div>
          <img src="/main-icon/application.png" alt="other" className={styles.mainIcon} />
        </div>
        <p>Dịch vụ khác</p>
      </div>
    </div>
  )
}

export default MainServices
