import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';
import Timeline from './Timeline';
function SearchOrder(data) {
  const {
    name,
    orderCode,
    category,
    document,
    receipt,
    state,
    isPrinted,
    instruction,
    isDelivered,
  } = data;
  const [copied, setCopied] = useState(false);
  console.log(data);
  const handleCopyButton = () => {
    navigator.clipboard.writeText(`${orderCode} ${name}`);
    setCopied(true);
  };

  return (
    <Styles>
      <p>Mã đơn hàng: {orderCode}</p>
      <p>Khách hàng: {name}</p>
      <p>Thể loại in: {category?.name}</p>
      <p>
        Tài liệu (admin):{' '}
        {typeof document === 'string' ? (
          <a href={document} rel='noopenner noreferrer' target='_blank'>
            Tài liệu
          </a>
        ) : (
          <div>
            {document?.map((url, index) => {
              return (
                <a href={url} rel='noopenner noreferrer' target='_blank'>
                  Tài liệu {index + 1} <br />
                </a>
              );
            })}
          </div>
        )}
      </p>
      <p>Hướng dẫn in: {instruction}</p>
      <p>Trạng thái: {isPrinted ? 'Đã in' : 'Chưa in'}</p>
      <p>
        Nội dung chuyển khoản (không dấu):
        <br />
        <b>
          {orderCode} {name}
        </b>
      </p>
      {copied ? (
        <Button
          type='button'
          variant='outline-primary'
          onClick={handleCopyButton}
        >
          Đã chép
        </Button>
      ) : (
        <Button
          type='button'
          variant='outline-primary'
          onClick={handleCopyButton}
        >
          Sao chép
        </Button>
      )}
      <Timeline data={data?.timeline} current={state} />

      <hr />
    </Styles>
  );
}

export default SearchOrder;

const Styles = styled.div``;
