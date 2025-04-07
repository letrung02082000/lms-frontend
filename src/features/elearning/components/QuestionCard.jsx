// src/components/QuestionCard.jsx
import React from 'react';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form'; // Import Form
import AnswerOption from './AnswerOption';

const QuestionCard = ({
  questionData,
  questionNumber,
  totalQuestions,
  userAnswer,
  onAnswerChange,
}) => {
  if (!questionData) return <Card body>Không có dữ liệu câu hỏi.</Card>; // Dùng Card body nếu không có data

  const {
    html: questionHtml,
    type,
    slot,
    id: questionId,
    responsefileareas,
    choices,
    sequencecheck,
    maxmark,
  } = questionData;

  const handleInputChange = (name, value, isChecked = null) => {
    // Thêm isChecked=null
    let payload;
    // Xử lý radio/checkbox/truefalse
    if (type === 'multichoice' || type === 'truefalse') {
      payload = [{ name: name, value: value }];
      if (sequencecheck) {
        payload.push({
          name: `q${questionId}:${slot}_:sequencecheck`,
          value: sequencecheck,
        });
      }
      // Checkbox có thể cần xử lý phức tạp hơn nếu Moodle gửi giá trị khác nhau khi check/uncheck
    } else {
      // Xử lý text input/textarea
      payload = [{ name: name, value: value }];
    }
    onAnswerChange(questionId, slot, payload);
  };

  const renderAnswerOptions = () => {
    if (!choices) return null;
    // Lấy câu trả lời hiện tại cho câu hỏi này từ state cha (mảng payload)
    const currentAnswerPayload = userAnswer || [];
    const currentAnswerValue = currentAnswerPayload.find((ans) =>
      ans.name.includes('_answer')
    )?.value;

    return choices.map((option, index) => {
      const inputName = `q${questionId}:${slot}_answer`;
      // Value của option, có thể Moodle không trả về value mà chỉ có index/text
      const optionValue =
        option.value !== undefined ? option.value : index.toString();
      let isChecked = false;
      if (option.type === 'radio' || type === 'truefalse') {
        isChecked = currentAnswerValue === optionValue;
      } else if (option.type === 'checkbox') {
        // Logic kiểm tra checkbox dựa trên payload - Cần xem API thực tế
        // Ví dụ đơn giản: Kiểm tra xem value có trong mảng các giá trị đã chọn không
        // isChecked = currentAnswerPayload.some(ans => ans.name.startsWith(`q${questionId}:${slot}_choice`) && ans.value === '1');
        isChecked = currentAnswerValue === optionValue; // Tạm thời
      }

      return (
        <AnswerOption
          key={optionValue || index}
          option={option}
          questionType={type}
          name={inputName}
          value={optionValue} // Sử dụng giá trị đã xác định
          isChecked={isChecked}
          onChange={handleInputChange}
        />
      );
    });
  };

  const renderShortAnswer = () => {
    const inputName = `q${questionId}:${slot}_answer`;
    const currentValue =
      userAnswer?.find((ans) => ans.name === inputName)?.value || '';
    return (
      <Form.Control // Sử dụng Form.Control
        type='text'
        name={inputName}
        value={currentValue}
        onChange={(e) => handleInputChange(e.target.name, e.target.value)}
        placeholder='Nhập câu trả lời...'
      />
    );
  };

  const renderEssay = () => {
    const inputName = `q${questionId}:${slot}_answer`;
    const currentValue =
      userAnswer?.find((ans) => ans.name === inputName)?.value || '';
    return (
      <Form.Control // Sử dụng Form.Control
        as='textarea' // Dùng as="textarea"
        name={inputName}
        value={currentValue}
        onChange={(e) => handleInputChange(e.target.name, e.target.value)}
        rows={5}
        placeholder='Nhập câu trả lời của bạn...'
      />
    );
  };

  const renderOtherType = () => {
    return (
      <>
        {/* CẢNH BÁO BẢO MẬT */}
        <div dangerouslySetInnerHTML={{ __html: questionHtml || '' }} />
        <p className='text-muted mt-2'>
          <i>(Loại câu hỏi '{type}' có thể chưa được hỗ trợ đầy đủ.)</i>
        </p>
      </>
    );
  };

  return (
    <Card className='mb-4 shadow-sm'>
      {' '}
      {/* Thêm class Bootstrap */}
      <Card.Header as='h5'>
        {' '}
        {/* Dùng Card.Header */}
        Câu {questionNumber} / {totalQuestions}
        {maxmark && (
          <Badge bg='info' className='ms-2'>
            {maxmark} điểm
          </Badge>
        )}{' '}
        {/* Hiển thị điểm */}
      </Card.Header>
      <Card.Body>
        {' '}
        {/* Dùng Card.Body */}
        {/* Render HTML câu hỏi - CẢNH BÁO BẢO MẬT */}
        {type !== 'multichoice' &&
          type !== 'truefalse' &&
          type !== 'shortanswer' &&
          type !== 'essay' && (
            <Card.Text
              as='div'
              dangerouslySetInnerHTML={{ __html: questionHtml || '' }}
            />
          )}
        {/* Khu vực trả lời */}
        <Form className='mt-3'>
          {' '}
          {/* Wrap trong Form cho cấu trúc */}
          {type === 'multichoice' || type === 'truefalse'
            ? renderAnswerOptions()
            : type === 'shortanswer'
            ? renderShortAnswer()
            : type === 'essay'
            ? renderEssay()
            : renderOtherType()}
        </Form>
        {/* Khu vực file (nếu cần) */}
        {responsefileareas && responsefileareas.length > 0 && (
          <Card.Text as='div' className='mt-3 p-2 border rounded bg-light'>
            {/* Logic upload file */}
            <small className='text-muted'>
              <i>(Câu hỏi này có thể yêu cầu tệp đính kèm - chưa hỗ trợ.)</i>
            </small>
          </Card.Text>
        )}
      </Card.Body>
    </Card>
  );
};

export default QuestionCard;
