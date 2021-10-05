import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import imagesList from '../images/imagesList';
import guessed from '../images/guessed.png';
import questionMark from '../images/questionM.png';

const ImgCard = ({ card, index, onClick }) => {
  const { id, imageIndex, type, isFlipped, isInactive, backgroundColor } = card;

  const handleClick = () => {
    //  onClick(isInactive ? -2 : index);
    onClick(index);
  };

  const imageStatus = () => {
    if (isFlipped) {
      return isInactive ? guessed : imagesList[imageIndex].image;
    } else {
      return questionMark;
    }
  };

  return (
    <Card
      style={{ background: isInactive ? '' : backgroundColor }}
      sx={{ display: 'flex' }}
    >
      <CardActionArea onClick={handleClick}>
        <CardMedia
          component="img"
          image={imageStatus()}
          alt={type}
          loading="eager"
        />
      </CardActionArea>
    </Card>
  );
};

export default ImgCard;
