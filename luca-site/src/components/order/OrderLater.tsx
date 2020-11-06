import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import influencer from '../../images/influencer.png';
import { DbContext } from '../../util/api';
import {Card, CardContent}  from '@material-ui/core/';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  main: {
    marginTop: theme.spacing(12),
    marginBottom: theme.spacing(2),
  },
  image: {
    width: '40%',
    height: '40%',
  },
  t1: {
    color: '#4f4f4f',
    fontFamily: 'helvetica',
    fontWeight: 100,
  },
  t2: {
    color: '#4f4f4f',
    fontFamily: 'helvetica',
    fontWeight: 600,
    marginTop: '20px'
  }
}));

const initialFormData = Object.freeze({
  "lastOrderDate" : "",
  "nextOrderDate" : "",
});

export default function OrderLater(props: any) {
  const classes = useStyles();
  const api = React.useContext(DbContext);
  const [dates, updateDates] = React.useState(initialFormData);

  React.useEffect(() => {
    var dates = api.getLastOrderDate();
    changeState(dates);
    console.log(dates);
  }, [api]);

  const changeState = (newDates: string[]) => {
    var str = newDates[1].split(' ')[0];

    updateDates({
      ...dates,
      "lastOrderDate" : newDates[0],
      "nextOrderDate" : str.substring(0, str.length-1),
    })
  }


  return (
    <div className={classes.root}>
      <Card>
        <CardContent>
          <Container component="main" className={classes.main}>
          <Typography variant="h5" component="h2" className={classes.t1}>
            Your last order was on {dates.lastOrderDate}
          </Typography>
          <Typography variant="h5" component="h2" className={classes.t2}>
            You can order again on {dates.nextOrderDate}.
          </Typography>
          <img src={influencer} className={classes.image} />
          </Container>
        </CardContent>
      </Card>
    </div>
  );
}