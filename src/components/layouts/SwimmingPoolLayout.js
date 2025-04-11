import TitleBar from 'components/TitleBar'
import { useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { SWIMMING_POOL_URL } from 'constants/routes'

function SwimmingPoolTutorPage({ children, route }) {
  const navigate = useNavigate()

  const onNavigate = route => {
    navigate(route)
  }

  return (
    <div className={styles.container}>
      <div className={styles.ticketContainer}>
        <div className={styles.headerContainer}>
          <img src="/poolbanner.jpg" alt="banner" />
          <div className={styles.seeMoreButtonContainer}>
            <a className='btn btn-outline-primary' href={SWIMMING_POOL_URL} target='_blank' rel='noopener noreferrer'>
              Trang thông tin
            </a>
            <a
              className='btn btn-primary ms-5'
              target="_blank"
              rel="noopenner noreferrer"
              href="https://zalo.me/g/fpjnye186"
            >
              Nhóm học bơi Zalo
            </a>
          </div>
        </div>

        <div className={styles.ticketFormContainer}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default SwimmingPoolTutorPage
