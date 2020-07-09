import React from 'react';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import { TextField } from '@material-ui/core';
import { CardHeader } from '@material-ui/core';
import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { DbContext } from '../../util/api';

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
  }
});

const initialFormData = Object.freeze({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

export default function UpdatePassword() {
  const classes = useStyles();
  const api = React.useContext(DbContext);
  // state handling
  const [formData, updateFormData] = React.useState(initialFormData);

  const handleChange = (event: any) => {
    updateFormData({
        ...formData, // gets current state values, prevents from resetting key-val pair

        // if we change email field, [email] = testEmail@email
        [event.target.name]: event.target.value.trim()
    });
  };
  // updatePass api will get called here
  const handleUpdate = async (event: any) => {
    event.preventDefault()
    // debug print statement
    console.log(formData);
    api.updatePassword(formData.oldPassword, formData.newPassword, formData.confirmPassword)
      .then((status: string) => {
        if (status === "success") {
          console.log("password updated!");
        } else {
          console.log(status);
        }
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
                subheader="Update password"
              />
            </Grid>
            <CardContent>
              <TextField
                  fullWidth
                  label="Old password"
                  name="oldPassword"
                  type="password"
                  variant="outlined"
                  required
                  autoFocus
                  onChange={handleChange}
                  className={classes.fieldOutline}
                />
              <TextField
                fullWidth
                label="New password"
                name="newPassword"
                type="password"
                style={{ marginTop: '1rem' }}
                variant="outlined"
                required
                onChange={handleChange}
                className={classes.fieldOutline}
              />
              <TextField
                fullWidth
                label="Confirm new password"
                name="confirmPassword"
                style={{ marginTop: '1rem' }}
                type="password"
                variant="outlined"
                required
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