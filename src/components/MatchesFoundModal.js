import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function MatchesFoundModal(props) {
  const history = useHistory();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { openMatchesFoundModal, setOpenMatchesFoundModal, startNextLevel } =
    props;

  const handleClose = () => {
    startNextLevel();
    setOpenMatchesFoundModal(false);
  };

  const handleStartNextLevel = () => {
    startNextLevel();
    setOpenMatchesFoundModal(false);
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={openMatchesFoundModal}
      onClose={handleClose}
    >
      <DialogTitle>You Won! All cards were matched!</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You can go to the next level by clicking 'NEXT LEVEL' or go back to
          the Home page by clicking on the 'BACKT TO HOME PAGE' button.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="success"
          onClick={handleStartNextLevel}
          autoFocus
        >
          Next Level
        </Button>
        <Button
          color="warning"
          variant="contained"
          onClick={() => history.push('/home')}
        >
          Back To Home Page
        </Button>
      </DialogActions>
    </Dialog>
  );
}
