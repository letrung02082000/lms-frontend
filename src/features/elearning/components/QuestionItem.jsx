import React, { useState } from 'react';
import { Card, Form } from 'react-bootstrap';

const QuestionItem = ({ question, slot, sequenceCheck, onAnswerChange}) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const handleChange = (index) => {
    setSelectedIndex(index);

    const payload = [
      {
        name: `q${question.id}:${slot}_answer`,
        value: index.toString(),
      },
      {
        name: `q${question.id}:${slot}_:sequencecheck`,
        value: sequenceCheck,
      },
      {
        name: `q${question.id}:${slot}_:flagged`,
        value: '0',
      },
    ];

    onAnswerChange(slot, payload);
  };

  return (
    <Card className='mb-3'>
      <Card.Body>
        <Card.Title dangerouslySetInnerHTML={{ __html: question.text }} />
        <Form>
          {question.answers.map((ans, index) => {
            const id = `q${question.id}:${slot}_answer_${index}`;
            return (
              <Form.Check
                key={index}
                type='radio'
                id={id}
                name={`q${question.id}:${slot}_answer`} // tên này Moodle cần
                label={ans.label}
                value={index}
                defaultChecked={ans?.checked}
                onChange={() => handleChange(index)}
                className='mb-2'
              />
            );
          })}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default QuestionItem;
