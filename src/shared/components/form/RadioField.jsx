import React from 'react'
import { Form } from 'react-bootstrap'
import styled from 'styled-components'

function RadioField(props) {
  const generateCheck = props?.options?.map((option, index) => {
    return (
      <Form.Check
        className="mb-2"
        name={props?.name}
        type={option?.type || 'radio'}
        key={`${option?.label}_${index}`}
        onChange={e => props.onChange(e.target.value)}
        label={option?.label}
        value={option?.value}
        checked={option?.value === props?.checkValue}
      />
    )
  })

  return (
    <Styles>
      <Form.Label className="mb-3">{props?.label}</Form.Label>
      <Form.Group className="ms-3">{generateCheck}</Form.Group>
    </Styles>
  )
}

export default RadioField

const Styles = styled.div`
  margin-bottom: 1rem;
`
