import React from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './infoPage.module.css'

import TitleBar from 'components/TitleBar'
import RedirectURL from 'components/RedirectURL'
import { GUEST_HOUSE_URL } from 'constants/routes'

function GuestHouseInfoPage() {
  const navigate = useNavigate()

  const handleSignupButton = () => {
    navigate('/guest-house-user')
  }

  return (
    <div className={styles.container}>
      {/* <TitleBar title="Thông tin nhà khách" backgroundColor="#01787A" /> */}
      <img className={styles.banner} src="/guesthouse.jpg" alt="guest-house" style={{ width: '100%' }} />

      <div className={styles.body}>
        <h2 className={styles.title}>Thông tin chung</h2>
        <p style={{ textAlign: 'center' }}>Nhà Khách Đại Học Quốc Gia TP.HCM</p>
        <p style={{ textAlign: 'center' }}>Địa chỉ: Đ. Nguyễn Du, Đông Hoà, Dĩ An, Bình Dương</p>
        <p style={{ textAlign: 'center' }}>
          Thông tin liên hệ
          <br /> 02837.244.222 / 0977.742.191 ( Ms.Hà)
          <br />
          hoặc
          <br />
          0981.190.069 ( Ms.Ngọc)
        </p>
        <div className='d-flex flex-column align-items-center'>
          <a className='btn btn-outline-primary mb-3' href={GUEST_HOUSE_URL} rel='noopener' target='_blank'>Trang thông tin</a>
          <button className='btn btn-primary' onClick={handleSignupButton}>Đặt phòng ngay</button>
        </div>
      </div>
      <div className={styles.body}>
        <h2 className={styles.title}>Bảng giá phòng</h2>
        <h3>&#10024; Phòng máy lạnh</h3>

        <ul>
          <li>
            <h5>Phòng đơn</h5>
            <p>&#10024; 1 giường đôi</p>
            <p>&#128142; Đơn giá: 300 000 đồng</p>
            <p>&#128073; Số lượng: 1-2 người</p>
          </li>
          <li>
            <h5>Phòng đôi 1</h5>
            <p>&#10024; 2 giường đôi</p>
            <p>&#128142; Đơn giá: 400 000 đồng</p>
            <p>&#128073; Số lượng: 1-2 người</p>
          </li>
          <li>
            <h5>Phòng đôi 2</h5>
            <p>&#10024; 1 giường đôi, 1 giường đơn</p>
            <p>&#128142; Đơn giá: 400 000 đồng</p>
            <p>&#128073; Số lượng: 1-2 người</p>
          </li>
          <li>
            <h5>Phòng ba</h5>
            <p>&#10024; 1 giường đôi, 2 giường đơn</p>
            <p>&#128142; Đơn giá: 600 000 đồng</p>
            <p>&#128073; Số lượng: 1-3 người</p>
          </li>
        </ul>
      </div>
      <div className={styles.body}>
        <h2 className={styles.title}>Quy trình nhận và trả phòng</h2>
        <h5 className={styles.text}>Nhận phòng</h5>
        <ul>
          <li>Xuất trình giấy tờ tại quầy lễ tân</li>
          <li>Cập nhật thông tin</li>
          <li>Giao chìa khóa và nhận phòng</li>
        </ul>
        <h5 className={styles.text}>Trả phòng</h5>
        <ul>
          <li> Quý khách trả phòng trước 12g00</li>
          <li>
            Nếu quý khách trả phòng sau 12g00 phụ thu như sau:
            <br />
            Từ 12g05-15g00, phụ thu 30% giá phòng
            <br />
            Từ 15h05-18h00, phụ thu 50% giá phòng
            <br />
            Từ 18h05, phụ thu 100% giá phòng
          </li>
          <li>Quý khách được miễn phí 1 chai nước/người/ngày và sử dụng miễn phí hồ bơi, phòng tập gym.</li>
        </ul>
      </div>
    </div>
  )
}

export default GuestHouseInfoPage
