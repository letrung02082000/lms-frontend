import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectUser } from '../../../store/userSlice'
import styles from './mainservices.module.css'
import ServiceItem from './ServiceItem'
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import useMediaQuery from 'hooks/useMediaQuery'
import { PATH } from 'constants/path'
import { MdOutlineRealEstateAgent, MdRealEstateAgent } from 'react-icons/md'

function MainServices(props) {
  const navigate = useNavigate()
  const user = useSelector(selectUser)
  const [collapsed, setCollapsed] = React.useState(true);

  const navigateTo = (url, state) => {
    navigate(url, state)
  }

  return (
    <div className={styles.container}>
      <div className={styles.itemsContainer}>
        <div className={styles.itemContainer} onClick={() => navigateTo(PATH.DRIVING.ROOT)}>
          <div>
            <img src="/main-icon/motorbike.png" alt="pool" className={styles.mainIcon} />
          </div>
          <p>Sát hạch<br />lái xe</p>
        </div>
        {/* <div className={styles.itemContainer} onClick={() => navigateTo('/uniform')}>
          <div>
            <img src="/main-icon/uniform.png" alt="pool" className={styles.mainIcon} />
          </div>
          <p>Đặt đồng phục</p>
        </div> */}
        <a
          className={styles.itemContainer}
          href="https://dongphuc.isinhvien.vn"
          target={'_blank'}
          rel="noopener noreferrer"
        >
          <div>
            <img src="/main-icon/uniform.png" alt="pool" className={styles.mainIcon} />
          </div>
          <p>
            Đặt đồng phục
          </p>
        </a>
        <a
          className={styles.itemContainer}
          href="https://canho.isinhvien.vn"
          target={'_blank'}
          rel="noopener noreferrer"
        >
          <div>
            <MdRealEstateAgent color='#fff' alt="real-estate" className={styles.mainIcon} />
          </div>
          <p>
            Căn hộ <br /> sinh viên
          </p>
        </a>
        <a
          className={styles.itemContainer}
          href="https://inngay.isinhvien.vn"
          target={'_blank'}
          rel="noopener noreferrer"
        >
          <div>
            <img src="/main-icon/photocopy.png" alt="print" className={styles.mainIcon} />
          </div>
          <p>
            Gửi in ấn
          </p>
        </a>
        {/* <ServiceItem path="photocopy" iconSrc="/main-icon/photocopy.png" alt="photo">
          Gửi in ấn
        </ServiceItem> */}
        <div className={styles.itemContainer} onClick={() => navigateTo('/pool-info')}>
          <div>
            <img src="/main-icon/pool.png" alt="pool" className={styles.mainIcon} />
          </div>
          <p>
            Hồ bơi
          </p>
        </div>

        <a
          className={styles.itemContainer}
          href="https://www.langf.vn/cam-nang-lang-dai-hoc/"
          target={'_blank'}
          rel="noopener noreferrer"
        >
          <div>
            <img src="/main-icon/instruction.png" alt="pool" className={styles.mainIcon} />
          </div>
          <p>
            Cẩm nang <br /> sinh viên
          </p>
        </a>
        {
          !collapsed && <>
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

            <a
              className={styles.itemContainer}
              href="https://www.esinhvien.vn/suc-khoe/"
              target={'_blank'}
              rel="noopener noreferrer"
            >
              <div>
                <img src="/main-icon/health.png" alt="pool" className={styles.mainIcon} />
              </div>
              <p>Sức khoẻ <br /> sinh viên</p>
            </a>

            <a
              className={styles.itemContainer}
              href="https://www.esinhvien.vn/khoa-hoc/"
              target={'_blank'}
              rel="noopener noreferrer"
            >
              <div>
                <img src="/main-icon/course.png" alt="pool" className={styles.mainIcon} />
              </div>
              <p>Khoá học</p>
            </a>

            {/* <div className={styles.itemContainer} onClick={() => navigateTo(PATH.MAINTAIN)}>
              <div>
                <img src="/main-icon/health.png" alt="pool" className={styles.mainIcon} />
              </div>
              <p>
                Sức khỏe <br /> sinh viên
              </p>
            </div> */}
            {/* 
            <div className={styles.itemContainer} onClick={() => navigateTo(PATH.MAINTAIN)}>
              <div>
                <img src="/main-icon/course.png" alt="pool" className={styles.mainIcon} />
              </div>
              <p>Khóa học</p>
            </div> */}

            <a
              className={styles.itemContainer}
              href="https://www.langf.vn/cam-nang-lang-dai-hoc/category/tuyen-dung/"
              target={'_blank'}
              rel="noopener noreferrer"
            >
              <div>
                <img src="/main-icon/job.png" alt="pool" className={styles.mainIcon} />
              </div>
              <p>
                Việc làm <br /> sinh viên
              </p>
            </a>

            <a
              className={styles.itemContainer}
              href="https://www.esinhvien.vn/xe-dich-vu/"
              target={'_blank'}
              rel="noopener noreferrer"
            >
              <div>
                <img src="/main-icon/bus-service.png" alt="pool" className={styles.mainIcon} />
              </div>
              <p>
                Xe dịch vụ
              </p>
            </a>
            {/* 
            <div className={styles.itemContainer} onClick={() => navigateTo(PATH.MAINTAIN)}>
              <div>
                <img src="/main-icon/bus-service.png" alt="pool" className={styles.mainIcon} />
              </div>
              <p>Xe dịch vụ</p>
            </div> */}

            <div className={styles.itemContainer} onClick={() => navigateTo(PATH.YEN_SHARE.ROOT)}>
              <div>
                <img src="/main-icon/bicycle.png" alt="bicycle" className={styles.mainIcon} />
              </div>
              <p>
                Yên share
              </p>
            </div>

            {/* <div className={styles.itemContainer} onClick={() => navigateTo(PATH.MAINTAIN)}>
              <div>
                <img src="/main-icon/application.png" alt="other" className={styles.mainIcon} />
              </div>
              <p>Dịch vụ khác</p>
            </div> */}
          </>
        }
        <button className='border-0 bg-white text-center w-100 mb-3' onClick={() => setCollapsed(!collapsed)}>{!collapsed ? <IoIosArrowUp /> : <IoIosArrowDown />}</button>
      </div>
    </div>
  )
}

export default MainServices
