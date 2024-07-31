import React, { useState } from 'react';
import CopyButton from 'components/button/CopyButton';
import styled from 'styled-components';
import { copyText } from 'utils/commonUtils';
import Timeline from './Timeline';
import Asterisk from 'components/form/Asterisk';
function SearchOrder(data) {
  const {
    name,
    orderCode,
    category,
    document,
    state,
    isPrinted,
    instruction,
    deliveryTime,
    token
  } = data;
  const ORIGINAL_URL = window.location.origin;
  const quotationLink = `${ORIGINAL_URL}/order?id=${data._id}&token=${token}`;
  const [copied, setCopied] = useState(false);
  const handleCopyButton = () => {
    copyText(`IN ${orderCode}`)
    setCopied(true);
  };

  let timeText = deliveryTime ? `${new Date(deliveryTime)?.toLocaleTimeString('en-GB')} ngày ${new Date(deliveryTime)?.toLocaleDateString('en-GB')}` : 'Đang cập nhật'

  return (
    <Styles>
      <p>
        Mã đơn hàng: #<b>{orderCode}</b>
      </p>
      <p>
        Khách hàng: <b>{name}</b>
      </p>
      <p>
        Thể loại in: <b>{category?.name}</b>
      </p>
      {/* <p>
        Tài liệu:
        <div>
          {document?.map((_item, index) => {
            let url = _item?.fileUrl ? _item.fileUrl : `https://drive.google.com/file/d/${_item?.fileId}`
            return (
              <a href={url} rel='noopener noreferrer' target='_blank'>
                Tài liệu {index + 1} <br />
              </a>
            );
          })}
        </div>
      </p> */}
      <p>Hướng dẫn in: {instruction}</p>
      <p>
        Trạng thái:{' '}
        <b>
          {isPrinted ? (
            <span className='text-success'>Đã in</span>
          ) : (
            <span className='text-danger'>Chưa in</span>
          )}
        </b>
      </p>
      {deliveryTime ? (
        <p className='text-success fw-bold'>
          Đơn hàng sẽ được giao vào lúc {timeText}
        </p>
      ) : (
        <span className='text-primary fw-bold'>
          Thời gian giao hàng: Đang cập nhật
        </span>
      )}
      <Timeline data={data?.timeline} current={state} />
      <div className='mt-2'>
        <span className='me-2'>
          Nội dung chuyển khoản:{' '}
          <b>{`IN ${orderCode}`}</b>
        </span>
        <CopyButton copied={copied} setCopied={setCopied} text={`IN ${orderCode}`}/>
      </div>

      <div>
        <Asterisk color='red' /> Viết in hoa, không dấu, đúng cú pháp
        <br />
        <Asterisk color='red' /> Thanh toán được duyệt tự động
      </div>
      {token && (
        <a
          className='mt-2 btn btn-primary'
          href={quotationLink}
          rel='noopener noreferrer'
          target='_blank'
        >
          Xem báo giá
        </a>
      )}
      <hr />
    </Styles>
  );
}

export default SearchOrder

const Styles = styled.div``
