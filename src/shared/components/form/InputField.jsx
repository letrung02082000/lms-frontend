import React from 'react'
import { Form } from 'react-bootstrap'
import { useController } from 'react-hook-form'
import styled from 'styled-components'
import { AiFillCloseCircle } from 'react-icons/ai';

function InputField({ noLabel, label, children, control, name, rules, defaultValue, noClear, ...props }) {
  const {
    field: { ref, ...controlProps },
    fieldState: { invalid, isTouched, isDirty, error },
  } = useController({
    name,
    control,
    rules: rules || { required: 'Vui lòng nhập trường này' },
    defaultValue,
  })

  return (
    <Styles>
      <Form.Group>
        {!noLabel && (
          <Form.Label className='mb-3'>{label || children || ''}</Form.Label>
        )}
        <div>{props?.subLabel}</div>
        <div className='input-wrapper'>
          {!error && !noClear && (
            <button
              className='btn clear-btn'
              onClick={() => props?.onClear(name)}
            >
              <AiFillCloseCircle />
            </button>
          )}
          <Form.Control
            control={control}
            ref={ref}
            type='text'
            isInvalid={invalid}
            {...controlProps}
            onChange={(e) => controlProps?.onChange(e)}
            {...props}
          />
        </div>

        {error && (
          <Form.Text style={{ color: 'red' }}>{error?.message}</Form.Text>
        )}
      </Form.Group>
    </Styles>
  );
}

export default InputField

const Styles = styled.div`
  width: 100%;

  .clear-btn {
    position: absolute;
    right: 0.2rem;
  }

  .input-wrapper {
    position: relative;
  }
`
