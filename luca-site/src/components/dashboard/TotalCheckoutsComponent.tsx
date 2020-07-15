import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Grid, Typography, Avatar } from '@material-ui/core';
import PeopleIcon from '@material-ui/icons/PeopleOutlined';
import { DbContext } from '../../util/api';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import IconButton from '@material-ui/core/IconButton'
import InfoIcon from '@material-ui/icons/Info';

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
  data: {
    fontWeight: 520,
    textAlign:'left'
  }
}));

const TotalCheckouts = () => {
  const api = React.useContext(DbContext);
  const data = api.dashboardData.totalCheckouts as any;
  const classes = useStyles();

  return (
    <Card
    raised={true}
    >
      <CardContent>
        <Grid
          container
          justify="space-between"
        >
          <Grid item>
            <Grid container>
              <Typography
                className={classes.title}
                color="textSecondary"
                gutterBottom
                variant="body2"
              >
                TOTAL CHECKOUTS
              </Typography>
              <Tooltip TransitionComponent={Zoom} title={<Typography variant="subtitle1">This is the total number of checkouts that have been made using your discount code.</Typography>}>
                <IconButton aria-label="delete" style={{padding:'0px', marginLeft:'10px', paddingBottom: '10px'}}>
                  <InfoIcon fontSize="small"/>
                </IconButton>
              </Tooltip>
            </Grid>
            <Typography variant="h3" className={classes.data}>{data}</Typography>
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