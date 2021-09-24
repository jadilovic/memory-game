import React from 'react';
import imagesList from '../images/imagesList';

const createArrayHook = (numberOfItems) => {
  let index = 0;
  const dynamicArray = [];
  for (let i = 0; i < numberOfItems / 2; i++) {
    if (index > imagesList.length - 1) {
      index = 0;
    }

    for (let j = 0; j < 2; j++) {
      dynamicArray.push({
        id: i.toString(),
        type: imagesList[index].type,
        imageIndex: index,
        isFlipped: false,
        isInactive: false,
      });
    }

    index++;
  }
  return dynamicArray;
};

export default createArrayHook;
