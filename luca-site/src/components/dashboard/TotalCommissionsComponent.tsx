import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Grid, Typography, Avatar } from '@material-ui/core';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { DbContext } from '../../util/api';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import IconButton from '@material-ui/core/IconButton'
import InfoIcon from '@material-ui/icons/Info';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme: any) => ({
  card: {
    backgroundColor: '#2E5941',
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

const TotalCommission = (props: any) => {
  const api = React.useContext(DbContext);
  const classes = useStyles();
  const [loaded, setLoad] = React.useState(false);

  React.useEffect(() => {
    if (props.data !== undefined) {
      setLoad(true);
    }
  });

  return (
    <Card
      raised={true}
      className={classes.card}
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
                color="inherit"
                gutterBottom
                variant="body2"
              >
                TOTAL COMMISSIONS
              </Typography>
              <Tooltip TransitionComponent={Zoom} title={<div><Typography variant="subtitle1">This is 20% of the total sales.</Typography><br /> <Typography variant="subtitle1">The calculation is (total sales) * .20</Typography></div>} >
                <IconButton aria-label="delete" style={{ color: "white", padding: '0px', marginLeft: '10px', paddingBottom: '10px' }}>
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Grid>
            {!loaded &&
                <CircularProgress color="inherit" />
            }
            {loaded &&
              <Typography
              color="inherit"
              variant="h3"
              style={{ fontWeight: 520, textAlign: 'left' }}
              >
                ${props.data.toFixed(2)}
              </Typography>
            }
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

export default TotalCommission;
