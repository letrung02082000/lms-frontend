import React from "react";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react/swiper-react";
import { Scrollbar, Autoplay } from "swiper";
import { Col, Row } from "react-bootstrap";

import useMediaQuery from "hooks/useMediaQuery";
import partnershipLogos from "assets/images/partnership";
import { footerIcons } from "assets/images/svg";
import ZaloLink from "components/link/ZaloLink";

function Footer() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <Styles isDesktop={isDesktop}>
      <div className="mainLayout">
        <div className="sectionPartner">
          <span>Được tin tưởng và hợp tác bởi các đơn vị</span>
          <PartnershipSwiper />
        </div>
        <Row className="sectionFooter">
          <Col className="sectionInfo">
            <img className="logo" src="/logo5.png" alt="logo" />
            <span className="isinhvien">
              <span className="i">i</span>
              <span className="sinhvien">Sinhvien</span> - Tổ hợp dịch vụ sinh
              viên tại Khu đô thị ĐHQG - TP.HCM
            </span>
            <FooterLink />
            <ContactLogos />
          </Col>
          <Col>
            <EmbedMap />
          </Col>
        </Row>
      </div>
    </Styles>
  );
}

function PartnershipSwiper() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <Swiper
      rewind={true}
      loop={true}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      modules={[Scrollbar, Autoplay]}
      slidesPerView={isDesktop ? 5 : 3}
      spaceBetween={30}
      className="partnershipSwiper"
      onAutoplay={(swiper) => {
        const idx = swiper.activeIndex + (isDesktop ? 2 : 1);
        const middleChild = swiper.slides[idx];

        swiper.slides.forEach((slide) => {
          if (slide !== middleChild) {
            slide.style.opacity = 0.5;
          }
        });

        middleChild.style.opacity = 1;
      }}
    >
      {partnershipLogos.map((image, index) => (
        <SwiperSlide key={index} style={{ background: "none" }}>
          <img src={image} alt="iSinhvien Partnership" className="imgSwiper" />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

function ContactLogos() {
  const logos = [
    {
      logoContent: "Zalo",
      logoIcon: footerIcons[0],
      logoHref: "https://zalo.me/0877876877",
    },
    {
      logoContent: "Facebook",
      logoIcon: footerIcons[1],
      logoHref: "https://www.facebook.com/daihocquocgia",
    },
    {
      logoContent: "Gmail",
      logoIcon: footerIcons[2],
      logoHref: "mailto:hotro@isinhvien.vn",
    },
    {
      logoContent: "Phone",
      logoIcon: footerIcons[3],
      logoHref: "tel:",
    },
  ];

  return (
    <div className="contactLogos">
      {logos.map((item) => {
        return (
          <a
            className="contactLogo"
            key={item.logoContent}
            href={item.logoHref}
            target="_blank"
            rel="noopenner noreferrer"
          >
            <img src={item.logoIcon} alt={item.logoContent} />
          </a>
        );
      })}
    </div>
  );
}

function FooterLink() {
  const footerLinks = [
    {
      linkTitle: "Đăng kí hợp tác",
      linkNav: "#",
    },
    {
      linkTitle: "Chính sách bảo mật",
      linkNav: "#",
    },
    {
      linkTitle: "Điều khoản sử dụng",
      linkNav: "#",
    },
    {
      linkTitle: "Liên hệ",
      linkNav: "#",
    },
    {
      linkTitle: "Giới thiệu",
      linkNav: "#",
    },
    {
      linkTitle: "Câu hỏi thường gặp",
      linkNav: "#",
    },
    {
      linkTitle: "Trợ giúp sinh viên",
      linkNav: "#",
    },
  ];

  return (
    <Styles>
      <div className="links">
        {footerLinks.map((link) => (
          <a key={link.linkTitle} href={link.linkNav}>
            {link.linkTitle}
          </a>
        ))}
      </div>
    </Styles>
  );
}

function EmbedMap() {
  // const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API;
  // const PLACE_ID = "ChIJrVS3IPzZdDER3pyOf1yOHgA";

  return (
    <iframe
      className="sectionMap"
      style={{ display: "block", width: "100%", height: "100%" }}
      title="Văn phòng iSinhvien"
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
      // src={`https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=place_id:${PLACE_ID}`}
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.097506824859!2d106.79310266531661!3d10.880188010243808!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d9fc20b754ad%3A0x1e8e5c7f8e9cde!2zVOG7lSBo4bujcCBk4buLY2ggduG7pSBpc2luaHZpZW4!5e0!3m2!1svi!2s!4v1674695876304!5m2!1svi!2s"
    ></iframe>
  );
}

const Styles = styled.div`
  .mainLayout {
    display: flex;
    flex-direction: column;
    margin: ${(props) => (props.isDesktop ? "0 15%" : "0 5%")};
    margin-bottom: 3rem;
  }

  .sectionPartner {
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: 1rem;
    padding: 1rem;

    > span {
      font-size: 1.5rem;
      font-weight: bold;
      margin-top: 1rem;
      text-align: center;
    }
  }

  .partnershipSwiper {
    width: 100%;
    height: 100px;
    margin: 2rem 0;

    > swiper-slide swiper-slide-active {
      background: none;
      filter: grayscale(100%);
    }
  }

  .imgSwiper {
    object-fit: scale-down;
  }

  .sectionFooter {
    display: flex;
    margin: 2rem 0;
    gap: 1rem;
    flex-direction: ${(props) => (props.isDesktop ? "row" : "column")};

    justify-content: space-between;
    background: #f5f5f5;
  }

  .sectionInfo {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    > img {
      width: 10rem;
    }
  }

  .links {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 1rem;

    > a {
      color: black;
      text-decoration: none;
      text-align: left;
    }

    > a:hover {
      font-weight: bold;
      text-shadow: 2px 3px 8px rgba(0, 0, 0, 0.05);
      transition: all 0.5s ease;
    }
  }

  .contactLogos {
    display: flex;
    gap: 1rem;

    .contactLogo {
      > img {
        width: 2.5rem;
        height: 2.5rem;
        padding: 0.5rem;
        border-radius: 1rem;
        background-color: white;
      }

      > img:hover {
        box-shadow: 2px 3px 8px rgba(0, 0, 0, 0.05);
      }
    }
  }

  .sectionMap {
    border-radius: 1rem;
    border: 1px solid #e5e5e5;
    box-shadow: 2px 3px 8px rgba(0, 0, 0, 0.05);
    overflow: hidden;
  }

  .isinhvien {
    .i {
      color: #18579d;
      font-weight: bold;
    }

    .sinhvien {
      color: #ee6a26;
      font-weight: bold;
    }
  }
`;

export default Footer;
