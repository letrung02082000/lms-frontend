import React, { useState } from 'react';
import styled from 'styled-components';

function SearchOrder({
  name,
  orderCode,
  category,
  document,
  receipt,
  state,
  isPrinted,
  instruction,
  isDelivered,
}) {
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
      <p>
        Hóa đơn (admin):{' '}
        {receipt === undefined ? (
          'Không có'
        ) : (
          <a href={receipt} rel='noopenner noreferrer' target='_blank'>
            Xem hóa đơn
          </a>
        )}
      </p>
      <p>Hướng dẫn in: {instruction}</p>
      <div>
        {state === 6 && (
          <p>
            &#9193; Đang xử lý &#9193; <b>Đã hủy</b>
          </p>
        )}
        {state === 0 && <p>&#9193; Chờ xác nhận</p>}
        {state === 2 && (
          <p>
            &#9193; Chờ xác nhận | &#9193; <b>Đang xử lý và báo giá</b>
          </p>
        )}
        {state === 3 && (
          <p>
            &#9193; Chờ xác nhận | &#9193; Đang xử lý và báo giá | &#9193; Đang
            in {isPrinted && <span>| &#9193; Đã in</span>}{' '}
            {isDelivered && <span>| &#9193; Đang giao hàng</span>}
          </p>
        )}
        {state === 4 && (
          <p>
            &#9193; Chờ xác nhận | &#9193; Đang xử lý và báo giá | &#9193; Đang
            in {isPrinted && <span>| &#9193; Đã in</span>} | &#9193;{' '}
            <b>Đã giao hàng</b>
          </p>
        )}
        {state === 5 && (
          <p>
            &#9193; Chờ xác nhận | &#9193; Đang xử lý và báo giá | &#9193; Đang
            in {isPrinted && <span>| &#9193; Đã in</span>}{' '}
            {isDelivered && <span>| &#9193; Đang giao hàng</span>} | &#9193; Đã
            giao hàng | &#9193; <b>Đã hoàn tất</b>
          </p>
        )}
      </div>
      <hr />
    </Styles>
  );
}

export default SearchOrder;

const Styles = styled.div``;
