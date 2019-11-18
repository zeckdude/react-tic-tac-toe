import React, { useState, useEffect, Fragment } from 'react';
import Board from './Board';
import { delay, getRandomValueInArray } from '../helpers';
import './Game.css';

const gameSize = 3;

function Game({ players, resetGameOptions }) {
  const [board, setBoard] = useState(generateBoard(gameSize));
  const [gameHistory, setGameHistory] = useState([]);
  const [activePlayer, setActivePlayer] = useState(0);
  const [instructions, setInstructions] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);
  const [highlightedFields, setHighlightedFields] = useState([]);

  function resetGame() {
    setBoard(generateBoard(gameSize));
    setGameHistory([]);
    setActivePlayer(0);
    setIsGameOver(false);
    setHighlightedFields([]);
    resetGameOptions();
  }

  useEffect(() => {
    console.log('1');
    if (players) {
      console.log('2');
      setInstructions(`${players[activePlayer].name}'s turn`);
    }

    if (activePlayer === 0 && !gameHistory.length) {
      return;
    }

    if (didSomeoneWin()) {
      return;
    }

    setInstructions(`${players[activePlayer].name}'s turn`);

    if (players[activePlayer].type === 'bot') {
      delay(1500).then(() => {
        const { rowIndex, columnIndex } = getRandomEmptyField();
        setFieldValue(rowIndex, columnIndex)(true);
      });
    }
  }, [activePlayer]);

  // useEffect(() => {
  //   if (players) {
  //     setInstructions(`${players[activePlayer].name}'s turn`);
  //   }
  // }, [players]);

  function generateBoard(gridLength) {
    const rows = Array(gridLength).fill(
      Array(gridLength).fill(null)
    );

    return {
      rows
    }
  }

  function getRandomEmptyField() {
    const emptyFields = [];
    for (let rowIndex = 0; rowIndex < board.rows.length; rowIndex++) {
      for (let columnIndex = 0; columnIndex < board.rows.length; columnIndex++) {
        if (!board.rows[rowIndex][columnIndex]) {
          emptyFields.push({ rowIndex, columnIndex });
        }
      }
    }
    const randomEmptyField = getRandomValueInArray(emptyFields);
    return randomEmptyField;
  }

  function getNextPlayerIndex() {
    const nextPlayerIndex = activePlayer === players.length - 1 ? 0 : activePlayer + 1;
    return nextPlayerIndex;
  }

  function switchToNextPlayer() {
    const nextPlayerIndex = getNextPlayerIndex();
    setActivePlayer(nextPlayerIndex);
  }

  function getRandomPlayer() {
    return getRandomValueInArray(players);
  }

  function getDownwardDiagonalCoordinates() {
    const downDiagonalCoordinates = [];
    for (let i = 0; i < board.rows.length; i++) {
      downDiagonalCoordinates.push({ rowIndex: i, columnIndex: i });
    }
    return downDiagonalCoordinates;
  }

  function didDownwardDiagonalWin() {
    // Create an array of the downward diagonal
    const downDiagonalValues = [];
    for (let i = 0; i < board.rows.length; i++) {
      downDiagonalValues.push(board.rows[i][i]);
    }
    return downDiagonalValues.every(value => value !== null && value === downDiagonalValues[0]);
  }

  function getUpwardDiagonalCoordinates() {
    const upDiagonalCoordinates = [];
    const columnIndex = 0;
    for (let rowIndex = board.rows.length - 1; rowIndex >= 0; rowIndex--) {
      upDiagonalCoordinates.push({ rowIndex, columnIndex });
      columnIndex++;
    }
    return upDiagonalCoordinates;
  }

  function didUpwardDiagonalWin() {
    // Create an array of the upward diagonal
    const upDiagonalValues = [];
    const columnIndex = 0;
    for (let rowIndex = board.rows.length - 1; rowIndex >= 0; rowIndex--) {
      upDiagonalValues.push(board.rows[rowIndex][columnIndex]);
      columnIndex++;
    }
    return upDiagonalValues.every(value => value !== null && value === upDiagonalValues[0]);
  }

  function areAllFieldsFilled() {
    return board.rows
      .flat()
      .filter(fieldValue => fieldValue === null)
      .length === 0;
  }

  function getRowCoordinates(rowIndex) {
    return board.rows[rowIndex].map((value, columnIndex) => ({ rowIndex, columnIndex }));
  }

  function didRowWin(rowIndex) {
    return board.rows[rowIndex].every(value => value !== null && value === board.rows[rowIndex][0]);
  }

  function getColumnCoordinates(columnIndex) {
    return board.rows.map((row, rowIndex) => ({ rowIndex, columnIndex }));
  }

  function didColumnWin(columnIndex) {
    const columnValues = board.rows.map(row => row[columnIndex]);
    return columnValues.every(value => value !== null && value === columnValues[0]);
  }

  function didSomeoneWin() {
    if (!gameHistory.length) {
      return false;
    }

    const { rowIndex, columnIndex, player } = gameHistory[gameHistory.length - 1];

    const isRowWinner = didRowWin(rowIndex);
    const isColumnWinner = didColumnWin(columnIndex);
    const isDownwardDiagonalWinner = didDownwardDiagonalWin();
    const isUpwardDiagonalWinner = didUpwardDiagonalWin();

    if (isRowWinner || isColumnWinner || isDownwardDiagonalWinner || isUpwardDiagonalWinner) {
      let winningCombination;
      if (isRowWinner) {
        winningCombination = getRowCoordinates(rowIndex);
      } else if (isColumnWinner) {
        winningCombination = getColumnCoordinates(columnIndex);
      } else if (isDownwardDiagonalWinner) {
        winningCombination = getDownwardDiagonalCoordinates();
      } else {
        winningCombination = getUpwardDiagonalCoordinates();
      }
      setHighlightedFields(winningCombination);

      setInstructions(`${player.name} won!`);
      setIsGameOver(true);
      return true;
    }

    if (areAllFieldsFilled()) {
      setInstructions(`It's a draw!`);
      setIsGameOver(true);
      return true;
    }

    return false;
  }

  function setFieldValue(rowIndex, columnIndex) {
    return function(isBotMove) {
      const player = players[activePlayer];

      if (player.type === 'bot' && !isBotMove) {
        return;
      }

      // Look into immutable react helper
      const boardCopy = { ...board };
      const rowsCopy = [ ...boardCopy.rows ];
      const rowCopy = [ ...rowsCopy[rowIndex] ];
      const fieldValue = rowCopy[columnIndex];

      rowCopy.splice(columnIndex, 1, player.turnValue);
      rowsCopy.splice(rowIndex, 1, rowCopy);
      boardCopy.rows = rowsCopy;

      setBoard(boardCopy);

      setGameHistory([
        ...gameHistory,
        { rowIndex, columnIndex, player }
      ]);
      switchToNextPlayer();
    }
  }

  return (
    <div className="game">
      <Board rows={board.rows} highlightedFields={highlightedFields} setFieldValue={setFieldValue}  />
      <h3 className="instructions">{instructions}</h3>
      {isGameOver && <button className="button" onClick={resetGame}>Play Again?</button>}
    </div>
  );
}

export default Game;
