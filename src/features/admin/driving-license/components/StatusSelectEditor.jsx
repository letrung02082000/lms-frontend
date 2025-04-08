import { TEACHER_STATUS } from 'constants/driving-teacher.constant';
import React, { useState, useEffect, useRef } from 'react';
import { Form } from 'react-bootstrap';

const StatusSelectEditor = (props) => {
  const [value, setValue] = useState(props.value);
  const selectRef = useRef(null);

  useEffect(() => {
    setTimeout(() => selectRef.current.focus(), 0);
  }, []);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const getValue = () => {
    return value;
  };

  return (
    <Form.Select
      ref={selectRef}
      value={value}
      onChange={handleChange}
      className='ag-input'
    >
      {Object.keys(TEACHER_STATUS).map((key) => (
        <option key={key} value={key}>
          {TEACHER_STATUS[key]}
        </option>
      ))}
    </Form.Select>
  );
};

export default StatusSelectEditor;
