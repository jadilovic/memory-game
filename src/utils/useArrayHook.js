import React from 'react';
import imagesList from '../images/imagesList';

const useArrayHook = () => {
  const createArray = (numberOfItems) => {
    console.log('use ARRAY Hook', numberOfItems);
    let index = 0;
    const dynamicArray = [];
    let dynamicImage = false;
    let randomColor = '';

    const getRandomColor = () => {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };

    for (let i = 0; i < numberOfItems / 2; i++) {
      if (index > imagesList.length - 1) {
        index = 0;
        dynamicImage = true;
        randomColor = getRandomColor();
      }

      for (let j = 0; j < 2; j++) {
        dynamicArray.push({
          id: i.toString(),
          type: imagesList[index].type,
          imageIndex: index,
          backgroundColor: dynamicImage ? randomColor : '',
          isFlipped: false,
          isInactive: false,
        });
      }
      index++;
    }

    return dynamicArray;
  };

  return { createArray };
};

export default useArrayHook;
