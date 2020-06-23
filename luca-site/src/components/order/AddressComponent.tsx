import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { DbContext } from '../../util/api';

const initialFormData = Object.freeze({
  address1: "",
  address2: "",
  city: "",
  state: "",
  country: "",
  zip: ""
});

export default function AddressComponent() {
  const api = React.useContext(DbContext);
  const [formData, updateFormData] = React.useState(initialFormData);

  const handleChange = (event: any) => {
    updateFormData({
        ...formData,

        [event.target.name]: event.target.value.trim()
    });
  };

  const handleAddress = async (event: any) => {
    event.preventDefault()
    // debug print statement
    console.log(formData);

    if (formData.address1 === "" || formData.city === "" || formData.state === "" || formData.zip === "" || formData.country === "") {
      console.log("please fill out all fields!");
    } else {
      api.saveAddress(formData.address1, formData.address2, formData.city, formData.state, formData.country, formData.zip);
    }

  };

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
            autoComplete="shipping address-line1"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="address2"
            name="address2"
            label="Apartment, suite, etc."
            fullWidth
            autoComplete="shipping address-line2"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="city"
            name="city"
            label="City"
            fullWidth
            autoComplete="shipping address-level2"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="state" 
            name="state" 
            label="State/Province/Region"
            fullWidth 
            onChange={handleChange} 
            />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="zip"
            name="zip"
            label="Zip / Postal code"
            fullWidth
            autoComplete="shipping postal-code"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="country"
            name="country"
            label="Country"
            fullWidth
            autoComplete="shipping country"
            onChange={handleChange}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}