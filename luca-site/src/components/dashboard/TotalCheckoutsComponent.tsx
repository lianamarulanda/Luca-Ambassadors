import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Grid, Typography, Avatar } from '@material-ui/core';
import PeopleIcon from '@material-ui/icons/PeopleOutlined';
import { DbContext } from '../../util/api';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import IconButton from '@material-ui/core/IconButton'
import InfoIcon from '@material-ui/icons/Info';
import CircularProgress from '@material-ui/core/CircularProgress';

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
    textAlign: 'left'
  }
}));

const TotalCheckouts = (props: any) => {
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
                <IconButton aria-label="delete" style={{ padding: '0px', marginLeft: '10px', paddingBottom: '10px' }}>
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              </Grid>
              {!loaded &&
                <CircularProgress />
              }
              {loaded &&
                <Typography variant="h3" className={classes.data}>{props.data}</Typography>
              }
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

export default TotalCheckouts;