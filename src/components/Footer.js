import React from 'react';
import { styled } from '@mui/material/styles';
import { Grid, Box, Button, Paper, Typography } from '@mui/material';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Footer = () => {
  const currentPlayer = JSON.parse(localStorage.getItem('currentPlayer'));

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid paddingTop={4} paddingBottom={6} container spacing={4}>
        <Grid item xs={6}>
          <Item>
            <Typography>{`Completed Level: ${currentPlayer.level}`}</Typography>
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item>
            <Typography>{`Score: ${currentPlayer.score}`}</Typography>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
