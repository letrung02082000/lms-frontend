import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import { Pagination } from 'swiper';
import styled from 'styled-components';

function FilterSilder({ setCategoryId, categories, categoryId, hasAll=false }) {
  return (
    <Styles>
      <Row>
        <Col>
          <Swiper
            modules={[Pagination]}
            slidesPerView={3.2}
            loop={true}
            spaceBetween={10}
            breakpoints={{
              0: {
                slidesPerView: 3.2,
              },
              700: {
                slidesPerView: 3.2,
              },
              1000: {
                slidesPerView: 4.2,
              },
              1500: {
                slidesPerView: 4.2,
              },
            }}
          >
            {!!hasAll && (
              <SwiperSlide>
                <Button
                  onClick={() => setCategoryId('')}
                  variant={
                    categoryId === '' ? 'secondary' : 'outline-secondary'
                  }
                  className='w-100 rounded-pill fw-bold  my-1'
                >
                  <small>Tất cả</small>
                </Button>
              </SwiperSlide>
            )}
            {categories.map((cat) => {
              return (
                <SwiperSlide key={cat._id}>
                  <Button
                    onClick={() => setCategoryId(cat?._id)}
                    variant={
                      categoryId === cat?._id
                        ? 'secondary'
                        : 'outline-secondary'
                    }
                    className='w-100 rounded-pill fw-bold  my-1'
                  >
                    <small>{cat?.name}</small>
                  </Button>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </Col>
      </Row>
    </Styles>
  );
}

export default FilterSilder;

const Styles = styled.div`
  /* .swiper-slide {
    width: fit-content !important;
  } */
`;
