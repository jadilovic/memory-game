import React from 'react';
import Typography from '@mui/material/Typography';

export default function Score(props) {
  return (
    <React.Fragment>
      <Typography
        component="h6"
        variant="h6"
        color="white"
        bgcolor="royalblue"
        gutterBottom
      >
        Completed Level:
      </Typography>
      <Typography component="p" variant="h6">
        {props.level}
      </Typography>
    </React.Fragment>
  );
}
