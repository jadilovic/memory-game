import React, { useEffect, useState } from 'react';
import useLocalStorageHook from '../utils/useLocalStorageHook';
import { styled } from '@mui/material/styles';
import { Grid, Box, Paper, Typography } from '@mui/material';
import Level from './Level';
import Score from './Score';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Footer = () => {
  const data = useLocalStorageHook();
  const [currentPlayer, setCurrentPlayer] = useState({});

  useEffect(() => {
    setCurrentPlayer(data.getCurrentPlayer);
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid paddingTop={4} paddingBottom={6} container spacing={4}>
        <Grid item xs={6}>
          <Item>
            <Level level={currentPlayer.level} />
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item>
            <Score score={currentPlayer.score} />
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
