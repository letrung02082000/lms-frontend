import React, { useState } from 'react';
import { Card, Form } from 'react-bootstrap';

const QuestionItem = ({
  question,
  slot,
  sequenceCheck,
  onAnswerChange,
  disabled = false,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleChange = (index) => {
    if (disabled) return;
    console.log('changed', index);

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
                name={`q${question.id}:${slot}_answer`}
                label={ans.label}
                value={index}
                defaultChecked={ans?.checked}
                onChange={() => handleChange(index)}
                className='mb-2'
                disabled={disabled && !ans.checked}
              />
            );
          })}
        </Form>
        {question.feedback && (
          <>
            <div className='mt-2'>
              <strong>Giải thích:</strong>
            </div>
            <div
              className='mt-2'
              dangerouslySetInnerHTML={{ __html: question.feedback }}
            />
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default QuestionItem;
