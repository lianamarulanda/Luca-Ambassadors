import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Grid, Typography, Avatar } from '@material-ui/core';
import PeopleIcon from '@material-ui/icons/PeopleOutlined';
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
    backgroundColor: '#38A1F3',
    height: 56,
    width: 56
  },
  icon: {
    height: 32,
    width: 32
  },
}));

const TotalCheckouts = () => {
  const api = React.useContext(DbContext);
  const data = api.codeData as any;
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
              TOTAL CHECKOUTS
            </Typography>
            <Typography variant="h3">{data.totalCheckouts}</Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <PeopleIcon className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

TotalCheckouts.propTypes = {
  className: PropTypes.string
};

export default TotalCheckouts;