import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function Heading(playerProps) {
  const { name, level, gameStarted } = playerProps;
  const history = useHistory();

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
                {`Level: ${level + 1}`}
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
