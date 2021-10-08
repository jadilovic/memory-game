import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function BasicSelect(props) {
  const { level, selectedLevel, setSelectedLevel, error } = props;
  const levelDifficultyList = [
    'Beginner',
    'Easy',
    'Medium',
    'Hard',
    'Expert',
    'Very Difficult',
  ];
  const [dynamicDifficultyList, setDynamicDifficultyList] = useState([]);

  useEffect(() => {
    const difficultyList = levelDifficultyList.slice(
      level,
      levelDifficultyList.length
    );
    setDynamicDifficultyList([...difficultyList]);
  }, [level]);

  const handleChange = (event) => {
    setSelectedLevel(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel
          color={`${error ? 'error' : ''}`}
          id="demo-simple-select-label"
        >
          {`${
            error ? 'Must select difficulty level' : 'Select Difficulty Level'
          }`}
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedLevel}
          label="Must Select Difficulty Level"
          onChange={handleChange}
          error={error}
        >
          {dynamicDifficultyList.map((difficulty, index) => {
            return (
              <MenuItem onChange={handleChange} value={level + index + 1}>
                {difficulty}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
