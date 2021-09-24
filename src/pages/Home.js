import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { useHistory } from 'react-router-dom';
import useLocalStorageHook from '../utils/useLocalStorageHook';
import { Button, Typography, Container, Box, Grid, Paper } from '@mui/material';
import Heading from '../components/Heading';
import LevelAndScore from '../components/LevelAndScore';
import Scoreboard from '../components/Scoreboard';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Home = () => {
  const history = useHistory();
  const data = useLocalStorageHook();
  const [currentPlayer, setCurrentPlayer] = useState({});

  useEffect(() => {
    setCurrentPlayer(data.getCurrentPlayer());
    localStorage.removeItem('gameStarted');
    localStorage.removeItem('shuffledImages');
  }, []);

  const startNewGame = (e) => {
    e.preventDefault();
    // NEW ITEM IN LOCAL STORAGE TO CONTROL START OF THE GAME
    data.restartCurrentPlayerLevelAndScoreAndUpdateDatabase(currentPlayer);
    localStorage.setItem('gameStarted', 'YES');
    history.push('/game');
  };

  const continueGame = (e) => {
    e.preventDefault();
    // NEW ITEM IN LOCAL STORAGE TO CONTROL START OF THE GAME
    localStorage.setItem('gameStarted', 'YES');
    history.push('/game');
  };

  return (
    <Container maxWidth="md">
      <Heading name={currentPlayer.name} level={currentPlayer.level} />
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Item>
              <Typography gutterBottom variant="h6">
                Select one of the options
              </Typography>
            </Item>
          </Grid>
          <Grid item xs={12}>
            <Item>
              <Button
                onClick={startNewGame}
                color="success"
                variant="contained"
                size="large"
                fullWidth
              >
                <Typography>new game</Typography>
              </Button>
              <Typography component="text">
                Starts the game from Level 1 and deletes previous score
              </Typography>
            </Item>
          </Grid>
          <Grid item xs={12}>
            <Item>
              <Button
                onClick={continueGame}
                color="warning"
                variant="contained"
                size="large"
                fullWidth
                disabled={currentPlayer.level < 1}
              >
                <Typography>continue</Typography>
              </Button>
              <Typography component="text">
                Starts the game at the last finished Level
              </Typography>
            </Item>
          </Grid>
        </Grid>
      </Box>
      <LevelAndScore />
      <Scoreboard />
    </Container>
  );
};

export default Home;
