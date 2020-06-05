import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Grid, Typography, Avatar } from '@material-ui/core';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';

const useStyles = makeStyles((theme: any) => ({
  card: {
    backgroundColor: '#168C80',
    color: 'white'
  },
  content: {
    alignItems: 'center',
    display: 'flex'
  },
  title: {
    fontWeight: 700,
    textAlign: 'left'
  },
  avatar: {
    backgroundColor: 'white',
    color: '#168C80',
    height: 56,
    width: 56
  },
  icon: {
    height: 32,
    width: 32
  }
}));

const TotalCommission = () => {
  //const { className, ...rest } = props;

  const classes = useStyles();

  return (
    <Card
      //{...rest}
      //className={clsx(classes.root, className)}
      className={classes.card}
    >
      <CardContent>
        <Grid
          container
          justify="space-between"
        >
          <Grid item>
            <Typography
              className={classes.title}
              color="inherit"
              gutterBottom
              variant="body2"
            >
              TOTAL COMMISSION
            </Typography>
            <Typography
              color="inherit"
              variant="h3"
            >
              $40
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <AttachMoneyIcon className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

TotalCommission.propTypes = {
  className: PropTypes.string
};

export default TotalCommission;
