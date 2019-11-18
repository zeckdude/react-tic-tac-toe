import React, { Fragment } from 'react';
import './Board.css';
import Field from './Field';

function Board({ rows, setFieldValue, highlightedFields }) {
  function generateBoardFields() {

    return rows.map((row, rowIndex) => (
      <div className="row">{row.map((field, columnIndex) => {
        const isHighlightedField = highlightedFields.some(highlightedField => highlightedField.rowIndex === rowIndex && highlightedField.columnIndex === columnIndex);
        return <Field value={field} isHighlighted={isHighlightedField} setFieldValue={setFieldValue(rowIndex, columnIndex)} />;
      })}</div>
    ));

    // return (
    //     <div className="row"><Field /><Field /><Field /></div>
    //     <div className="row"><Field /><Field /><Field /></div>
    //     <div className="row"><Field /><Field /><Field /></div>
    // );
  }

  return (
    <div className="board">
      {generateBoardFields()}
    </div>
  );
}

export default Board;