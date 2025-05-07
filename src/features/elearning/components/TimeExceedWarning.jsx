import React from 'react';
import { Container } from 'react-bootstrap';
import { formatTime } from 'utils/commonUtils';

function TimeExceedWarning({ totalTodayTime, timeLimitPerDay }) {
  return (
    <div style={{ height: '100vh', overflowY: 'scroll', padding: '20px' }}>
      <Container>
        <div className='text-center mt-5'>
          <h4>Đã vượt quá thời gian học hôm nay</h4>
          <h5 className='text-danger'>
            Thời gian đã học hôm nay: {formatTime(totalTodayTime)}
          </h5>
          <h5 className='text-danger'>
            Thời gian học tối đa mỗi ngày: {formatTime(timeLimitPerDay)}
          </h5>
          <h5 className='text-danger'>Vui lòng quay lại vào ngày tiếp theo.</h5>
        </div>
      </Container>
    </div>
  );
}

export default TimeExceedWarning;
