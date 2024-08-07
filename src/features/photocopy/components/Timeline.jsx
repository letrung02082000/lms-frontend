import { ORDER } from 'constants/orderState';
import React from 'react';
import styled from 'styled-components';
import { FaAngleDoubleRight } from 'react-icons/fa';

function Timeline({ data, current }) {
  return (
    <Styles className="d-flex flex-wrap mt-3">
      {data?.map((item, idx) => {
        let label = '';
        switch (idx) {
          case ORDER.CREATED:
            label = 'Đã Tạo';
            break;
          case ORDER.PROCESSED:
            label = 'Đã Xử lý';
            break;
          case ORDER.TRANSFERED:
            label = 'Đã chuyển in';
            break;
          case ORDER.DELIVERED:
            label = 'Đã giao hàng';
            break;
          case ORDER.COMPLETED:
            label = 'Đã hoàn tất';
            break;
          case ORDER.CANCELED:
            label = 'Đã hủy';
            break;
          default:
            label = '';
            break;
        }

        if (idx > current) return <div></div>;

        return (
          <div key={`key${idx}`} className="mb-2" style={{ display: 'flex', alignItems: 'center' }}>
            {item && (
              <div>
                <div>{item ? new Date(item).toLocaleDateString('en-GB') : null}</div>
                <div>{item ? new Date(item).toLocaleTimeString() : null}</div>
                <div className="fw-bold text-center" style={current === idx ? { color: 'green' } : { color: 'gray' }}>
                  {label}
                </div>
              </div>
            )}
            {item && idx < current && (
              <div className='mx-3'>
                <FaAngleDoubleRight />
              </div>
            )}
          </div>
        );
      })}
    </Styles>
  );
}

export default Timeline;

const Styles = styled.div`
  border: 1px solid #ccc;
  border-radius: 5px;
  width: fit-content;
  padding: .5rem 1rem;
`;
