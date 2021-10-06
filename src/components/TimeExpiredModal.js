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

export default function TimeExpiredModal(props) {
  const history = useHistory();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { openTimeExpiredModal, setOpenTimeExpiredModal, restartCurrentLevel } =
    props;

  const handleRestart = () => {
    restartCurrentLevel();
    setOpenTimeExpiredModal(false);
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={openTimeExpiredModal}
      disableEscapeKeyDown
    >
      <DialogTitle>Level Time Has Expired</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You can try again at the same level by clicking 'RESTART SAME LEVEL'
          or go back to the Home page by clicking on the 'BACK TO HOME PAGE'
          button.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleRestart} autoFocus>
          Restart Same Level
        </Button>
        <Button
          color="success"
          variant="contained"
          onClick={() => history.push('/home')}
        >
          Back To Home Page
        </Button>
      </DialogActions>
    </Dialog>
  );
}
