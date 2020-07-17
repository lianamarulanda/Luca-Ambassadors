import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import { Grid } from '@material-ui/core';
import { DbContext } from '../../util/api';
import Button from '@material-ui/core/Button';
import AnnouncementsComponent from './AnnouncementsComponent';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const initialFormData = Object.freeze({
  message: "",
  banner: false,
});

const App: React.FC = () => {
  const classes = useStyles();
  const api = React.useContext(DbContext);
  const [openPopup, setOpen] = React.useState(false);
  const [announcement, updateAnnouncement] = React.useState(initialFormData);

  const openDialog = () => {
    setOpen(true);
  }

  const handleClose = () => {
    updateAnnouncement({
      ...announcement,
      banner: false,
      message: ""
    })
    setOpen(false);
  };

  const handleMessage = (event: any) => {
    updateAnnouncement({
      ...announcement, 
      [event.target.name]: event.target.value.trim()
    });
  };

  const handleBanner = (event: React.ChangeEvent<HTMLInputElement>) => {
    var newMessage = announcement.message;

    if (announcement.message.length > 80)
      newMessage.slice(0,81);

    updateAnnouncement({
      ...announcement,
      message: newMessage,
      banner: !announcement.banner,
    })
  }

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Typography variant="h4" gutterBottom style={{textAlign: 'left', fontWeight: 700, marginBottom:'30px'}}>
      Overview
      </Typography>
      <Grid
        container
        spacing={4}
      >
        <Grid
          item
          lg={4}
          sm={6}
          xl={3}
          xs={12}
        >
        </Grid>
        <Grid
          item
          lg={4}
          sm={6}
          xl={3}
          xs={12}
        >
        </Grid>
        <Grid
          item
          lg={4}
          sm={6}
          xl={3}
          xs={12}
        > 
        </Grid>
        <Grid
          item
          lg={6}
          md={12}
          xl={9}
          xs={12}
        >
        </Grid>
        <Grid
          item
          lg={6}
          md={6}
          xl={3}
          xs={12}
          
        >
        </Grid>
        <Grid container>
          <Grid item>
            <Typography variant="h4" style={{fontWeight: 700, padding:'22px'}}>
              Announcements
            </Typography>

            <Dialog open={openPopup} onClose={handleClose} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Create New Announcement</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Type in the announcement below.
                    <br />
                    Banner announcements won't appear in the Announcements table - it will only appear as a banner.
                    If there is already an existing banner, it will get replaced.
                    The maximum character limit for a banner announcement is 80. 
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="message"
                    name="message"
                    label="Announcement"
                    fullWidth
                    multiline
                    rows={8}
                    rowsMax={10}
                    onChange={handleMessage}
                    helperText = {announcement.message.length}

                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={announcement.banner}
                        onChange={handleBanner}
                        name="checkedB"
                        color="primary"
                      />
                    }
                      label="Make me a Banner Announcement"
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={handleClose} color="primary">
                    Publish
                  </Button>
                </DialogActions>
            </Dialog>
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
        >
          <AnnouncementsComponent />
        </Grid>
        <Grid
          item
          lg={8}
          md={12}
          xl={9}
          xs={12}
        >
          <Button variant="contained" className={classes.button} onClick={() => openDialog()} autoFocus>
            Create new announcement
          </Button>
        </Grid>
      </Grid>
    </Container>
  )
}

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  button: {
    backgroundColor : '#83A672',
    color: 'white',
    '&:hover': {
      backgroundColor: '#2E5941',
    }
  }
}))

export default App
