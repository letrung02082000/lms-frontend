import React from 'react'
import { Form } from 'react-bootstrap'
import { useController } from 'react-hook-form'
import Select from 'react-select'
import styled from 'styled-components'
import Asterisk from './Asterisk'

function SelectField({ name, control, rules, defaultValue, hasAsterisk, ...props }) {
  const {
    field: { ref, ...controlProps },
    fieldState: { invalid, isTouched, isDirty, error }
  } = useController({
    name,
    control,
    rules: rules || { required: 'Vui lòng nhập trường này' },
    defaultValue
  })

  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? '#ddd' : !invalid ? '#ddd' : 'red',
      // overwrittes hover style
      '&:hover': {
        borderColor: state.isFocused ? '#ddd' : !invalid ? '#ddd' : 'red'
      }
    })
  }

  return (
    <Styles>
      <Form.Group className="mb-3 mt-3">
        {props?.label && <Form.Label>{props?.label || props?.children || ''}{hasAsterisk && <Asterisk/>}</Form.Label>}
        <Select
          styles={customStyles}
          options={props?.options || []}
          control={control}
          ref={ref}
          isInvalid={invalid}
          {...controlProps}
          onChange={e => controlProps?.onChange(e)}
        />
        {error && <Form.Text style={{ color: 'red' }}>{error?.message}</Form.Text>}
      </Form.Group>
    </Styles>
  )
}

export default SelectField

const Styles = styled.div``
