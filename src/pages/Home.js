import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { useHistory } from 'react-router-dom';
import useLocalStorageHook from '../utils/useLocalStorageHook';
import { Button, Typography, Container, Box, Grid, Paper } from '@mui/material';
import Heading from '../components/Heading';
import LevelAndScore from '../components/LevelAndScore';
import Scoreboard from '../components/Scoreboard';
import LevelSelect from '../components/LevelSelect';

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
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [error, setError] = useState(false);

  // INITIAL USE EFFECT TO GET CURRENT PLAYER AND CLEAR GAME STARTED LOCAL STORAGE
  useEffect(() => {
    setCurrentPlayer(data.getCurrentPlayer());
    localStorage.removeItem('gameStarted');
    localStorage.removeItem('selectedLevel');
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

  // CONTINUING AT THE LAST STARTED LEVEL BUT NOT FIN AND SETTING LOCAL STORAGE 'CONTINUE' ITEM
  const startGameFromSelectedLevel = (e) => {
    e.preventDefault();
    if (selectedLevel) {
      localStorage.setItem('gameStarted', 'START_FROM_SELECTED_LEVEL');
      localStorage.setItem('selectedLevel', selectedLevel);
      setError(false);
      history.push('/game');
    } else {
      setError(true);
    }
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
          <Grid item xs={12}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Item>
                    <LevelSelect
                      setSelectedLevel={setSelectedLevel}
                      selectedLevel={selectedLevel}
                      error={error}
                    />
                  </Item>
                </Grid>
                <Grid item xs={6}>
                  <Item>
                    <Button
                      style={{
                        minHeight: '56px',
                      }}
                      onClick={startGameFromSelectedLevel}
                      color="info"
                      variant="contained"
                      size="large"
                      fullWidth
                    >
                      <Typography>GO TO SELECTED LEVEL</Typography>
                    </Button>
                  </Item>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <LevelAndScore />
      <Scoreboard />
    </Container>
  );
};

export default Home;
