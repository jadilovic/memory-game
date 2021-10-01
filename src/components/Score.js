import React from 'react';
import Typography from '@mui/material/Typography';

export default function Score(props) {
  return (
    <React.Fragment>
      <Typography
        component="h6"
        variant="h6"
        color="black"
        bgcolor="gold"
        gutterBottom
      >
        Score:
      </Typography>
      <Typography component="p" variant="h6">
        {props.score}
      </Typography>
    </React.Fragment>
  );
}
