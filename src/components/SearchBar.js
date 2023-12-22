import React, { useState } from 'react'
import { BiSearch } from 'react-icons/bi'
import styles from './searchBar.module.css'

function SearchBar({ placeholder, onChange, focusText, onKeyPress, value, ...props }) {
  const [placeholderText, setPlaceholderText] = useState(placeholder)

  const handleFocus = () => {
    if (focusText) {
      setPlaceholderText(focusText)
    }
  }
  return (
    <div className='d-flex border rounded' {...props}>
      <div className='m-2'>
        <BiSearch size={25} />
      </div>
      <div className={styles.searchBox}>
        <form>
          <input
            type="text"
            placeholder={placeholderText || 'Tìm kiếm'}
            onChange={onChange}
            onKeyPress={onKeyPress || null}
            onFocus={handleFocus}
            value={value}
          />
        </form>
      </div>
    </div>
  )
}

export default SearchBar
