import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { updateShow } from 'store/navSlice'
import styles from './swimmingPoolInfoPage.module.css'

//swiper
import { Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from 'swiper/react'

import { SWIMMING_POOL_URL } from 'constants/routes'

function SwimmingPoolInfoPage() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(updateShow(false))
  }, [])

  return (
    <div className={styles.container}>
      <Swiper
        modules={[Pagination]}
        pagination={{
          dynamicBullets: true,
          clickable: true
        }}
        slidesPerView={1}
        loop={true}
        autoHeight={false}
        autoplay
      >
        <SwiperSlide>
          <img src="/poolbanner.jpg" alt="banner" style={{ borderRadius: '0' }} />
        </SwiperSlide>
      </Swiper>
      {/* <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <a className={styles.signupButton} href={SWIMMING_POOL_URL} target='_blank' rel='noopener noreferrer'>
          Trang thông tin
        </a>
        <button className={styles.signupButton} onClick={() => navigate('/pool-tutor')}>
          Đăng ký học bơi
        </button>
      </div> */}
      <div className='mt-5'>
        <h2 className='h4 text-center fw-bold text-uppercase'>Thông tin chung</h2>
        <p className='text-center'>Hồ bơi Nhà Khách ĐHQG-HCM</p>
        <p className='text-center'>Địa chỉ: Đ. Nguyễn Du, Đông Hoà, Dĩ An, Bình Dương</p>
        <p className='text-center'>
          Liên hệ hỗ trợ/đăng ký học bơi: 
          0981.190.069 ( Ms.Ngọc)
        </p>
      </div>
      <div className={styles.bodyContainer}>
        <h3>
          Lý do bạn nên chọn hồ bơi <br />
          nhà khách ĐHQG
        </h3>
        <div>
          <img className={styles.numberIcon} src="/one.png" alt="img" />
        </div>
        <h5>
          Cơ sở vật chất hiện đại
          <br />
          Dịch vụ tiện nghi
        </h5>
        <ul>
          <li>
            <p className={styles.payText}>Có mái che nắng</p>
            <img className={styles.payIcon} src="/swimmingpool.png" alt="pay-icon" />
          </li>
          <li>
            <p className={styles.payText}>Cho thuê đồ bơi</p>
            <img className={styles.payIcon} src="/swimmingsuit.png" alt="pay-icon" />
          </li>
          <li>
            <p className={styles.payText}>Giáo viên hướng dẫn</p>
            <img className={styles.payIcon} src="/swimmingtutor.jpg" alt="pay-icon" />
          </li>
        </ul>
        <div>
          <img className={styles.numberIcon} src="/two.png" alt="img" />
        </div>
        <h5>Vị trí thuận tiện</h5>
        <ul>
          <li>
            <p className={styles.payText}>
              Gần ký túc xá
              <br />
              ĐHQG
            </p>
            <img className={styles.payIcon} src="/dormitory.png" alt="pay-icon" />
          </li>
          <li>
            <p className={styles.payText}>
              Có các tuyến
              <br />
              xe buýt đi qua
            </p>
            <img className={styles.payIcon} src="/bus.jpg" alt="pay-icon" />
          </li>
        </ul>
        <div>
          <img className={styles.numberIcon} src="/three.png" alt="img" />
        </div>
        <h5>Giá cả phải chăng</h5>
        <div className={styles.iconContainer}>
          <p className={styles.payText}>25.000đ/lượt</p>
          <p className={styles.payText}>Vé tháng tiết kiệm</p>
          <img className={styles.payIcon} src="/savemoney.png" alt="pay-icon" />

          <p className={styles.payText}>600.000đ/tháng/30 lượt</p>
          <p className={styles.payText}>+1 lượt bơi miễn phí</p>
        </div>

        <div className='mt-3'>
          <a className='btn btn-primary' href={SWIMMING_POOL_URL} target='_blank' rel='noopener noreferrer'>
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
    </div>
  )
}

export default SwimmingPoolInfoPage
