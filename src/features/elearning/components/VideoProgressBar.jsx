import React from 'react';
import { ProgressBar } from 'react-bootstrap';

const VideoProgressMapa = ({ mapa }) => {
  const total = mapa.length;

  // Tạo các đoạn đã xem để truyền vào ProgressBar dạng segments
  const segments = [];
  let start = null;

  mapa.forEach((val, index) => {
    if (val > 0 && start === null) {
      start = index;
    } else if ((val === 0 || index === mapa.length - 1) && start !== null) {
      const end = val === 0 ? index : index + 1;
      const length = end - start;
      segments.push({
        now: (length / total) * 100,
        striped: false,
        variant: 'success',
        label: '',
      });
      start = null;
    }
  });

  return (
    <ProgressBar style={{ height: '10px', borderRadius: '5px' }}>
      {segments.map((seg, idx) => (
        <ProgressBar key={idx} {...seg} />
      ))}
    </ProgressBar>
  );
};

export default VideoProgressMapa;
