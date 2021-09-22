import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { useHistory } from 'react-router-dom';
import { Button, Typography, Container, Box, Grid, Paper } from '@mui/material';
import Heading from '../components/Heading';
import Footer from '../components/Footer';
import Scoreboard from '../components/Scoreboard';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Home = () => {
  const history = useHistory();
  const [currentPlayer, setCurrentPlayer] = useState({});
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    setCurrentPlayer(JSON.parse(localStorage.getItem('currentPlayer')));
    setPlayers(JSON.parse(localStorage.getItem('players') || '[]'));
    localStorage.removeItem('gameStarted');
  }, []);

  const startNewGame = (e) => {
    e.preventDefault();

    const updateCurrentPlayer = { ...currentPlayer, level: 1 };
    localStorage.setItem('currentPlayer', JSON.stringify(updateCurrentPlayer));

    const currentPlayerIndex = players.findIndex(
      (player) => player.name == currentPlayer.name
    );
    players[currentPlayerIndex].level = 1;
    localStorage.setItem('players', JSON.stringify(players));
    localStorage.setItem('gameStarted', 'true');

    history.push('/game');
  };

  return (
    <Container maxWidth="sm">
      <Heading
        name={currentPlayer.name}
        level={currentPlayer.level}
        score={currentPlayer.score}
      />
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
              >
                <Typography>new game</Typography>
              </Button>
            </Item>
          </Grid>
          <Grid item xs={12}>
            <Item>
              <Button color="warning" variant="contained">
                <Typography>continue</Typography>
              </Button>
            </Item>
          </Grid>
        </Grid>
      </Box>
      <Footer />
      <Scoreboard />
    </Container>
  );
};

export default Home;
