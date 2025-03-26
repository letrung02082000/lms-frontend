import React, { useMemo } from 'react';
import { Form } from 'react-bootstrap';
import { useController } from 'react-hook-form';
import styled from 'styled-components';
import { AiFillCloseCircle } from 'react-icons/ai';
import Asterisk from './Asterisk';

const InputField = ({
  label,
  children,
  control,
  name,
  rules,
  defaultValue,
  hasAsterisk,
  noClear,
  ...props
}) => {
  const {
    field: { ref, value, ...controlProps },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
    defaultValue,
  });

  // Xác định có hiển thị nút Clear hay không
  const showClear = useMemo(() => value && !error && !noClear, [value, error, noClear]);

  return (
    <Styles type={props?.type}>
      <Form.Group>
        {label && (
          <Form.Label className="d-block">
            {label}
            {hasAsterisk && <Asterisk />}
          </Form.Label>
        )}
        {props.subLabel && <Form.Text className="d-block mb-2">{props.subLabel}</Form.Text>}

        <div className="input-wrapper">
          <Form.Control
            ref={ref}
            isInvalid={!!error}
            value={value ?? ''}
            {...controlProps}
            {...props}
          >
            {children}
          </Form.Control>
          {showClear && (
            <button
              type="button"
              className="clear-btn"
              onClick={() => controlProps.onChange('')}
            >
              <AiFillCloseCircle />
            </button>
          )}
        </div>

        {error && <Form.Text className="text-danger">{error.message}</Form.Text>}
      </Form.Group>
    </Styles>
  );
};

export default InputField;

const Styles = styled.div`
  width: 100%;

  .input-wrapper {
    position: relative;
  }

  .clear-btn {
    position: absolute;
    right: ${(props) => (props.type === 'date' ? '35px' : '10px')};
    top: 50%;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    color: #888;
    cursor: pointer;
    font-size: 18px;
  }

  .clear-btn:hover {
    color: black;
  }
`;
