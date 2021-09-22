import React, { useEffect, useState } from 'react';
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
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();

  const handleChange = (e) => {
    e.preventDefault();
    setPlayerName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (playerName === '') {
      setErrorMessage('You must enter player name to start playing the game');
    } else {
      const players = JSON.parse(localStorage.getItem('players') || '[]');
      const existingPlayer = players.find(
        (player) => player.name === playerName
      );
      if (existingPlayer) {
        localStorage.setItem('currentPlayer', JSON.stringify(existingPlayer));
      } else {
        const newPlayer = { name: playerName, level: 0, score: 0 };
        localStorage.setItem('currentPlayer', JSON.stringify(newPlayer));
        players.push(newPlayer);
        localStorage.setItem('players', JSON.stringify(players));
      }
      history.push('/home');
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
                      {errorMessage && (
                        <Box
                          sx={{
                            paddingTop: 2,
                            paddingBottom: 2,
                            bgcolor: 'background.paper',
                          }}
                        >
                          <Alert severity="error">{errorMessage}</Alert>
                        </Box>
                      )}
                      <TextField
                        fullWidth
                        label="Player name"
                        id="fullWidth"
                        onChange={handleChange}
                        variant="outlined"
                        color="primary"
                        error={errorMessage}
                      />
                    </Box>
                  </CardContent>
                  <CardActions style={{ justifyContent: 'center' }}>
                    <Button variant="contained" color="primary" type="submit">
                      start playing
                    </Button>
                  </CardActions>
                </form>
              </Card>
            </Item>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Login;
