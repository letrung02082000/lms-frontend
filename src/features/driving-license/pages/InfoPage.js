import React from 'react'
import { DRIVING_LICENSE_NUMBER } from 'constants/contact'

import { convertPhoneNumber } from 'utils'
import { useNavigate } from 'react-router-dom'
import { B12_FORM_URL } from 'constants/routes'

function DrivingTestPage() {
  const navigate = useNavigate()

  const navigateTo = url => {
    navigate(url)
  }

  return (
    <div>
      <div>
        <img src="/drivingbanner.jpg" alt="driving banner"/>
      </div>

      <div>
        <h3>Đăng ký đơn giản</h3>
        <div>
          <img src="/one.png" alt="img" />
        </div>
        <h5>Điền đơn đăng ký dự thi</h5>
        <div style={{ display: 'flex' }}>
          <button onClick={() => navigateTo('/driving-instruction')}>
            Hướng dẫn
          </button>
          <button onClick={() => navigateTo('/driving-registration')}>
            Điền đơn
          </button>
        </div>
        <div>
          <div className="d-flex flex-column align-items-center p-3 text-center">
            <p>Đăng ký dự thi B1, B2 nhận ngay ưu đãi dành cho sinh viên <a href={B12_FORM_URL} target='_blank' rel='noopener noreferrer'>tại đây</a></p>
          </div>
        </div>
        <div>
          <img src="/two.png" alt="img" />
        </div>
        <h5>Đóng phí dự thi</h5>
        <p className='text-center'>Thanh toán online hoặc trực tiếp</p>
        <div>
          <img src="/three.png" alt="img" />
        </div>
        <h5>Chờ duyệt và xác nhận ngày thi</h5>
        <div>
          <img src="/four.png" alt="img" />
        </div>
        <h5>Đi thi</h5>
        <div>
          <button
            onClick={() => navigateTo('/driving-registration')}
          >
            Đăng ký ngay
          </button>
        </div>
        <p>Liên hệ hỗ trợ</p>
        <div>
          <a
            href={`tel:${convertPhoneNumber(DRIVING_LICENSE_NUMBER, '+84')}`}
            target="_blank"
            rel="noreferer noreferrer"
          >
            Gọi ngay
          </a>
          <a
            href={`https://zalo.me/${DRIVING_LICENSE_NUMBER}`}
            target="_blank"
            rel="noreferer noreferrer"
          >
            Zalo
          </a>
        </div>
      </div>
    </div>
  )
}

export default DrivingTestPage
