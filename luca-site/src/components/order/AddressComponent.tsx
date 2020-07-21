import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  fieldOutline: {
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#2E5941"
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#2E5941"
    }
  },
});

export default function AddressComponent(props: any) {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Shipping address
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            id="address1"
            name="address1"
            label="Address"
            fullWidth
            defaultValue={props.address1}
            autoComplete="shipping address-line1"
            onChange={props.handleChange}
            className={classes.fieldOutline}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="address2"
            name="address2"
            label="Apartment, suite, etc."
            fullWidth
            defaultValue={props.address2}
            autoComplete="shipping address-line2"
            onChange={props.handleChange}
            className={classes.fieldOutline}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="city"
            name="city"
            label="City"
            fullWidth
            defaultValue={props.city}
            autoComplete="shipping address-level2"
            onChange={props.handleChange}
            className={classes.fieldOutline}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="province"
            name="province"
            label="State/Province/Region"
            fullWidth
            defaultValue={props.province}
            onChange={props.handleChange}
            className={classes.fieldOutline}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="zip"
            name="zip"
            label="Zip / Postal code"
            fullWidth
            defaultValue={props.zip}
            autoComplete="shipping postal-code"
            onChange={props.handleChange}
            className={classes.fieldOutline}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="country"
            name="country"
            label="Country"
            fullWidth
            defaultValue={props.country}
            autoComplete="shipping country"
            onChange={props.handleChange}
            className={classes.fieldOutline}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

AddressComponent.propTypes = {
  handleChange: PropTypes.any,
}
