import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Box,
  Paper,
  Grid,
  Container,
  Typography,
  CardMedia,
  Card,
  CardActionArea,
  CardContent,
  TextField,
  Button,
  CardActions,
  Alert,
} from '@mui/material';
import reptile from '../images/contemplative-reptile.jpg';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Login = () => {
  const [playerName, setPlayerName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  let history = useHistory();
  let player = null;
  let players = [];

  const handleChange = (e) => {
    e.preventDefault();
    setPlayerName(e.target.value);
  };

  const getPlayer = (playerName, players) => {
    player = players.find((playerItem) => playerItem.name === playerName);
    return player;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setNameError(false);
    setErrorMessage('');
    if (playerName === '') {
      setNameError(true);
      setErrorMessage('You must enter player name to start playing the game');
    } else {
      players = JSON.parse(localStorage.getItem('players') || '[]');
      if (getPlayer(playerName, players)) {
        history.push({ pathname: '/home', state: player });
      } else {
        const newPlayer = { name: playerName, level: 0, score: 0 };
        players.push(newPlayer);
        localStorage.setItem('players', JSON.stringify(players));
        history.push({ pathname: '/home', state: newPlayer });
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Item>
              <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                Welcome to Exciting Memory Game
              </Typography>
            </Item>
          </Grid>
          <Grid item xs={12}>
            <Item>
              <Card>
                <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="140"
                      image={reptile}
                      alt="green iguana"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="div">
                        Enter player name
                      </Typography>
                      <Box
                        sx={{
                          width: 500,
                          maxWidth: '100%',
                        }}
                      >
                        <TextField
                          fullWidth
                          label={`${nameError ? 'Input error' : 'Player name'}`}
                          id="fullWidth"
                          onChange={handleChange}
                          variant="outlined"
                          color="primary"
                          error={nameError}
                        />
                      </Box>
                    </CardContent>
                  </CardActionArea>
                  <CardActions style={{ justifyContent: 'center' }}>
                    <Button variant="contained" color="primary" type="submit">
                      start playing
                    </Button>
                  </CardActions>
                </form>
              </Card>
            </Item>
          </Grid>
          {nameError && (
            <Grid item xs={12}>
              <Item>
                <Alert severity="error">{errorMessage}</Alert>
              </Item>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default Login;
