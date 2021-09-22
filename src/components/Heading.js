import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function Heading(props) {
  const { name, level, score } = props;
  const [counter, setCounter] = useState(60);
  const gameStarted = localStorage.getItem('gameStarted');
  const history = useHistory();

  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {`Player: ${name}`}
          </Typography>
          {gameStarted && (
            <>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {`Level: ${level}`}
              </Typography>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {`Score: ${score}`}
              </Typography>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {`Timer: ${counter}`}
              </Typography>
            </>
          )}

          <Button
            onClick={() => history.push(`${gameStarted ? '/home' : '/'}`)}
            color="inherit"
          >
            <Typography variant="h6">{`${
              gameStarted ? 'Home' : 'Login'
            }`}</Typography>
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
