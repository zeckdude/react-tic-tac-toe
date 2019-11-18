import React, { useState, Fragment } from 'react';
import { render } from 'react-dom';
import Game from './components/Game';
import { getRandomValueInArray } from './helpers';
import './TicTacToe.css';

function TicTacToe() {
  const [players, setPlayers] = useState();
  const [gameType, setGameType] = useState(null);
  const [primaryPlayerName, setPrimaryPlayerName] = useState('');
  const [secondaryPlayerName, setSecondaryPlayerName] = useState('');

  function resetGameOptions() {
    setPlayers(null);
    setGameType(null);
    setPrimaryPlayerName('');
    setSecondaryPlayerName('');
  }

  function chooseGameType(gameType) {
    return function() {
      setGameType(gameType);
      localStorage.setItem('gameType', gameType);
    }
  }

  function setupGame() {
    const primaryPlayer = { name: primaryPlayerName || 'Player', type: 'human', turnValue: getRandomValueInArray(['X', 'O']) };

    const secondaryPlayerNameValue = gameType === 'computer' ? 'Bot' : secondaryPlayerName || 'Player 2';
    const secondaryPlayerType = gameType === 'computer' ? 'bot' : 'human';
    const secondaryPlayer = { name: secondaryPlayerNameValue, type: secondaryPlayerType, turnValue: primaryPlayer.turnValue === 'X' ? 'O': 'X' };

    setPlayers([
      primaryPlayer,
      secondaryPlayer
    ]);
  }

  function renderGame() {
    if (!players) {
      const secondaryPlayerNameValue = gameType === 'computer' ? 'Bot' : secondaryPlayerName;
      const secondaryPlayerNamePlaceholder = gameType === 'computer' ? 'Bot' : 'Player 2';

      return (
        <Fragment>
          <div className="game-choice">
            <button className={`button first-game-choice-button ${gameType === 'human' && 'selected'}`} onClick={chooseGameType('human')}>Against a player</button>
            <button className={`button ${gameType === 'computer' && 'selected'}`} onClick={chooseGameType('computer')}>Against the computer</button>
          </div>
          {gameType && (
            <Fragment>
              <div className="name-entry">
                <div>Your Name: <input type="text" placeholder="Player" value={primaryPlayerName} onChange={e => setPrimaryPlayerName(e.target.value)} /></div>
                <div>Opponent's Name: <input type="text" disabled={gameType === 'computer'} placeholder={secondaryPlayerNamePlaceholder} value={secondaryPlayerNameValue} onChange={e => setSecondaryPlayerName(e.target.value)} /></div>
              </div>
              <button className="button start-game-button" onClick={setupGame}>Start Game</button>
            </Fragment>
          )}
        </Fragment>
      );
    }

    return (
      <Game 
        players={players}
        resetGameOptions={resetGameOptions}
      />
    );
  }

  return (
    <div className="game">
      <h2>Play tic-tac-toe</h2>
      {renderGame()}
    </div>
  );
}

export default TicTacToe;
