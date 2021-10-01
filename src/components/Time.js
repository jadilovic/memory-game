import React, { useEffect, useState, useRef } from 'react';
import Typography from '@mui/material/Typography';

export default function Time(props) {
  const {
    level,
    restart,
    setCounterTimeLeft,
    jokerTime,
    getTimeLeft,
    setTimeExpired,
  } = props;
  const [timeCounter, setTimeCounter] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const previousLevel = useRef(0);
  const levelTimeLimit = useRef(0);
  let timer = null;

  const calculateLevelTimeLimit = (level) => {
    return (((level + 1) * (level + 1)) / 2) * 10;
  };

  useEffect(() => {
    const calculateJokerTime = Math.floor(
      0.15 * calculateLevelTimeLimit(level + 1)
    );
    levelTimeLimit.current += calculateJokerTime;
  }, [jokerTime]);

  const settingUpNewInterval = () => {
    clearInterval(timer);
    levelTimeLimit.current = calculateLevelTimeLimit(level + 1);
    previousLevel.current = level;
    console.log('current level: ', currentLevel);
    console.log('level: ', level);
    setTimeCounter(levelTimeLimit.current);
    setCurrentLevel(level);
  };

  useEffect(() => {
    if (previousLevel.current !== level) {
      settingUpNewInterval();
    }
  }, [level]);

  useEffect(() => {
    settingUpNewInterval();
  }, [restart]);

  useEffect(() => {
    console.log('get time use effect ', level);
    if (level !== -1) {
      console.log('2 current level time limit', levelTimeLimit.current);
      setCounterTimeLeft(levelTimeLimit.current);
    }
  }, [getTimeLeft]);

  useEffect(() => {
    levelTimeLimit.current = calculateLevelTimeLimit(currentLevel + 1);
    previousLevel.current = level;
  }, []);

  useEffect(() => {
    console.log(
      'current level use effect levelTimeLimit.current',
      levelTimeLimit.current
    );
    timer =
      levelTimeLimit.current >= 0 &&
      setInterval(() => {
        setTimeCounter(levelTimeLimit.current--);
        if (levelTimeLimit.current < 0) {
          clearInterval(timer);
        }
      }, 1000);
    return () => clearInterval(timer);
  }, [currentLevel, restart]);

  useEffect(() => {
    if (levelTimeLimit.current === 0) {
      setTimeExpired(true);
    }
  }, [timeCounter]);

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
