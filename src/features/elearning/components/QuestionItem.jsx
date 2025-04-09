import React, { useState } from 'react';
import { Card, Form } from 'react-bootstrap';

const QuestionItem = ({ question, slot, onAnswerChange }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleChange = (index) => {
    setSelectedIndex(index);

    const payload = [
      {
        name: `q${question.id}:${slot}_answer`,
        value: index.toString(), // Moodle dùng giá trị index
      },
      {
        name: `q${question.id}:${slot}_:sequencecheck`,
        value: '1', // hoặc giá trị thực tế lấy từ attempt
      },
      {
        name: `q${question.id}:${slot}_:flagged`,
        value: '0',
      },
    ];

    onAnswerChange(slot, payload);
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title dangerouslySetInnerHTML={{ __html: question.text }} />
        <Form>
          {question.answers.map((ans, index) => (
            <Form.Check
              key={index}
              type="radio"
              id={`q${question.id}:${slot}_answer_${index}`}
              name={`q${question.id}:${slot}_answer`} // tên này Moodle cần
              label={ans.label}
              value={index}
              checked={selectedIndex === index}
              onChange={() => handleChange(index)}
              className="mb-2"
            />
          ))}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default QuestionItem;
