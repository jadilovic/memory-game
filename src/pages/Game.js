import { useEffect, useState, useRef } from 'react';
import useLocalStorageHook from '../utils/useLocalStorageHook';
import useArrayHook from '../utils/useArrayHook';
import useMountedRef from '../utils/useMountedRef';
import TimeExpiredModal from '../components/TimeExpiredModal';
import MatchesFoundModal from '../components/MatchesFoundModal';
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
  const mountedRef = useMountedRef();
  const [scoreCount, setScoreCount] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [gridArray, setGridArray] = useState([]);
  const [startTimer, setStartTimer] = useState(0);
  const [restartTimeLimit, setRestartTimeLimit] = useState(0);
  const [counterTimeLeft, setCounterTimeLeft] = useState(0);
  const [jokerTime, setJokerTime] = useState(0);
  const [timeExpired, setTimeExpired] = useState(false);
  const [openTimeExpiredModal, setOpenTimeExpiredModal] = useState(false);
  const [openMatchesFoundModal, setOpenMatchesFoundModal] = useState(false);

  const player = useRef({});
  const level = useRef(0);
  const numberOfCards = useRef(0);
  const previousIndex = useRef(-1);
  const twoCardsArray = useRef([]);
  const totalScore = useRef(0);
  const getTimeLeft = useRef(0);
  const gameStarted = localStorage.getItem('gameStarted');
  let timer = null;

  console.log('START TIMER VALUE INITIAL: ', startTimer);

  function shuffleImages(array) {
    console.log('selected card: ', array[0].type);
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

  // INITIAL USE EFFECT TO CREATE GRID OF CARDS SET SCORE AND TIME AT THE START OF THE GAME
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

  // AFTER LEVEL IS COMPLETED FINAL SCORE IS CALCULATED AND ALL IS SAVED TO LOCAL STORAGE
  const saveToLocalStorageAndShowMatchesFoundModal = () => {
    console.log('4 save method ', counterTimeLeft);
    const calculatedScore = totalScore.current + counterTimeLeft;
    data.increaseCurrentPlayerLevelAndAddScoreAndUpdateDatabase(
      calculatedScore
    );
    // MODAL IS CALLED IN THE END
    setOpenMatchesFoundModal(true);
  };

  // PLAYERS IS TAKEN TO THE NEXT LEVEL
  const startNextLevel = () => {
    setScoreCount(data.getCurrentPlayer().score);
    level.current++;
    numberOfCards.current = level.current * 2 * (level.current * 2);
    setGridArray(shuffleImages(util.createArray(numberOfCards.current)));
  };

  // IF TWO CARDS MATCH CHECK IF THEY ARE JOKER CARDS
  const checkIfJokerCard = (imageIndexAtTwoCards) => {
    if (imageIndexAtTwoCards === 0) {
      setJokerTime(jokerTime + 1);
    }
  };

  // ADD TWO POINTS TO THE SCORE IF SET OF CARDS ARE MATCHED
  const addPoints = () => {
    setScoreCount(scoreCount + 2);
  };

  // AFTER CHECKING THE CARDS ARRAY IS EMPTIED
  const emptyTwoCardsArrayAndRerender = () => {
    twoCardsArray.current.pop();
    twoCardsArray.current.pop();
    setClicks(clicks + 1);
  };

  // CHECKING TWO CLICKED CARDS MATCH
  const checkClickedCards = () => {
    if (twoCardsArray.current[0].id === twoCardsArray.current[1].id) {
      gridArray[twoCardsArray.current[0].cardIndex].isInactive = true;
      gridArray[twoCardsArray.current[1].cardIndex].isInactive = true;
      checkIfJokerCard(
        gridArray[twoCardsArray.current[0].cardIndex].imageIndex
      );
      addPoints();
    } else {
      gridArray[twoCardsArray.current[0].cardIndex].isFlipped = false;
      gridArray[twoCardsArray.current[1].cardIndex].isFlipped = false;
    }
    setGridArray(gridArray);
    emptyTwoCardsArrayAndRerender();
  };

  // EVERY TIME POINTS ARE ADDED THIS USE EFFECT IS CALLED TO CHECK IF LEVEL IS COMPLETED
  // AND IF TRUE REMAININGT TIME IS EXTRACTED AND TOTAL SCORE CALCULATED
  useEffect(() => {
    if (mountedRef.current) {
      if (levelCompleted(gridArray)) {
        // THIS CHANGE CALLS USE EFFECT IN TIME COMPONENT WHICH SETS COUNTER TIME LEFT
        getTimeLeft.current++;
        totalScore.current = totalScore.current + scoreCount;
      }
    }
  }, [scoreCount]);

  // CHECK IF LEVEL IS COMPLETED AFTER SCORE IS INCREASED
  const levelCompleted = (array) => {
    let allIsInactive = array.every((item) => item.isInactive === true);
    return allIsInactive;
  };

  // THREE USE EFFECTS

  // ONE SECOND TIME OUT AFTER TWO CARDS CLICKED BEFORE THEY ARE CHECKED
  useEffect(() => {
    console.log('START TIMER VALUE IN USE EFFECT: ', startTimer);
    if (mountedRef.current) {
      timer = setTimeout(() => {
        checkClickedCards();
      }, 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [startTimer]);

  // IF LEVEL IS COMPLETED 'getTimeLeft' IS CHANGED TO GET LEFT TIME FROM TIME COMPONENT
  useEffect(() => {
    console.log('COUNTER TIMER LEFT');
    if (mountedRef.current) {
      // NEW PLAYER SCORE AND LEVEL IS SAVED AND MODAL IS CALLED
      saveToLocalStorageAndShowMatchesFoundModal();
    }
  }, [counterTimeLeft]);

  // IF LEVEL TIME HAS EXPIRED THIS USE EFFECT OPENS TIME EXPIRED MODAL
  useEffect(() => {
    console.log('TIME EXPIRED');
    if (mountedRef.current) {
      if (timeExpired) {
        setOpenTimeExpiredModal(true);
      }
    }
  }, [timeExpired]);

  // CHECKING WHAT SIDE OF THE CARD TO SHOW ON THE GRID
  const isNotPreviousOrInactive = (index) => {
    return !gridArray[index].isInactive
      ? previousIndex.current !== index
      : false;
  };

  // AFTER EVERY CLICK UPDATE CLICKED CARD IN THE CARD ARRAY
  const updateCardAndGridArray = (index) => {
    gridArray[index].isFlipped = true;
    setGridArray(gridArray);
    // SET CLICKS TO RERENDER
    setClicks(clicks + 1);
  };

  // CHECKING IF TWO CARDS WERE ADDED TO THE ARRAY
  const checkTwoCardsArraySize = () => {
    if (twoCardsArray.current.length > 1) {
      clearTimeout(timer);
      checkClickedCards();
    }
  };

  // ADDING CLICKED CARDS TO THE TWO CARDS ARRAY
  const addCardValuesToTwoCardsArray = (index) => {
    const clickedCard = { cardIndex: index, id: gridArray[index].id };
    twoCardsArray.current.push(clickedCard);
  };

  // AFTER EVERY CLICK CHECKING IF TWO CARDS ARE ADDED TO THE TWO CARDS ARRAY
  const startTimerIfTwoCardsAdded = () => {
    console.log('SET START TIMER IF TWO CARDS ADDED');
    if (twoCardsArray.current.length > 1) {
      // IF TWO CARDS ADDED SET START TIMER TO CALL ONE SECOND SET TIME OUT USE EFFECT
      setStartTimer(startTimer + 1);
    }
  };

  // EVERY CARD CLICK IS HANDLED HERE
  const handleClicks = (index) => {
    if (isNotPreviousOrInactive(index)) {
      previousIndex.current = index;
      checkTwoCardsArraySize();
      updateCardAndGridArray(index);
      addCardValuesToTwoCardsArray(index);
      startTimerIfTwoCardsAdded();
    }
  };

  // RESTARTING THE GAME AT THE SAME LEVEL
  const restartCurrentLevel = () => {
    setRestartTimeLimit(restartTimeLimit + 1);
    numberOfCards.current = level.current * 2 * (level.current * 2);
    setGridArray(shuffleImages(util.createArray(numberOfCards.current)));
    setScoreCount(data.getCurrentPlayer().score);
    setTimeExpired(false);
  };

  // ARRAY OF DISPLAYED CARDS
  console.log('array of displayed cards: ', gridArray);
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
              <Score
                score={
                  openMatchesFoundModal || openTimeExpiredModal
                    ? totalScore.current + counterTimeLeft
                    : scoreCount
                }
              />
            </Item>
          </Grid>
          <Grid item xs={4}>
            <Item>
              <Button
                size="large"
                fullWidth
                color="warning"
                variant="contained"
                onClick={() => restartCurrentLevel()}
              >
                <Typography>restart</Typography>
              </Button>
            </Item>
          </Grid>
          <Grid item xs={4}>
            <Item>
              <Time
                level={level.current - 1}
                restart={restartTimeLimit}
                setCounterTimeLeft={setCounterTimeLeft}
                jokerTime={jokerTime}
                getTimeLeft={getTimeLeft.current}
                setTimeExpired={setTimeExpired}
              />
            </Item>
          </Grid>
        </Grid>
      </Box>
      <TimeExpiredModal
        openTimeExpiredModal={openTimeExpiredModal}
        setOpenTimeExpiredModal={setOpenTimeExpiredModal}
        restartCurrentLevel={restartCurrentLevel}
      />
      <MatchesFoundModal
        openMatchesFoundModal={openMatchesFoundModal}
        setOpenMatchesFoundModal={setOpenMatchesFoundModal}
        startNextLevel={startNextLevel}
      />
    </Container>
  );
}
