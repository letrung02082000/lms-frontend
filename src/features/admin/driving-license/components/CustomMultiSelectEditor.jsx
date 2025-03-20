import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';

const CustomMultiSelectEditor = ({ value, onValueChanged, options }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  console.log(options);
  const inputRef = useRef(null);

  useEffect(() => {
    if (value) {
      setSelectedOptions(
        value.map((v) => options.find((opt) => opt.value === v))
      );
    }
  }, [value, options]);

  const handleChange = (selected) => {
    setSelectedOptions(selected);
    onValueChanged(selected.map((opt) => opt.value));
  };

  return (
    <Select
      ref={inputRef}
      isMulti
      value={[
        {
          label: 'C',
          value: 'C',
        },
        {
          label: 'D',
          value: 'D',
        },
      ]}
      onChange={handleChange}
      options={options}
      autoFocus
    />
  );
};

export default CustomMultiSelectEditor;
