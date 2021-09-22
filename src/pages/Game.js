import { useEffect, useState, useRef } from 'react';
import imagesList from '../images/imagesList';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { Container, Box } from '@mui/material';
import Heading from '../components/Heading';

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
  const [scoreCount, setScoreCount] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState({});
  let shuffledImages1 = shuffleImages(imagesList);
  let shuffledImages2 = shuffleImages(imagesList);
  let shuffledImages3 = shuffledImages1.concat(shuffledImages2);
  let shuffledImages = shuffledImages3.concat(shuffledImages1);
  const sizeOfGrid = (currentPlayer.level + 1) * (currentPlayer.level + 1);
  shuffledImages.splice(sizeOfGrid, shuffledImages.length);
  console.log(shuffledImages);

  useEffect(() => {
    setCurrentPlayer(JSON.parse(localStorage.getItem('currentPlayer')));
  }, []);

  const addPoints = (e) => {
    e.preventDefault();
    setScoreCount(scoreCount + 1);
  };

  useEffect(() => {
    console.log(currentPlayer, scoreCount);
    // setCurrentPlayer({ ...currentPlayer, score: scoreCount });
  }, [scoreCount]);

  return (
    <Container>
      <Heading
        name={currentPlayer.name}
        level={currentPlayer.level}
        score={scoreCount}
      />
      <ImageList cols={currentPlayer.level + 1} rowHeight="auto">
        {shuffledImages.map((item, index) => (
          <ImageListItem key={index}>
            <img
              onClick={addPoints}
              src={item.image}
              alt={item.type}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Container>
  );
}
