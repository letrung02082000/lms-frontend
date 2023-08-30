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
        key={`${props?.name}_${index}`}
        id={`${props?.name}_${index}`}
        onChange={e => {
          props.onChange(e.target.value)
        }}
        label={option?.label}
        value={option?.value}
      />
    )
  })

  return (
    <Styles>
      {props?.label && <Form.Label className="mb-3 fw-bold">{props?.label}</Form.Label>}
      <Form.Group className="ms-3">{generateCheck}</Form.Group>
    </Styles>
  )
}

export default RadioField

const Styles = styled.div`
  margin-bottom: 1rem;
`
