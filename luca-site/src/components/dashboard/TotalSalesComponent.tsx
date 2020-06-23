import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Grid, Typography, Avatar } from '@material-ui/core';
import MoneyIcon from '@material-ui/icons/Money';
import { DbContext } from '../../util/api';

const useStyles = makeStyles((theme: any) => ({
  root: {
    height: '100%'
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
    backgroundColor: theme.palette.success.main,
    height: 56,
    width: 56
  },
  icon: {
    height: 32,
    width: 32
  },
}));

const TotalSales = () => {
  const api = React.useContext(DbContext);
  const data = api.codeData as any;
  // var totalSales = data.totalSales.replace(/^0+/, '');
  const classes = useStyles();

  return (
    <Card
    >
      <CardContent>
        <Grid
          container
          justify="space-between"
        >
          <Grid item>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
              variant="body2"
            >
              TOTAL SALES
            </Typography>
            <Typography variant="h3">${data.totalSales.toFixed(2)}</Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <MoneyIcon className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

TotalSales.propTypes = {
  className: PropTypes.string
};

export default TotalSales;