// src/components/QuizTimer.jsx
import React, { useState, useEffect, useRef } from 'react';
import Badge from 'react-bootstrap/Badge'; // Dùng Badge cho đẹp

const QuizTimer = ({ durationSeconds, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (durationSeconds <= 0) return;
    setTimeLeft(durationSeconds);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(intervalRef.current);
          onTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [durationSeconds, onTimeUp]);

  if (durationSeconds <= 0) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Sử dụng Badge và class Bootstrap
  return (
    <div className='quiz-timer text-end mb-3'>
      {' '}
      {/* Căn phải, thêm margin bottom */}
      <Badge bg='secondary' pill>
        {' '}
        {/* Dùng pill badge */}
        Thời gian còn lại: {String(minutes).padStart(2, '0')}:
        {String(seconds).padStart(2, '0')}
      </Badge>
    </div>
  );
};

export default QuizTimer;
