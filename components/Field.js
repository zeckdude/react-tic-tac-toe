import React from 'react';
import './Field.css';

function Field({ value, setFieldValue, isHighlighted }) {
  function markField() {
    if (!value) {
      setFieldValue()
    }
  }

  return <div className={`field ${isHighlighted && 'highlighted'}`} onClick={markField}>{value}</div>
}

export default Field;