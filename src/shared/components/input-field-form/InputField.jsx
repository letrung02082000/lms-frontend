import React from 'react'
import { Form } from 'react-bootstrap'
import { useController } from 'react-hook-form'
import styled from 'styled-components'

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
    fieldState: { invalid, isTouched, isDirty, error },
  } = useController({
    name,
    control,
    rules: rules || { required: 'Vui lòng nhập trường này' },
    defaultValue,
  })

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
        {error && <Form.Text style={{color: 'red'}}>{error?.message}</Form.Text>}
      </Form.Group>
    </Styles>
  )
}

export default InputField

const Styles = styled.div`
  label {
  }
`
