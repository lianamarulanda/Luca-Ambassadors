import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Grid, Typography, Avatar } from '@material-ui/core';
import MoneyIcon from '@material-ui/icons/Money';
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
                TOTAL SALES
              </Typography>
              <Tooltip TransitionComponent={Zoom} title={<Typography variant="subtitle1">This is the sum of the subtotals for each sale after applying your discount code.</Typography>}>
                <IconButton aria-label="delete" style={{padding:'0px', marginLeft:'10px', paddingBottom: '10px'}}>
                  <InfoIcon fontSize="small"/>
                </IconButton>
              </Tooltip>
            </Grid>
            {/* <Typography variant="h3">${data.totalSales.toFixed(2)}</Typography> */}
            <Typography variant="h3" style={{fontWeight:520, textAlign:'left'}}>$50</Typography>
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