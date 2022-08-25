import React from 'react';
import { Form } from 'react-bootstrap';
import { useController } from 'react-hook-form';
import Select from 'react-select';
import styled from 'styled-components';

function SelectField({ name, control, rules, defaultValue, ...props }) {
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
        <Form.Label>{props?.label || props?.children || ''}</Form.Label>
        <Select
          options={props?.options || []}
          control={control}
          ref={ref}
          isInvalid={invalid}
          {...controlProps}
          onChange={(e) => controlProps?.onChange(e)}
        />
      </Form.Group>
    </Styles>
  );
}

export default SelectField;

const Styles = styled.div``;
