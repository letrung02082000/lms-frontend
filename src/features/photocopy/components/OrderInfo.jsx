import React, { useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import ZaloLink from 'components/link/ZaloLink';
import styled from 'styled-components';
import AccountInfo from './AccountInfo';
import orderApi from 'api/photocopy/orderApi'
import { ToastWrapper } from 'utils';
import Timeline from './Timeline';

function OrderInfo(props) {
  const [show, setShow] = useState(false);
  const [data, setData] = useState(false);
  let orderToken = localStorage.getItem('order-token');
  const ORIGINAL_URL = window.location.origin;
  const quotationLink = `${ORIGINAL_URL}/order?id=${data._id}&token=${orderToken}`;
  let timeText = data?.deliveryTime ? `${new Date(data?.deliveryTime)?.toLocaleTimeString('en-GB')} ngày ${new Date(data?.deliveryTime)?.toLocaleDateString('en-GB')}` : 'Đang cập nhật'
  

  useEffect(() => {
    orderApi
      .getOrderByToken(orderToken || '')
      .then((res) => {
        if (res?.data) {
          setData(res?.data[0]);
        }
      })
      .catch((e) => {
        ToastWrapper(e?.response?.data?.message, 'error');
      });
  }, []);

  const handleNewOrder = () => {
    localStorage.removeItem('order-data');
    window.location.reload();
  };

  return (
    <Styles>
      <Row>
        <BsFillCheckCircleFill color='#019f91' size={45} />
      </Row>
      <h4 className='text-center mt-2 mb-3 text-uppercase'>
        Đặt hàng thành công
      </h4>

      <Row>
        <Col md={6}>
          <Row>
            <div className='custom-label'>Mã đơn hàng</div>
            <div>#{data?.orderCode}</div>
          </Row>

          <Row>
            <div className='custom-label'>Điện thoại</div>
            <div>{data?.tel}</div>
          </Row>

          <Row>
            <div className='custom-label'>Email</div>
            <div className='content'>{data?.email || 'Không có'}</div>
          </Row>

          <Row>
            <div className='custom-label'>Nhận hàng tại</div>
            <div>
              {data?.deliveryType === 'home'
                ? data?.address
                : data?.office?.name}
            </div>
          </Row>

          <Row>
            <div className='custom-label'>Hướng dẫn in</div>
            <div>{data?.instruction}</div>
          </Row>
        </Col>
        <Col>
          <Row>
            <div className='custom-label'>Khách hàng</div>
            <div>{data?.name}</div>
          </Row>
          <Row>
            <div className='custom-label'>Zalo</div>
            <div>{data?.zalo || 'Không có'}</div>
          </Row>
          <Row>
            <div className='custom-label'>Thể loại</div>
            <div>{data?.category?.name}</div>
          </Row>

          <Row>
            <div className='custom-label'>Mã giảm giá</div>
            <div>{data?.coupon || 'Không có'}</div>
          </Row>
          <Row>
            <div className='custom-label'>Nội dung chuyển khoản</div>
            <div className='fw-bold'>
              {'IN '}
              {data?.orderCode}
            </div>
          </Row>
          <Button
            className='copy-btn mt-2'
            variant='outline-primary'
            onClick={() => setShow(true)}
          >
            Thông tin chuyển khoản
          </Button>
        </Col>
      </Row>

      <Row className='border border-success rounded m-1 mt-3 p-3'>
        <Row>
          <p className='fw-bold text-center text-success text-uppercase'>
            Theo dõi đơn hàng
          </p>
        </Row>
        <Col>
          <p className='my-2'>
            Trạng thái
            <br />
            <b>
              {data?.isPrinted ? (
                <span className='text-success'>Đã in</span>
              ) : (
                <span className='text-danger'>Chưa in</span>
              )}
            </b>
          </p>
          {data?.deliveryTime ? (
            <p className='text-success fw-bold my-2'>
              Đơn hàng sẽ được giao vào lúc {timeText}
            </p>
          ) : (
            <p className='my-2'>
              Thời gian giao hàng
              <br />
              <b className='text-primary'>Đang cập nhật</b>
            </p>
          )}
        </Col>
        <Col md={8}>
          <Timeline data={data?.timeline} current={data?.state} />
        </Col>
      </Row>

      <div className='text-center mt-5'>
        Cảm ơn bạn đã tin tưởng sử dụng dịch vụ của iSinhvien!
      </div>
      <div className='d-flex justify-content-center m-2'>
        {orderToken && (
          <a
            className='btn btn-primary mx-3'
            href={quotationLink}
            rel='noopener noreferrer'
            target='_blank'
          >
            Xem báo giá
          </a>
        )}
        <Button
          variant='outline-primary'
          onClick={handleNewOrder}
          className='mx-2'
        >
          Tạo đơn hàng mới
        </Button>
      </div>
      <div>
        <h6 className='fw-bold text-danger'>Quan trọng cần lưu ý</h6>
        <ul>
          <li>
            Quý khách vui lòng giữ liên lạc qua di động/zalo đã đăng ký để nhận
            báo giá đơn hàng
          </li>
          <li>
            Sau khi nhận được báo giá và thời gian giao hàng, quý khách có thể
            thanh toán online theo hướng dẫn để xác nhận in <b>TỰ ĐỘNG</b>
            <br />
            (*) Thông tin chuyển khoản sẽ được gửi kèm bảng báo giá
          </li>
          <li>
            Zalo hỗ trợ:{' '}
            <ZaloLink tel='4013961016678131109'>
              Trung tâm dịch vụ sinh viên iStudent
            </ZaloLink>
          </li>
        </ul>
      </div>
      <AccountInfo show={show} setShow={setShow} code={data?.orderCode} />
    </Styles>
  );
}

export default OrderInfo

const Styles = styled.div`
  background-color: white;
  margin: 1rem 0 5rem;
  border-radius: 15px;
  padding: 1rem;

  .custom-label {
    font-size: 1rem;
    font-weight: 500;
    margin: 0.5rem 0 0;
  }

  .copy-btn {
    width: fit-content;
    font-size: 0.8rem;
  }

  .content {
  overflow-wrap: break-word;
  }
`
