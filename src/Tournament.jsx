import React, { useState, useEffect } from 'react';
import TournamentReg from './TournamentReg';
import PingPongGameT from './PingPongGameT';

function Tournament() {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [players, setPlayers] = useState([]);
  const [matchups, setMatchups] = useState([]);
  const [regcomp, setRegcomp] = useState(false);
  const [currentMatchupIndex, setCurrentMatchupIndex] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [winners, setWinners] = useState([]);
  const [firstRoundCompleted, setFirstRoundCompleted] = useState(false);

  const handleSubmit = (playerData) => {
    setPlayers(playerData);
    setShowRegistrationForm(false);
    const newMatchups = createMatchups(playerData);
    setMatchups(newMatchups);
    setRegcomp(true);
  };

  const createMatchups = (players) => {
	const allPlayers = [...players, ...winners];
	const shuffledPlayers = [...allPlayers].sort(() => 0.5 - Math.random());
	const matchups = [];
	const numPlayers = winners.length;
	for (let i = 0; i < numPlayers; i += 2) {
	  matchups.push([shuffledPlayers[i], shuffledPlayers[i + 1]]);
	}
	return matchups;
  };

  const startMatch = (index) => {
    setCurrentMatchupIndex(index);
    setGameStarted(true);
  };

  const handleFinishMatch = (winner) => {
    setWinners([...winners, winner]);
    setCurrentMatchupIndex(null);
    setGameStarted(false);
  };

  useEffect(() => {
    if (currentMatchupIndex === null) return;
    if (currentMatchupIndex === matchups.length - 1) {
      setFirstRoundCompleted(true);
    }
  }, [currentMatchupIndex, matchups.length]); // Abhängigkeit hinzufügen

  useEffect(() => {
    if (firstRoundCompleted && winners.length === players.length / 2) {
      const newMatchups = createMatchups(winners);
      setMatchups(newMatchups);
      setFirstRoundCompleted(false);
    }
  }, [firstRoundCompleted, winners, players]); // Abhängigkeiten hinzufügen

  return (
    <div>
      {!gameStarted && <h1>Tournament</h1>}
      {!showRegistrationForm && !regcomp && !gameStarted && (
        <button onClick={() => setShowRegistrationForm(true)}>Tournament Registration</button>
      )}
      {!gameStarted && (
        <div>
          <ul>
            {matchups.map((matchup, index) => (
              <li key={index}>
                <span>{`${matchup[0]} vs ${matchup[1]}`}</span>
                <button onClick={() => startMatch(index)}>Start Match</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {showRegistrationForm && <TournamentReg onSubmit={handleSubmit} />}
      {gameStarted && (
        <PingPongGameT
          player1={matchups[currentMatchupIndex][0]}
          player2={matchups[currentMatchupIndex][1]}
          onFinish={handleFinishMatch}
        />
      )}
      {firstRoundCompleted && winners.length > 0 && (
        <div>
          <h2>Next Matchups</h2>
          <ul>
            {matchups.map((matchup, index) => (
              <li key={index}>
                <span>{`${matchup[0]} vs ${matchup[1]}`}</span>
                <button onClick={() => startMatch(index)}>Start Match</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Tournament;
