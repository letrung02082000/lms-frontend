import React from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './explore.module.css';
export default function Category(props) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/coupon-list?type=${props.type}`);
  };

  return (
    <div className={styles.category} onClick={handleClick}>
      <props.icon
        size={41}
        style={{
          color: 'var(--primary)',
          padding: '0.25rem',
          border: '1px solid #ccc',
          borderRadius: '5px',
          backgroundColor: 'white',
        }}
      />
      <span>{props.name}</span>
    </div>
  );
}
