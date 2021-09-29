import { useEffect, useState, useRef, memo } from 'react';
import useLocalStorageHook from '../utils/useLocalStorageHook';
import useArrayHook from '../utils/useArrayHook';
import { styled } from '@mui/material/styles';
import { Container, Box, Grid, Paper, Button, Typography } from '@mui/material';
import ImgCard from '../components/ImgCard';
import Heading from '../components/Heading';
import Time from '../components/Time';
import Score from '../components/Score';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Game() {
  const data = useLocalStorageHook();
  const util = useArrayHook();
  const [scoreCount, setScoreCount] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [gridArray, setGridArray] = useState([]);
  const [startTimer, setStartTimer] = useState(0);
  const [restartTimeLimit, setRestartTimeLimit] = useState(0);

  const player = useRef({});
  const level = useRef(0);
  const numberOfCards = useRef(0);
  const isInitialMount = useRef(true);
  const previousIndex = useRef(-1);
  const twoCardsArray = useRef([]);
  const gameStarted = localStorage.getItem('gameStarted');
  let timer = null;

  function shuffleImages(array) {
    const length = array.length;
    for (let i = length; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * i);
      const currentIndex = i - 1;
      const temp = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temp;
    }
    return array;
  }

  useEffect(() => {
    player.current = data.getCurrentPlayer();
    level.current = player.current.level + 1;
    if (gameStarted === 'CONTINUE') {
      level.current + 1;
      setScoreCount(data.getCurrentPlayer().score);
    }
    numberOfCards.current = level.current * 2 * (level.current * 2);
    setGridArray(shuffleImages(util.createArray(numberOfCards.current)));
  }, []);

  // get time left and save in local storage
  const addPoints = () => {
    setScoreCount(scoreCount + 2);
  };

  const levelCompleted = (array) => {
    let allIsInactive = array.every((item) => item.isInactive === true);
    return allIsInactive;
  };

  const saveToLocalStorageAndStartNextLevel = () => {
    const calculatedScore = totalScore + 10;
    data.increaseCurrentPlayerLevelAndAddScoreAndUpdateDatabase(
      calculatedScore
    );
    setScoreCount(calculatedScore);
    level.current++;
    numberOfCards.current = level.current * 2 * (level.current * 2);
    setGridArray(shuffleImages(util.createArray(numberOfCards.current)));
    // vrijeme ostalo za score
  };

  const emptyTwoCardsArrayAndRerender = () => {
    twoCardsArray.current.pop();
    twoCardsArray.current.pop();
    setClicks(clicks + 1);
  };

  const checkClickedCards = () => {
    if (twoCardsArray.current[0].id === twoCardsArray.current[1].id) {
      gridArray[twoCardsArray.current[0].cardIndex].isInactive = true;
      gridArray[twoCardsArray.current[1].cardIndex].isInactive = true;
      addPoints();
    } else {
      gridArray[twoCardsArray.current[0].cardIndex].isFlipped = false;
      gridArray[twoCardsArray.current[1].cardIndex].isFlipped = false;
    }

    if (levelCompleted(gridArray)) {
      setTotalScore(scoreCount + 2);
    } else {
      setGridArray(gridArray);
    }
    emptyTwoCardsArrayAndRerender();
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = true;
    } else {
      saveToLocalStorageAndStartNextLevel();
    }
  }, [totalScore]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      timer = setTimeout(() => {
        console.log('This will run after 1 second! countClicks: ' + clicks);
        checkClickedCards();
      }, 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [startTimer]);

  const isNotPreviousOrInactive = (index) => {
    return !gridArray[index].isInactive
      ? previousIndex.current !== index
      : false;
  };

  const updateCardAndGridArray = (index) => {
    gridArray[index].isFlipped = true;
    setGridArray(gridArray);
    // clicks d to rerender
    setClicks(clicks + 1);
  };

  const checkTwoCardsArraySize = () => {
    if (twoCardsArray.current.length > 1) {
      clearTimeout(timer);
      checkClickedCards();
    }
  };

  const addCardValuesToTwoCardsArray = (index) => {
    const clickedCard = { cardIndex: index, id: gridArray[index].id };
    twoCardsArray.current.push(clickedCard);
  };

  const startTimerIfTwoCardsAdded = () => {
    if (twoCardsArray.current.length > 1) {
      setStartTimer(startTimer + 1);
    }
  };

  const handleClicks = (index) => {
    if (isNotPreviousOrInactive(index)) {
      previousIndex.current = index;
      checkTwoCardsArraySize();
      updateCardAndGridArray(index);
      addCardValuesToTwoCardsArray(index);
      startTimerIfTwoCardsAdded();
    }
  };

  const restartCurrentLevel = () => {
    setRestartTimeLimit(restartTimeLimit + 1);
    numberOfCards.current = level.current * 2 * (level.current * 2);
    setGridArray(shuffleImages(util.createArray(numberOfCards.current)));
    setScoreCount(data.getCurrentPlayer().score);
  };

  // modal ubaciti
  // restart only on current level
  // not going back to zero
  return (
    <Container maxWidth="md">
      <Heading
        name={player.current.name}
        level={level.current - 1}
        gameStarted={gameStarted}
      />
      <Box sx={{ flexGrow: 1 }} paddingTop={1}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid
                container
                spacing={1}
                columns={level.current * 2 * (level.current * 2)}
              >
                {gridArray.map((card, index) => (
                  <Grid item xs={level.current * 2} key={index}>
                    <ImgCard
                      key={index}
                      card={card}
                      index={index}
                      onClick={handleClicks}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Item>
              <Score score={scoreCount} />
            </Item>
          </Grid>
          <Grid item xs={4}>
            <Item>
              <Button
                size="large"
                fullWidth
                color="warning"
                variant="contained"
                // interni restart logika
                onClick={() => restartCurrentLevel()}
              >
                <Typography>restart</Typography>
              </Button>
            </Item>
          </Grid>
          <Grid item xs={4}>
            <Item>
              <Time level={level.current - 1} restart={restartTimeLimit} />
            </Item>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
