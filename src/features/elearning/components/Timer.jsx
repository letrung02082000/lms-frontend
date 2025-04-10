import React, { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';

const Timer = ({ timestart, timelimit, onTimeUp }) => {
  const [remainingTime, setRemainingTime] = useState(
    timelimit * 60 - Math.floor((Date.now() - timestart) / 1000)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (remainingTime <= 0) {
      onTimeUp();
    }
  }, [remainingTime, onTimeUp]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <Alert variant={remainingTime <= 60 ? 'danger' : 'primary'}>
      ⏳ Thời gian còn lại: <strong>{formatTime(remainingTime)}</strong>
    </Alert>
  );
};

export default Timer;
