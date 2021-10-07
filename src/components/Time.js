import React, { useEffect, useState, useRef } from 'react';
import Typography from '@mui/material/Typography';

export default function Time(props) {
  const {
    level,
    shouldRestartLevel,
    setCounterTimeLeft,
    foundJoker,
    totalScore,
    setTimeExpired,
  } = props;
  const [timeCounter, setTimeCounter] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const previousLevel = useRef(0);
  const levelTimeLimit = useRef(0);
  let timer = null;

  // CALCULATE TIME LIMIT BASED ON THE LEVEL
  const calculateLevelTimeLimit = (level) => {
    return (((level + 1) * (level + 1)) / 2) * 60;
  };

  // CALCULATING TIME LIMIT ON FIRST RENDER
  useEffect(() => {
    levelTimeLimit.current = calculateLevelTimeLimit(currentLevel + 1);
    previousLevel.current = level;
  }, []);

  // ADDING 15% EXTRA TIME TO THE GAME IF JOKER CARDS WERE MATCHED
  useEffect(() => {
    const calculateJokerTime = Math.floor(
      0.15 * calculateLevelTimeLimit(level + 1)
    );
    levelTimeLimit.current += calculateJokerTime;
  }, [foundJoker]);

  // SETTING UP NEW TIME LIMIT INTERVAL
  const settingUpNewInterval = () => {
    clearInterval(timer);
    levelTimeLimit.current = calculateLevelTimeLimit(level + 1);
    previousLevel.current = level;
    setTimeCounter(levelTimeLimit.current);
    setCurrentLevel(level);
  };

  // NEW TIME LIMIT INTERVAL IF LEVEL IS CHANGED
  useEffect(() => {
    if (previousLevel.current !== level) {
      settingUpNewInterval();
    }
  }, [level]);

  // NEW TIME LIMIT INTERVAL IF GAME IS RESTARTED
  useEffect(() => {
    settingUpNewInterval();
  }, [shouldRestartLevel]);

  // WHEN ALL CARDS WERE MATCHED COUNTER TIME LEFT IS SET TO BE USED IN TOTAL SCORE CALCULATION
  useEffect(() => {
    if (level !== -1) {
      setCounterTimeLeft(levelTimeLimit.current);
      levelTimeLimit.current = -2;
    }
  }, [totalScore]);

  // NEW TIME LIMIT IS STARTING COUNT DOWN EVERY NEW LEVEL AND WHEN GAME IS RESTARTED
  useEffect(() => {
    timer =
      levelTimeLimit.current >= 0 &&
      setInterval(() => {
        setTimeCounter(levelTimeLimit.current--);
        if (levelTimeLimit.current < 0) {
          clearInterval(timer);
        }
      }, 1000);
    return () => clearInterval(timer);
  }, [currentLevel, shouldRestartLevel]);

  // THIS USE EFFECT CHECKS EVERY SECOND IF TIME HAS EXPIRED, IF YES IT SETS 'timeExpired' TO TRUE
  useEffect(() => {
    if (levelTimeLimit.current === -1) {
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
        {timeCounter < 0 ? 0 : timeCounter}
      </Typography>
    </React.Fragment>
  );
}
