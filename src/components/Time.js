import React, { useEffect, useState, useRef } from 'react';
import Typography from '@mui/material/Typography';

export default function Time(props) {
  const { level, restart } = props;
  const [timeCounter, setTimeCounter] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const previousLevel = useRef(0);
  const levelTimeLimit = useRef(0);
  let timer = null;

  const calculateLevelTimeLimit = (level) => {
    return (((level + 1) * (level + 1)) / 2) * 60;
  };

  // lifting state up
  const settingUpNewInterval = () => {
    clearInterval(timer);
    levelTimeLimit.current = calculateLevelTimeLimit(level + 1);
    previousLevel.current = level;
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
    levelTimeLimit.current = calculateLevelTimeLimit(currentLevel + 1);
    previousLevel.current = level;
    setTimeCounter(levelTimeLimit.current);
  }, []);

  useEffect(() => {
    timer =
      levelTimeLimit.current >= 0 &&
      setInterval(() => {
        setTimeCounter(levelTimeLimit.current--);
        if (levelTimeLimit.current < 1) {
          clearInterval(timer);
        }
      }, 1000);
    return () => clearInterval(timer);
  }, [currentLevel]);

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
