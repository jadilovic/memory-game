import React from 'react';
import imagesList from '../images/imagesList';

const useArrayHook = () => {
  const createArray = (numberOfItems) => {
    console.log('use ARRAY Hook', numberOfItems);
    let index = 0;
    const dynamicArray = [];
    let dynamicText = false;

    for (let i = 0; i < numberOfItems / 2; i++) {
      if (index > imagesList.length - 1) {
        index = 0;
        dynamicText = true;
      }

      for (let j = 0; j < 2; j++) {
        dynamicArray.push({
          id: i.toString(),
          type: dynamicText ? 'DYN ' + i.toString() : imagesList[index].type,
          imageIndex: dynamicText ? -1 : index,
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
