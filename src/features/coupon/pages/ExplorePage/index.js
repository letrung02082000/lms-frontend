import React, { useState, useEffect } from "react";

import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { Pagination, Autoplay, Scrollbar } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react/swiper-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import CouponApi from "api/couponApi";
import Coupon from "./components/Coupon";
import { services } from "../../shared/constant";
import useMediaQuery from "hooks/useMediaQuery";
import MainLayout from "shared/layouts/MainLayout";
import CouponDetailModal from "./components/CouponDetailModal";

// TODO:
// Use button. Store coupon to redux, navigate to page use coupon
// Use swiper
// Fetch data from API

const mockImageBanner = ["/mockupcoupon.jpg"];

const ExplorePage = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const currentUser = useSelector((state) => state.user || {});

  const [hotCoupons, setHotCoupons] = useState([]);
  const [myCoupons, setMyCoupons] = useState([]);
  const [currentSelectedService, setCurrentSelectedService] = useState("1");
  const [serviceCoupons, setServiceCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState({});
  const [showCouponDetail, setShowCouponDetail] = useState(false);

  useEffect(() => {
    const fetchHotCoupons = async () => {
      try {
        const response = await CouponApi.getCouponAvailable();
        console.log("Fetch hot coupons successfully: ", response.data);
        setHotCoupons(response.data);
      } catch (error) {
        console.log("Failed to fetch hot coupons: ", error);
      }
    };

    const fetchMyCoupons = async () => {
      try {
        const userId = currentUser.data.id;
        const response = await CouponApi.getMyCoupon(userId);

        const couponIds = response.data.map((item) => item.coupon);

        let myCouponsDetail = [];
        for (let couponId of couponIds) {
          const couponDetail = await CouponApi.getCouponById(couponId);
          myCouponsDetail.push(couponDetail.data);
        }

        console.log("Fetch my coupons successfully: ", myCouponsDetail);
        setMyCoupons(myCouponsDetail);
      } catch (error) {
        console.log("Failed to fetch my coupons: ", error);
      }
    };

    const fetchServiceCoupons = async (serviceId) => {
      try {
        const response = await CouponApi.getCouponByType(serviceId || 1);
        console.log(
          `Fetch service coupons successfully type ${currentSelectedService}: `,
          response.data
        );
        setServiceCoupons(response.data);
      } catch (error) {
        console.log(
          `Failed to fetch service coupons type ${currentSelectedService}: `,
          error
        );
      }
    };

    fetchHotCoupons();
    fetchMyCoupons();
    fetchServiceCoupons(currentSelectedService);
  }, [currentSelectedService, showCouponDetail]);

  const handleServiceChange = (serviceId) => {
    console.log(`Change service to ${serviceId}`);
    setCurrentSelectedService(serviceId);
    // fetchServiceCoupons(serviceId);
  };

  const renderCouponSwiper = (coupons) => {
    return (
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{
          dynamicBullets: true,
          clickable: true,
        }}
        autoplay={{
          delay: 3500,
          disableOnInteraction: true,
        }}
        // loop={true}
        autoHeight={true}
        className="mySwiper"
        onInit={(swiper) => {
          swiper.pagination.el.style.display = "none";
        }}
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          500: {
            slidesPerView: 2,
          },
          900: {
            slidesPerView: 3,
          },
          1200: {
            slidesPerView: 4,
          },
          1500: {
            slidesPerView: 5,
          },
        }}
      >
        {coupons.length === 0 ? (
          <div className="noCoupon">
            {currentUser.isLoggedIn
              ? "Không tìm thấy ưu đãi!"
              : "Bạn chưa đăng nhập! Vui lòng đăng nhập để nhận được những ưu đãi tuyệt nhất!"}
          </div>
        ) : (
          coupons.map((coupon, index) =>
            coupon === null ? (
              <div className="noCoupon">
                {currentUser.isLoggedIn
                  ? "Không tìm thấy ưu đãi!"
                  : "Bạn chưa đăng nhập! Vui lòng đăng nhập để nhận được những ưu đãi tuyệt nhất!"}
              </div>
            ) : (
              <SwiperSlide key={index}>
                <Coupon
                  couponStyle="short"
                  couponTitle={coupon.couponCode}
                  couponDiscount={
                    coupon.unit === 0 ? `${coupon.value}%` : `${coupon.value}k`
                  }
                  couponMaxQuantity={coupon.maxQuantity}
                  couponCurrentQuantity={coupon.count}
                  useCoupon={() => {
                    setShowCouponDetail(true);
                    setSelectedCoupon(coupon);
                  }}
                />
              </SwiperSlide>
            )
          )
        )}
      </Swiper>
    );
  };

  return (
    <MainLayout>
      <Style isDesktop={isDesktop}>
        <div className="mainLayout">
          {showCouponDetail && (
            <CouponDetailModal
              coupon={selectedCoupon}
              showCouponDetail={showCouponDetail}
              setShowCouponDetail={setShowCouponDetail}
              currentUserId={currentUser.data.id}
            />
          )}
          <div className="opener">
            <span className="openerTitle">
              Xin chào {currentUser.data.name || "bạn"} 👋
            </span>
            <span className="openerSubTitle">
              {currentUser.isLoggedIn
                ? `Bạn có ${myCoupons.length} ưu đãi đang chờ sử dụng!`
                : "Bạn chưa đăng nhập! Vui lòng đăng nhập để nhận được những ưu đãi tuyệt nhất!"}
            </span>
          </div>
          {/* <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{
              dynamicBullets: true,
              clickable: true,
            }}
            autoplay={{
              delay: 3500,
              disableOnInteraction: true,
            }}
            slidesPerView={1}
            loop={true}
            autoHeight={true}
            className="mySwiper"
          >
            {mockImageBanner.map((image, index) => (
              <SwiperSlide key={index}>
                <img src={image} alt={`Banner ${index}`} />
              </SwiperSlide>
            ))}
          </Swiper> */}
          <div className="section">
            <span className="sectionTitle">Ưu đãi hot</span>
            <div className="divider"></div>
            {renderCouponSwiper(hotCoupons)}
          </div>
          <div className="section">
            <span className="sectionTitle">Ưu đãi của tôi</span>
            <div className="divider"></div>
            {renderCouponSwiper(myCoupons)}
          </div>
          <div className="section">
            <span className="sectionTitle">Ưu đãi theo dịch vụ</span>
            <div className="divider"></div>
            <Swiper
              modules={[Pagination, Scrollbar]}
              slidesPerView={3}
              loop={false}
              scrollbar={{ hide: true }}
              spaceBetween={10}
              breakpoints={{
                0: {
                  slidesPerView: 2,
                },
                700: {
                  slidesPerView: 3,
                },
                1000: {
                  slidesPerView: 4,
                },
                1500: {
                  slidesPerView: 5,
                },
              }}
            >
              {Object.keys(services).map((key) => (
                <SwiperSlide key={key}>
                  <button
                    key={key}
                    className={`serviceItem ${
                      key === currentSelectedService ? "active" : ""
                    }`}
                    onClick={() => handleServiceChange(key)}
                  >
                    <FontAwesomeIcon
                      icon={services[key].icon}
                      className="serviceItemIcon"
                    />
                    <span>{services[key].name}</span>
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="divider"></div>
            <div className="couponList">
              {serviceCoupons.length === 0 ? (
                <div className="noCoupon">Không tìm thấy ưu đãi!</div>
              ) : (
                serviceCoupons.map((coupon, index) => (
                  <div key={index}>
                    <Coupon
                      couponStyle={isDesktop ? "long" : "short"}
                      couponTitle={coupon.couponCode}
                      couponDiscount={
                        coupon.unit === 0
                          ? `${coupon.value}%`
                          : `${coupon.value}k`
                      }
                      couponMaxQuantity={coupon.maxQuantity}
                      couponCurrentQuantity={coupon.count}
                      useCoupon={() => {
                        setShowCouponDetail(true);
                        setSelectedCoupon(coupon);
                      }}
                    />
                    <br />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </Style>
    </MainLayout>
  );
};

const Style = styled.div`
  margin: 1rem;

  .mainLayout {
    margin: ${(props) => (props.isDesktop === true ? "0 15%" : "0 0%")};
  }

  .opener {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
  }
  .openerTitle {
    font-size: 24px;
    font-weight: 600;
    color: #333;
  }
  .openerSubTitle {
    font-size: 20px;
    font-weight: 400;
    color: #333;
  }

  .section {
    padding: 1rem;
    margin: 1rem 0;
    background-color: #fff;
    border-radius: 0.75rem;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);
  }

  .sectionTitle {
    font-size: 24px;
    font-weight: 600;
    color: #333;
    margin-bottom: 1rem;
  }

  .divider {
    width: 100%;
    height: 1px;
    background-color: #e5e5e5;
    margin: 0.5rem 0 1rem 0;
  }

  .serviceList {
    display: flex;
    flex-direction: row;
  }

  .serviceItem {
    display: flex;
    flex-direction: column;
    width: 5rem;
    height: 5rem;
    justify-content: center;
    align-items: center;
    white-space: nowrap;
    padding: 1rem;
    border: none;
    border-radius: 1rem;
    background-color: #f9f9f9;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);
  }
  .serviceItem:hover {
    color: #fff;
    font-weight: 600;
    background-color: #019f91;
  }
  .serviceItem:active {
    color: #fff;
    font-weight: 600;
    background-color: #019f91;
  }
  .serviceItemIcon {
    font-size: 2rem;
  }
  @media (max-width: 768px) {
    .serviceItem {
      width: 4rem;
      height: 4rem;
    }
    .serviceItemIcon {
      font-size: 1.5rem;
    }
  }
  .serviceItem span {
    margin-top: 0.5rem;
    font-weight: 400;
  }

  .active {
    color: #fff;
    font-weight: 600;
    background-color: #019f91;
  }

  .couponList {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .noCoupon {
    display: flex;
    width: 100%;
    justify-content: center;

    font-size: 20px;
    font-weight: 400;
  }
`;

export default ExplorePage;
