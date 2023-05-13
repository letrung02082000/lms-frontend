import styled from 'styled-components';
import accountApi from 'api/accountApi';
import motobikeApi from 'api/motobikeApi';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { toastWrapper } from 'utils';
import MotobikeItem from '../components/MotobikeItem';
import Pagination from 'components/footer/Pagination';
import { Button, Col, Row } from 'react-bootstrap';
import SelectField from 'components/form/SelectField';
import { useForm } from 'react-hook-form';
import { BsCardList, BsPencilSquare } from 'react-icons/bs';
import PostModal from '../components/PostModal';
import ListModal from '../components/ListModal';

function YenSharePage() {
  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const token = localStorage.getItem('user-jwt-tk');
  const { handleSubmit, control, setValue, watch } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      filter: 'isDriver=both'
    },
    resolver: undefined,
    context: undefined,
    criteriaMode: "firstError",
    shouldFocusError: true,
    shouldUnregister: true,
    shouldUseNativeValidation: false,
    delayError: undefined,
  });

  useEffect(() => {
    motobikeApi
      .getMotobikeList(page)
      .then((res) => {
        setData(res?.data);
      })
      .catch((e) => {
        const errMsg = e?.response?.data?.message || 'Đã có lỗi xảy ra';
        console.log(errMsg)
        // toastWrapper(errMsg, 'error');
      });
  }, [page, showPostModal, showListModal]);

  const handlePageChange = (value) => {
    if(value < 0) return;
    return setPage(value)
  }
  const filterOptions = [
    {
      label: 'Vừa tài xế vừa yên sau',
      value: 'isDriver=both'
    },
    {
      label: 'Tìm tài xế',
      value: 'isDriver=false'
    },
    {
      label: 'Tìm yên sau',
      value: 'isDriver=true'
    },
  ]

  return (
    <Styles>
      <Row className='mt-5'>
        <Col className='d-flex justify-content-center'>
          <Button onClick={() => setShowPostModal(true)} className='px-3 py-2 mx-2'>
            <BsPencilSquare /> Đăng tin
          </Button>
          <Button onClick={() => setShowListModal(true)} className='px-3 py-2 mx-2'>
            <BsCardList /> Tin của bạn
          </Button>
        </Col>
      </Row>

      {/* <Row className='mt-3'>
        <div className='form-label'>Lọc theo</div>
      </Row>

      <Row>
        <Col xs={7}>
          <SelectField
            options={filterOptions}
            control={control}
            name='filter'
          />
        </Col>
        <Col>
          <Button variant='outline-primary w-100'>
            <BsFilter /> Áp dụng
          </Button>
        </Col>
      </Row> */}

      {data.length > 0 ? (
        data.map((item) => {
          return <MotobikeItem {...item} key={item?._id} hasInfoButton/>;
        })
      ) : (
        <div>
          <p className='text-center mt-3'>Không có dữ liệu</p>
        </div>
      )}
      <div className='d-flex justify-content-center w-100'>
        <Pagination
          current={page + 1}
          onNextClick={() => handlePageChange(page + 1)}
          onPrevClick={() => handlePageChange(page - 1)}
        />
      </div>
      <PostModal show={showPostModal} setShow={setShowPostModal} />
      <ListModal show={showListModal} setShow={setShowListModal} />
    </Styles>
  );
}

const Styles = styled.div`
  margin: 0 1rem 10rem;
`

export default YenSharePage;
