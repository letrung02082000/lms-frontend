import React, { useEffect, useState } from 'react';
import { Form, Button, Image } from 'react-bootstrap';

function Question({ number, question, answers, explanation, questionData }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    setSelectedOption(null);

  }, [number]);

  return (
    <Form>
      <Form.Group controlId='question'>
        <Form.Text className='d-block'>Câu hỏi số {number}</Form.Text>
        <Form.Label>{question}</Form.Label>
        {questionData?.images.length > 0 && (
          <Image
            src={questionData?.images[0]}
            width='100%'
            className='mt-2 mb-3'
          />
        )}
        {answers.map((answer, index) => (
          <Form.Check
            style={{
              color: selectedOption && (answer?.correct ? 'green' : 'red'),
              fontWeight: selectedOption && 'bold',
            }}
            value={index}
            key={index}
            type='radio'
            label={answer?.text}
            name={`question-${number}`}
            id={`option-${index}`}
            onChange={handleOptionChange}
            checked={selectedOption === index.toString()}
          />
        ))}
        {selectedOption && <p className='mt-2'>Giải thích: {explanation}</p>}
      </Form.Group>
    </Form>
  );
}

export default Question;
