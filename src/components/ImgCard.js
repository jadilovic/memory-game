import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import imagesList from '../images/imagesList';

const ImgCard = ({ card, index, onClick }) => {
  const { id, imageIndex, type, isFlipped, isInactive } = card;
  const handleClick = () => {
    // !isFlipped && !isDisabled &&
    onClick(index);
  };

  return (
    <Card sx={{ display: 'flex' }}>
      <CardActionArea onClick={handleClick}>
        <CardMedia
          component="img"
          image={imageIndex === -1 ? null : imagesList[imageIndex].image}
          alt={type}
        />
      </CardActionArea>
    </Card>
  );
};

export default ImgCard;
