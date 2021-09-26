import React from 'react';
import questionMark from '../images/questionM.png';
import contemplativeReptile from '../images/contemplative-reptile.jpg';
import imagesList from '../images/imagesList';
import guessing from '../images/guessed.png';

const Card = ({
  onClick,
  id,
  index,
  isInactive,
  isFlipped,
  imageIndex,
  type,
}) => {
  const handleClick = () => {
    onClick(index);
  };
  console.log(id);
  return (
    <div onClick={handleClick}>
      {isFlipped ? (
        <img src={imagesList[imageIndex].image} alt={type} loading="lazy" />
      ) : (
        <img src={questionMark} alt={type} loading="lazy" />
      )}
      {isFlipped && isInactive ? (
        <img src={guessing} alt={type} loading="lazy" />
      ) : null}
    </div>
  );
};

export default Card;
