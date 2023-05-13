import React from 'react'
//swiper
import { Pagination, Autoplay } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react'
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
//styles
import './homeSlider.css'
//media query
import useMediaQuery from '../../../hooks/useMediaQuery'
//banner images
import { BusBanner, UniformBanner, PhotocopyBanner} from 'assets/images'
import LazyImage from 'components/LazyImage'

function HomeSlider() {
  const isMobile = useMediaQuery('(max-width: 767px)')

  return (
    <>
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{
          dynamicBullets: true,
          clickable: true
        }}
        autoplay={{
          delay: 3500,
          disableOnInteraction: true
        }}
        slidesPerView={1}
        loop={true}
        autoHeight={true}
        className="mySwiper"
      >
        <SwiperSlide>
          <img src={PhotocopyBanner} alt="Banner In ấn" />
        </SwiperSlide>

        <SwiperSlide>
          <img src={UniformBanner} alt="Banner Đồng phục" />
        </SwiperSlide>
        
        <SwiperSlide>
          <img src={BusBanner} alt="Banner Xe dịch vụ" />
        </SwiperSlide>
      </Swiper>
    </>
  )
}

export default HomeSlider
