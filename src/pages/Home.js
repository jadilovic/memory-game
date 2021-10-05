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

  // INITIAL USE EFFECT TO GET CURRENT PLAYER AND CLEAR GAME STARTED LOCAL STORAGE
  useEffect(() => {
    setCurrentPlayer(data.getCurrentPlayer());
    localStorage.removeItem('gameStarted');
  }, []);

  // STARTING OR RESTARTING NEW GAME AND SETTING LOCAL STORAGE 'NEW_GAME' ITEM
  const startNewGame = (e) => {
    e.preventDefault();
    data.restartCurrentPlayerLevelAndScoreAndUpdateDatabase(currentPlayer);
    localStorage.setItem('gameStarted', 'NEW_GAME');
    history.push('/game');
  };

  // CONTINUING AT THE LAST STARTED LEVEL BUT NOT FINISHED AND SETTING LOCAL STORAGE 'CONTINUE' ITEM
  const continueGame = (e) => {
    e.preventDefault();
    localStorage.setItem('gameStarted', 'CONTINUE');
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
                Starts game one level above your highest completed level
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
