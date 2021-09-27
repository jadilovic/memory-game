import React from 'react';
import imagesList from '../images/imagesList';

const useArrayHook = () => {
  const createArray = (numberOfItems) => {
    console.log('use ARRAY Hook', numberOfItems);
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
    if (numberOfItems % 2 !== 0) {
      dynamicArray.pop();
      dynamicArray[dynamicArray.length - 1].isInactive = true;
      dynamicArray[dynamicArray.length - 1].isFlipped = true;
    }
    return dynamicArray;
  };
  return { createArray };
};

export default useArrayHook;
