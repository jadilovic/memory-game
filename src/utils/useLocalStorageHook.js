import React from 'react';

const useLocalStorageHook = () => {
  const getAllPlayers = () => {
    return JSON.parse(localStorage.getItem('players') || '[]');
  };

  const getCurrentPlayer = () => {
    return JSON.parse(localStorage.getItem('currentPlayer'));
  };

  const addNewPlayerObjectToArrayAndSave = (newPlayer) => {
    const players = getAllPlayers();
    players.push(newPlayer);
    localStorage.setItem('players', JSON.stringify(players));
  };

  const saveCurrentPlayerObject = (player) => {
    localStorage.setItem('currentPlayer', JSON.stringify(player));
  };

  const increaseCurrentPlayerLevelAndAddScoreAndUpdateDatabase = (
    scoreCount
  ) => {
    const currentPlayer = getCurrentPlayer();
    const updateCurrentPlayer = {
      ...currentPlayer,
      level: currentPlayer.level + 1,
      score: scoreCount,
    };
    localStorage.setItem('currentPlayer', JSON.stringify(updateCurrentPlayer));
    const players = getAllPlayers();
    const currentPlayerIndex = players.findIndex(
      (player) => player.name == currentPlayer.name
    );
    players[currentPlayerIndex].level++;
    players[currentPlayerIndex].score = scoreCount;
    localStorage.setItem('players', JSON.stringify(players));
  };

  const addUpdatedCurrentPlayerToArrayAndSave = (currentPlayer) => {
    const players = getAllPlayers();
    const currentPlayerIndex = players.findIndex(
      (player) => player.name == currentPlayer.name
    );
    players[currentPlayerIndex] = currentPlayer;
    localStorage.setItem('players', JSON.stringify(players));
  };

  const restartCurrentPlayerLevelAndScoreAndUpdateDatabase = (
    currentPlayer
  ) => {
    const updateCurrentPlayer = {
      ...currentPlayer,
      level: 0,
      score: 0,
    };
    localStorage.setItem('currentPlayer', JSON.stringify(updateCurrentPlayer));
    addUpdatedCurrentPlayerToArrayAndSave(updateCurrentPlayer);
  };

  return {
    getAllPlayers,
    getCurrentPlayer,
    addNewPlayerObjectToArrayAndSave,
    saveCurrentPlayerObject,
    increaseCurrentPlayerLevelAndAddScoreAndUpdateDatabase,
    restartCurrentPlayerLevelAndScoreAndUpdateDatabase,
    addUpdatedCurrentPlayerToArrayAndSave,
  };
};

export default useLocalStorageHook;
