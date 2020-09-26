import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { DbContext } from '../../util/api';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton'
import InfoIcon from '@material-ui/icons/Info';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    alignItems: "left",
    textAlign: "left"
  },
  title: {
    fontWeight: 'bolder',
    textAlign: 'left',
    fontSize: 17
  },
  uploadSuccess: {
    color: '#2E5941'
  }
});

export default function SetAdminComponent() {
  const classes = useStyles();
  const api = React.useContext(DbContext);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");
  const [email, setEmail] = React.useState("");

  const handleChange = (event: any) => {
    var value = event.target.value.trim();
    setEmail(value);
  };

  const submitEmail = () => {
    setError("");
    setMessage("Loading...");
    api.addAdminUser(email)
      .then((status: boolean) => {
        if (status) {
          setMessage("Successfully added " + email + " as an admin!");
        }
        else {
          setMessage("");
          setError("An error occurred.");
        }
      })
      .catch((error: any) => {
        setMessage("");
        setError("An error occurred.");
      })
  }

  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid item style={{ justifyItems: 'left' }}>
          <Grid container direction="row">
            <Typography className={classes.title} gutterBottom variant="subtitle2">
              {"Enter New Admin Email"}
            </Typography>
            <Tooltip
              title={<Typography variant="body1">
                Enter the email of the new user you wish to make an admin
               </Typography>}
            >
              <IconButton aria-label="delete" style={{ padding: '0px', marginLeft: '10px', marginBottom: '5px' }}>
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Grid>
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
          <TextField
            id="filled-required"
            multiline
            margin="dense"
            rows={1}
            fullWidth
            rowsMax={3}
            style={{ marginBottom: '30px', marginTop: '20px', justifySelf: 'left' }}
            onChange={handleChange}
          />
          <Grid container direction="row" alignItems="center">
            <Grid item style={{ justifySelf: 'left' }}>
              <Button onClick={submitEmail} variant="outlined" size="small">Save</Button>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}