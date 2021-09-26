import React, { useEffect, useState } from 'react';
import useLocalStorageHook from '../utils/useLocalStorageHook';
import Typography from '@mui/material/Typography';

export default function Time() {
  const data = useLocalStorageHook();
  const [timeCounter, setTimeCounter] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(data.getCurrentPlayer());

  const calculateLevelTimeLimit = (player) => {
    return (((currentPlayer.level + 1) * (currentPlayer.level + 1)) / 2) * 60;
  };

  useEffect(() => {
    let levelTimeLimit = calculateLevelTimeLimit(currentPlayer);
    const timer =
      levelTimeLimit >= 0 &&
      setInterval(() => {
        setTimeCounter(levelTimeLimit--);
        if (levelTimeLimit < 1) {
          clearInterval(timer);
        }
      }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <React.Fragment>
      <Typography
        component="h6"
        variant="h6"
        color="white"
        bgcolor="red"
        gutterBottom
      >
        Time left:
      </Typography>
      <Typography component="p" variant="h6">
        {timeCounter}
      </Typography>
    </React.Fragment>
  );
}
