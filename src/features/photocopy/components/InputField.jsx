import React from 'react';
import { Form } from 'react-bootstrap';
import { useController } from 'react-hook-form';
import styled from 'styled-components';

function InputField({
  label,
  children,
  control,
  name,
  rules,
  defaultValue,
  ...props
}) {
  const {
    field: { ref, ...controlProps },
    fieldState: { invalid, isTouched, isDirty },
  } = useController({
    name,
    control,
    rules,
    defaultValue,
  });

  return (
    <Styles>
      <Form.Group className='mb-3'>
        <Form.Label className='mb-3'>{label || children || ''}</Form.Label>
        <Form.Control
          {...props}
          control={control}
          ref={ref}
          type='text'
          isInvalid={invalid}
          {...controlProps}
          onChange={(e) => controlProps?.onChange(e)}
        />
      </Form.Group>
    </Styles>
  );
}

export default InputField;

const Styles = styled.div`
  label {
  }
`;
