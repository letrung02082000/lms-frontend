// src/components/AnswerOption.jsx
import React from 'react';
import Form from 'react-bootstrap/Form';

const AnswerOption = ({
  option,
  questionType,
  name,
  value,
  isChecked,
  onChange,
}) => {
  // Xác định type cho Form.Check
  const inputType =
    questionType === 'multichoice' && option.type === 'checkbox'
      ? 'checkbox'
      : 'radio';
  // Tạo ID duy nhất cho label và input
  const uniqueId = `option-${name}-${value.replace(/\s+/g, '-')}`; // Đảm bảo ID hợp lệ
  const labelHtml = option.html || option.text || '';

  const handleChange = (e) => {
    onChange(e.target.name, e.target.value, e.target.checked);
  };

  return (
    // Sử dụng Form.Check của react-bootstrap
    <Form.Check
      type={inputType}
      id={uniqueId} // Quan trọng cho accessibility
      name={name}
      value={value}
      checked={isChecked}
      onChange={handleChange}
      className='mb-2' // Thêm margin bottom
      // Render label với HTML từ Moodle
      // CẢNH BÁO BẢO MẬT: Làm sạch HTML nếu cần
      label={<span dangerouslySetInnerHTML={{ __html: labelHtml }} />}
    />
  );
};

export default AnswerOption;
