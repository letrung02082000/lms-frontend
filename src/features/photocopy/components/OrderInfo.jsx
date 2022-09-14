import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

function OrderInfo(props) {
  const [copied, setCopied] = useState(false);

  const handleCopyButton = () => {
    navigator.clipboard.writeText(`${props?.orderCode} ${props?.name}`);
    setCopied(true);
  };

  return (
    <div className='p-2'>
      <div>
        Quan trọng: Quan tâm Zalo Official Account để nhận thông báo về đơn hàng
        tại:{' '}
        <a
          href='http://zalo.me/4013961016678131109?src=qr'
          target='_blank'
          rel='noreferrer'
        >
          Trung tâm dịch vụ sinh viên iStudent
        </a>
        <br />
        Chọn "Quan tâm", sau đó chọn dịch vụ "In ấn".
      </div>
      <h5 className='text-center my-5'>Đặt hàng thành công &#127881;</h5>
      <div>
        <p>Mã đơn hàng: {props?.orderCode}</p>
        <p>Khách hàng: {props?.name}</p>
        <p>Thể loại: {props?.category?.name}</p>
        <p>
          Hình thức giao hàng:{' '}
          {props?.isDelivered ? 'Giao hàng tận nơi' : 'Nhận tại cửa hàng'}
        </p>
        <p>
          Nhận hàng tại:{' '}
          {props?.isDelivered ? props?.address : props?.office?.name}
        </p>
        <p>Hướng dẫn in: {props?.instruction}</p>
        <p>Trạng thái: {props?.isPrinted ? 'Đã in' : 'Đang xử lý'}</p>
        <p>
          Nội dung chuyển khoản (không dấu):
          <br />
          <b>
            {props?.orderCode} {props?.name}
          </b>
        </p>
        {copied ? (
          <Button type='button' variant='outline-primary' onClick={handleCopyButton}>
            Đã chép
          </Button>
        ) : (
          <Button type='button' variant='outline-primary' onClick={handleCopyButton}>
            Sao chép
          </Button>
        )}
      </div>
      <div className='text-center my-5'>Rất hân hạnh được phục vụ bạn!</div>
    </div>
  );
}

export default OrderInfo;