import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import party from '../../images/party.png';
import Grid from '@material-ui/core/Grid';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    image: {
      width: '90%',
      height: '90%',
    },
    button: {
      color: '#159897'
    }
  }),
);

export default function ClaimItem(props: any) {
  const [open, setOpen] = React.useState(true);
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClose = () => {
    setOpen(false);
  };

  const claimGift = () => {
    props.changeComponent("OrderComponent");
  };

  return (
    <div>
      <Dialog
        open={open}
        fullScreen={fullScreen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Woohoo!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Congratulations, {props.name}! You have reached your {props.sale}.
          </DialogContentText>
          <Grid container style={{ justifyContent: 'center' }}>
            <img src={party} alt="congratulations" className={classes.image} />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} className={classes.button}>
            Close
          </Button>
          <Button onClick={claimGift} className={classes.button} autoFocus>
            Get Free Gift
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}