import React from 'react'
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
import { DbContext } from '../../util/api/'
import {Card, CardContent, Grid, Typography, Container} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}))

const colors = ['#1B473A', '#279895', '#E0D9C6', "#159897", '#427340', '#354F46'];

export default function HighSalesComponent() {
  const { width, height } = useWindowSize();
  const classes = useStyles();
  const api = React.useContext(DbContext);
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    if (api.userData.currTier === "4")
      setMessage("We will soon be depositing a $30 cash bonus to your PayPal account.");
    if (api.userData.currTier === "5")
      setMessage("Your name will be added to our English classroom in Colombia. We will be sending you progress updates!");
    resetTier();
  }, []);

  const resetTier = () => {
    var newTier = parseInt(api.userData.currTier) + 1;
    api.setGiftClaimStatus(false, newTier.toString())
      .then(() => {

      })
      .catch((error: any) => {

      })
  }

  return (
    <>
    <Container maxWidth="lg" className={classes.container}>
      <Grid item
        xs={12}
      >
        <Card
          raised={true}
        >
          <CardContent>
            <Typography variant="h3" gutterBottom style={{fontFamily: 'Helvetica', color:'#2E5941'}}> Congratulations! </Typography>
            <br />
            <Typography variant="h6" gutterBottom>
              Thank you for all your contributions to our mission. We wouldn't be able to accomplish so much without the hard work of Ambassadors like you!
            </Typography>
            <br />
            <Typography variant="h6" gutterBottom style={{fontWeight: 'bolder'}}>
              {message}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Container>
    <Confetti
      width={width}
      height={height}
      colors={colors}
    />
    </>
  );
}