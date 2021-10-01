import { useEffect, useState, useRef, memo } from 'react';
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
    setOpenMatchesFoundModal(true);
  };

  const startNextLevel = () => {
    setScoreCount(data.getCurrentPlayer().score);
    level.current++;
    numberOfCards.current = level.current * 2 * (level.current * 2);
    setGridArray(shuffleImages(util.createArray(numberOfCards.current)));
  };

  const emptyTwoCardsArrayAndRerender = () => {
    twoCardsArray.current.pop();
    twoCardsArray.current.pop();
    setClicks(clicks + 1);
  };

  const addPoints = () => {
    setScoreCount(scoreCount + 2);
  };

  const checkIfJokerCard = (imageIndexAtTwoCards) => {
    if (imageIndexAtTwoCards === 0) {
      setJokerTime(jokerTime + 1);
    }
  };

  // CHECKING TWO CLICKED CARDS
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
  // AND IF TRUE SCORE IS SAVED TO LOCAL STORAGE AND USER IS TRANSFERED TO THE NEXT LEVEL
  useEffect(() => {
    if (mountedRef.current) {
      if (levelCompleted(gridArray)) {
        console.log(
          '1 if completed, score count use effect, and increase level'
        );
        console.log('counter time left', counterTimeLeft);
        getTimeLeft.current++;
        totalScore.current = totalScore.current + scoreCount;
      }
    }
  }, [scoreCount]);

  // CHECK IF LEVEL IS COMPLETED AFTER TWO EQUAL CARDS ARE FOUND AND SCORE IS INCREASED
  const levelCompleted = (array) => {
    let allIsInactive = array.every((item) => item.isInactive === true);
    return allIsInactive;
  };

  useEffect(() => {
    if (mountedRef.current) {
      timer = setTimeout(() => {
        checkClickedCards();
      }, 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [startTimer]);

  useEffect(() => {
    if (mountedRef.current) {
      console.log('3 use effect counter time left');
      saveToLocalStorageAndShowMatchesFoundModal();
    }
  }, [counterTimeLeft]);

  useEffect(() => {
    if (mountedRef.current) {
      if (timeExpired) {
        setOpenTimeExpiredModal(true);
      }
    }
  }, [timeExpired]);

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
    setTimeExpired(false);
  };

  // modal ubaciti
  console.log(gridArray);
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
