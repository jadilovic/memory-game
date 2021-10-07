import React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function BasicSelect(props) {
  const { selectedLevel, setSelectedLevel, error } = props;

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
          <MenuItem value={1}>Beginner</MenuItem>
          <MenuItem value={2}>Easy</MenuItem>
          <MenuItem value={3}>Medium</MenuItem>
          <MenuItem value={4}>Hard</MenuItem>
          <MenuItem value={5}>Expert</MenuItem>
          <MenuItem value={6}>Very Difficult</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
