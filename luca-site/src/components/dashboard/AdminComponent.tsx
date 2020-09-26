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
import BannerComponent from './BannerComponent';
import SetAdminComponent from './SetAdminComponent';
import HeaderComponent from '../layout/HeaderComponent';
import Divider from '@material-ui/core/Divider';

const initialFormData = Object.freeze({
  message: "",
});

const AdminComponent = (props: any) => {
  const classes = useStyles();
  const api = React.useContext(DbContext);
  const [openPopup, setOpen] = React.useState(false);
  const [announcement, updateAnnouncement] = React.useState(initialFormData);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");

  const openDialog = () => {
    setOpen(true);
  }

  const handleClose = () => {
    updateAnnouncement({
      ...announcement,
      message: ""
    })
    setOpen(false);
    setMessage("");
    setError("");
  };

  const handleMessage = (event: any) => {
    updateAnnouncement({
      ...announcement,
      [event.target.name]: event.target.value.trim()
    });
  };

  const createAnnouncement = async () => {
    setError("");
    setMessage("");

    api.createAnnouncement(announcement)
      .then((status: string) => {
        setMessage(status);
      })
      .catch((error: string) => {
        setError(error);
      })
  }

  return (
    <Container maxWidth="lg" className={classes.container}>
      <HeaderComponent title="Dashboard" component="dashboard" style={{ marginBottom: '30px' }} sidebarToggle={props.sidebarToggle} />
      <Divider light style={{ marginBottom: '15px' }} />
      <Typography variant="h4" gutterBottom style={{ textAlign: 'left', fontWeight: 700, marginBottom: '30px' }}>
        Overview
      </Typography>
      <Grid
        container
        spacing={4}
      >
        <Grid
          item
          lg={12}
          xs={12}
        >
          <Typography variant="body1"> Feature coming soon! </Typography>
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
            <Typography variant="h4" style={{ fontWeight: 700, padding: '22px' }}>
              Announcements
            </Typography>
            <Button variant="contained" className={classes.button} onClick={() => openDialog()} autoFocus>
              Create new announcement
            </Button>
            <Dialog open={openPopup} onClose={handleClose} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Create New Announcement</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Type in the announcement below.
                    <br />
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
                  helperText={announcement.message.length}

                />
                <Grid item >
                  {message !== "" &&
                    <Typography variant="overline" className={classes.uploadSuccess} gutterBottom>
                      {message}
                    </Typography>
                  }
                  {error !== "" &&
                    <Typography variant="overline" color="error" display="block" gutterBottom>
                      {error}
                    </Typography>
                  }
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                  </Button>
                <Button onClick={createAnnouncement} color="primary">
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
          <AnnouncementsComponent adminStatus={props.adminStatus} />
        </Grid>
        <Grid
          item
          sm={12}
          md={7}
          xl={6}
          xs={12}
        >
          <BannerComponent />
        </Grid>
        <Grid item xs={12} md={7} style={{}}>
          <Typography variant="h4" style={{ fontWeight: 700, textAlign:'left', marginBottom:'20px'}} gutterBottom>
            Add Admin Users
          </Typography>
          <SetAdminComponent />
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
    backgroundColor: '#83A672',
    color: 'white',
    '&:hover': {
      backgroundColor: '#2E5941',
    },
    marginRight: '25px'
  },
  uploadSuccess: {
    color: '#2E5941'
  }
}))

export default AdminComponent;
