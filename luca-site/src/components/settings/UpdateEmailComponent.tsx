import React from 'react';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import { TextField } from '@material-ui/core';
import { Typography }from '@material-ui/core';
import { CardHeader } from '@material-ui/core';
import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core'; 
import { DbContext } from '../../util/api'


const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  align: {
    textAlign: 'left'
  },
  fieldOutline: {
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#2E5941"
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#2E5941"
    }
  },
  message: {
    textAlign: 'left',
  }
});

const initialFormData = Object.freeze({
  newEmail: "",
  confirmEmail: "",
  password: "",
});

export default function UpdateEmail() {
  const classes = useStyles();
  const api = React.useContext(DbContext);
  // state handling
  const [formData, updateFormData] = React.useState(initialFormData);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");

  const handleChange = (event: any) => {
    updateFormData({
        ...formData, // gets current state values, prevents from resetting key-val pair

        // if we change email field, [email] = testEmail@email
        [event.target.name]: event.target.value.trim()
    });
  };
  // updateEmail api will get called here
  const handleUpdate = async (event: any) => {
    event.preventDefault()

    api.updateEmail(formData.newEmail, formData.confirmEmail, formData.password)
      .then((status: string) => {
        setError("");
        setMessage(status);
      })
      .catch((error: string) => {
        setMessage("");
        setError(error);
      });
  };

  return (
    <Paper
      className={clsx(classes.root)} elevation={0} 
    >
      <div className={classes.paper}>
        <Grid>
          <form>
            <Grid item className={classes.align}>
              <CardHeader
                subheader="Update email"
              />
            </Grid>
            <CardContent>
              { error !== "" && 
                <div>
                  <Typography variant="overline" className={classes.message} color="error" display="block" gutterBottom>
                    { error }
                  </Typography>
                </div>
              }
              { message !== "" && 
                <div>
                  <Typography variant="overline" className={classes.message} style={{color: '#2E5941'}} display="block" gutterBottom>
                    { message }
                  </Typography>
                </div>
              }
              <TextField
                  fullWidth
                  label="New email"
                  name="newEmail"
                  variant="outlined"
                  required
                  autoFocus
                  onChange={handleChange}
                  className={classes.fieldOutline}
                />
              <TextField
                fullWidth
                label="Confirm new email"
                name="confirmEmail"
                style={{ marginTop: '1rem' }}
                variant="outlined"
                required
                onChange={handleChange}
                className={classes.fieldOutline}
              />
              <TextField
                fullWidth
                label="Confirm password"
                name="password"
                style={{ marginTop: '1rem' }}
                variant="outlined"
                required
                type="password"
                onChange={handleChange}
                className={classes.fieldOutline}
              />
              <Grid item className={classes.align}>
                <Button
                  style={
                  { 
                    marginTop: '1rem',
                    border: 'solid 1px #2E5941',
                    color: '#2E5941'
                  }}
                  variant="outlined"
                  onClick={handleUpdate}
                >
                Save
                </Button>
              </Grid>
            </CardContent>
          </form>
        </Grid>
      </div>
    </Paper>
  );
}