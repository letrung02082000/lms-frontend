import React from 'react';
import { Form } from 'react-bootstrap';

function InfoField({ label, value }) {
  return (
    <div>
      <Form.Text>{label}</Form.Text>
      <br/>
      <Form.Label>{value?.toUpperCase()}</Form.Label>
    </div>
  );
}

export default InfoField;
