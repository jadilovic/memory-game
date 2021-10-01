import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function TimeExpiredModal(props) {
  const history = useHistory();
  const { openTimeExpiredModal, setOpenTimeExpiredModal, restartCurrentLevel } =
    props;

  const handleClose = () => {
    setOpenTimeExpiredModal(false);
  };

  const handleRestart = () => {
    restartCurrentLevel();
    setOpenTimeExpiredModal(false);
  };

  return (
    <Dialog open={openTimeExpiredModal} onClose={handleClose}>
      <DialogTitle ali>Level Time Has Expired</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Let Google help apps determine location. This means sending anonymous
          location data to Google, even when no apps are running.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleRestart} autoFocus>
          Restart Same Level
        </Button>
        <Button onClick={() => history.push('/home')}>Back To Home Page</Button>
      </DialogActions>
    </Dialog>
  );
}
