import { useEffect, useState, useRef, memo } from 'react';
import useLocalStorageHook from '../utils/useLocalStorageHook';
import useArrayHook from '../utils/useArrayHook';
import { styled } from '@mui/material/styles';
import imagesList from '../images/imagesList';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { Container, Box, Grid, Paper, Button, Typography } from '@mui/material';
import Heading from '../components/Heading';
import Time from '../components/Time';
import Score from '../components/Score';
import guessed from '../images/guessed.png';
import questionMark from '../images/questionM.png';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

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

export default function Game() {
  const data = useLocalStorageHook();
  const util = useArrayHook();
  const [scoreCount, setScoreCount] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState({});
  const [gridArray, setGridArray] = useState([]);
  const [startTimer, setStartTimer] = useState(0);
  const [disableClicks, setDisableClicks] = useState(false);

  const level = useRef(0);
  const sizeOfGrid = useRef(0);
  const countClicks = useRef(0);
  const isInitialMount = useRef(true);
  const firstCard = useRef({ index: null, id: null });
  const secondCard = useRef({ index: null, id: null });
  const previousIndex = useRef(-1);

  useEffect(() => {
    const currentPlayer = data.getCurrentPlayer();
    setCurrentPlayer(currentPlayer);
    level.current = currentPlayer.level;
    sizeOfGrid.current = (level.current + 2) * (level.current + 2);
    setGridArray(shuffleImages(util.createArray(sizeOfGrid.current)));
  }, []);

  const addPoints = (e) => {
    e.preventDefault();
    setScoreCount(scoreCount + 1);
  };

  const levelCompleted = (array) => {
    let allIsInactive = array.every((item) => item.isInactive === true);
    return allIsInactive;
  };

  const checkClickedCards = () => {
    if (firstCard.current.id === secondCard.current.id) {
      gridArray[firstCard.current.index].isInactive = true;
      gridArray[secondCard.current.index].isInactive = true;
    } else {
      gridArray[firstCard.current.index].isFlipped = false;
      gridArray[secondCard.current.index].isFlipped = false;
    }

    if (levelCompleted(gridArray)) {
      // data.increaseCurrentPlayerLevelAndUpdateDatabase(currentPlayer);
      level.current++;
      sizeOfGrid.current = (level.current + 2) * (level.current + 2);
      setGridArray(shuffleImages(util.createArray(sizeOfGrid.current)));
    } else {
      setGridArray(gridArray);
    }
    setDisableClicks(false);
    setClicks(clicks + 1);
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      const timer = setTimeout(() => {
        console.log('This will run after 1 second! countClicks: ' + clicks);
        checkClickedCards();
      }, 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [startTimer]);

  const checkIsInactive = (index) => {
    return 'check is inactive';
  };

  const checkIsFlipped = (index) => {
    return 'check is flipped';
  };

  const handleClicks = (index) => {
    if (previousIndex.current !== index && index !== -2 && !disableClicks) {
      previousIndex.current = index;
      gridArray[index].isFlipped = true;
      setGridArray(gridArray);
      setClicks(clicks + 1);
      countClicks.current++;
      if (countClicks.current === 1) {
        firstCard.current.index = index;
        firstCard.current.id = gridArray[index].id;
      } else {
        secondCard.current.index = index;
        secondCard.current.id = gridArray[index].id;
      }
      if (countClicks.current > 1) {
        countClicks.current = 0;
        setDisableClicks(true);
        setStartTimer(startTimer + 1);
      }
    }
  };
  console.log(gridArray);
  console.log(sizeOfGrid.current);
  return (
    <Container maxWidth="md">
      <Heading name={currentPlayer.name} level={currentPlayer.level} />
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Item>
              <ImageList cols={level.current + 2} rowHeight="auto">
                {gridArray.map((item, index) => (
                  <ImageListItem key={index}>
                    <img
                      onClick={() => handleClicks(item.isInactive ? -2 : index)}
                      src={
                        item.isFlipped
                          ? item.isInactive
                            ? guessed
                            : imagesList[item.imageIndex].image
                          : questionMark
                      }
                      alt={item.type}
                      loading="lazy"
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Item>
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
                onClick={() => document.location.reload(true)}
              >
                <Typography>restart</Typography>
              </Button>
            </Item>
          </Grid>
          <Grid item xs={4}>
            <Item>
              <Time />
            </Item>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
