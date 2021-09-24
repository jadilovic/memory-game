import { useEffect, useState, useRef, memo } from 'react';
import useLocalStorageHook from '../utils/useLocalStorageHook';
import createArrayHook from '../utils/createArrayHook';
import { styled } from '@mui/material/styles';
import imagesList from '../images/imagesList';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { Container, Box, Grid, Paper, Button, Typography } from '@mui/material';
import Heading from '../components/Heading';
import Time from '../components/Time';
import Score from '../components/Score';
import Card from '../components/Card';
import guessing from '../images/guessing.png';
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
  const [scoreCount, setScoreCount] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(data.getCurrentPlayer());
  const sizeOfGrid = (currentPlayer.level + 2) * (currentPlayer.level + 2);
  const [gridArray, setGridArray] = useState(createArrayHook(sizeOfGrid));

  let shuffledImages1 = shuffleImages(imagesList);
  let shuffledImages2 = shuffleImages(imagesList);
  let shuffledImages3 = shuffledImages1.concat(shuffledImages2);
  let shuffledImages = shuffledImages3.concat(shuffledImages1);
  shuffledImages.splice(sizeOfGrid, shuffledImages.length);
  console.log(shuffledImages);
  console.log(gridArray);

  const images = JSON.parse(localStorage.getItem('shuffledImages'));
  if (!images) {
    localStorage.setItem('shuffledImages', JSON.stringify(shuffledImages));
  }

  const addPoints = (e) => {
    e.preventDefault();
    setScoreCount(scoreCount + 1);
  };

  useEffect(() => {
    console.log(currentPlayer, scoreCount);
  }, [gridArray]);

  const checkIsInactive = (index) => {
    return 'check is inactive';
  };

  const checkIsFlipped = (index) => {
    return 'check is flipped';
  };

  const handleClick = (index) => {
    gridArray[index].isFlipped = true;
    setGridArray(gridArray);
  };
  console.log(gridArray);

  return (
    <Container maxWidth="md">
      <Heading name={currentPlayer.name} level={currentPlayer.level} />
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Item>
              <ImageList cols={currentPlayer.level + 2} rowHeight="auto">
                {gridArray.map((item, index) => (
                  <ImageListItem key={index}>
                    <img
                      onClick={() => handleClick(index)}
                      src={
                        item.isFlipped
                          ? imagesList[item.imageIndex].image
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
