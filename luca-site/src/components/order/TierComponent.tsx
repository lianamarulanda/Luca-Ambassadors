import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { DbContext } from '../../util/api/';
import LinearProgress, { LinearProgressProps } from '@material-ui/core/LinearProgress';
import Box from '@material-ui/core/Box';
import { Accordion } from '@material-ui/core';
import { AccordionSummary } from '@material-ui/core/';
import { AccordionDetails } from '@material-ui/core/';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import GradeIcon from '@material-ui/icons/Grade';
import ClaimItem from './ClaimItemComponent';
import LoadComponent from '../layout/LoadComponent'

const tierLookup = require('../../saleTiers.json');

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

function getTierString(tier: string): string {
  var newTier = "";
  console.log("I got here");
  switch (tier) {
    case "0": {
      newTier = "Starting";
      break;
    }
    case "1": {
      newTier = "First Sale";
      break;
    }
    case "2": {
      newTier = "Third Sale";
      break;
    }
    case "3": {
      newTier = "Tenth Sale";
      break;
    }
    case "4": {
      newTier = "Fifteenth Sale";
      break;
    }
    case "5": {
      newTier = "Thirtieth Sale";
      break;
    }
    case "6": {
      newTier = "Fifthieth Sale";
      break;
    }
  }
  console.log(newTier);
  return newTier;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  main: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
    color: 'white',
    backgroundColor: '#427340',
    '&:hover': {
      color: 'white',
      backgroundColor: '#2E5941'
    }
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export default function TierComponent(props: any) {
  const classes = useStyles();
  const api = React.useContext(DbContext);
  const [progress, setProgress] = React.useState(0);
  const [status, setStatus] = React.useState(false);
  const [currTier, setTier] = React.useState("");
  const [nextTier, setNext] = React.useState("");
  const [salesLeft, setSales] = React.useState(0);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    api.getGiftClaimStatus().then((status: boolean) => {
      var nextTier = parseInt(api.userData.currTier) + 1;
      if (status) {
        setStatus(true);
        setProgress(100);
        setNext(getTierString(nextTier.toString()));
      } else {
        var progress = (api.dashboardData.totalCheckouts / tierLookup[nextTier.toString()]) * 100;
        // if we've gone over 100, that means we are over eligible
        if (progress > 100) {
          progress = 100;
        }
        setProgress(progress);
        var salesLeft = tierLookup[nextTier.toString()] - api.dashboardData.totalCheckouts;
        setSales(salesLeft);
      }
      var tier = getTierString(api.userData.currTier);
      setTier(tier);
      setLoaded(true);
    })
      .catch((error: any) => {

      })
  }, []);

  if (!loaded) {
    return (<LoadComponent />);
  }

  return (
    <div className={classes.root}>
      {status &&
        <ClaimItem name={api.userData.firstName} sale={nextTier} changeComponent={() => props.changeComponent("OrderComponent")} />
      }
      <Grid container
        className={classes.main}
        direction="column"
        justify="center"
      >
        <Grid item>
          <Grid item>
            <Typography gutterBottom={true} variant='h5' style={{ textAlign: 'left' }}>
              Current Tier: {currTier}
            </Typography>
            <Typography gutterBottom={true} variant="subtitle2" style={{ textAlign: 'left', color: '#959d9d' }}>
              Progress until next Tier
            </Typography>
            <Typography gutterBottom={true} variant="subtitle2" style={{ textAlign: 'left', color: '#959d9d' }}>
              Sales left: {salesLeft}
            </Typography>
            <LinearProgressWithLabel value={progress} />
          </Grid>
          {status &&
            <Button variant="contained" className={classes.button} onClick={() => props.changeComponent("OrderComponent")}>
              Claim Free Gift
            </Button>
          }
          <Grid item style={{ marginTop: '30px' }}>
            <Typography variant='h5' style={{ textAlign: 'left' }}>
              Milestones
            </Typography>
            <Accordion style={{ marginTop: '20px' }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <GradeIcon fontSize="small" style={{ marginRight: '10px' }} />
                <Typography className={classes.heading}>Fiftieth Sale</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Your name is added to the Luca Love Classroom in Colombia
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <GradeIcon fontSize="small" style={{ marginRight: '10px' }} />
                <Typography className={classes.heading}>Thirtieth Sale</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  $30 Cash Bonus
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3a-content"
                id="panel3a-header"
              >
                <GradeIcon fontSize="small" style={{ marginRight: '10px' }} />
                <Typography className={classes.heading}>Fifteenth Sale</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Travel sized care package
                  </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3a-content"
                id="panel3a-header"
              >
                <GradeIcon fontSize="small" style={{ marginRight: '10px' }} />
                <Typography className={classes.heading}>Tenth Sale</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Exclusive Luca Love T-shirt
                  </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3a-content"
                id="panel3a-header"
              >
                <GradeIcon fontSize="small" style={{ marginRight: '10px' }} />
                <Typography className={classes.heading}>Third Sale</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Sticker Pack + Pick a Natural Stone Bracelet
                  </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3a-content"
                id="panel3a-header"
              >
                <GradeIcon fontSize="small" style={{ marginRight: '10px' }} />
                <Typography className={classes.heading}>First Sale</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Choose 2 exclusive Luca Love Bracelets
                  </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion disabled>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3a-content"
                id="panel3a-header"
              >
                <Typography className={classes.heading}>Starting</Typography>
              </AccordionSummary>
            </Accordion>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}