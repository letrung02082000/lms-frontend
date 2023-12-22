import React from 'react'
import { Form } from 'react-bootstrap'
import styled from 'styled-components'
import Asterisk from './Asterisk'

function RadioField({ hasAsterisk, label, noLabel, children, ...props }) {
  const generateCheck = props?.options?.map((option, index) => {
    return (
      <Form.Check
        className="mb-3"
        name={props?.name}
        type={option?.type || 'radio'}
        key={`${props?.name}_${index}`}
        id={`${props?.name}_${index}`}
        onChange={e => {
          props.onChange(e.target.value)
        }}
        label={option?.label}
        value={option?.value}
        defaultChecked={props?.defaultChecked === option?.value}
      />
    )
  })

  return (
    <Styles>
      {!noLabel && (
        <Form.Label className='d-block'>
          {label || children || ''}
          {hasAsterisk && <Asterisk />}
        </Form.Label>
      )}
      <Form.Group className='ms-1'>{generateCheck}</Form.Group>
    </Styles>
  );
}

export default RadioField

const Styles = styled.div`
  margin-bottom: 1rem;
`
