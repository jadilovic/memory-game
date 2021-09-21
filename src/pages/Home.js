import React from 'react';
import { useLocation } from 'react-router-dom';

const Home = () => {
  const location = useLocation();
  const player = location.state;
  console.log(player);
  const players = JSON.parse(localStorage.getItem('players') || '[]');
  console.log(players);
  return (
    <div>
      <p>{player.name}</p>
      <p>{player.level}</p>
      <p>{player.score}</p>
    </div>
  );
};

export default Home;
