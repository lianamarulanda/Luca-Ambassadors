import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core/';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import UpdatePassword from './UpdatePasswordComponent';
import { Divider } from '@material-ui/core';
import UpdateEmail from './UpdateEmailComponent';
import UpdatePersonalInfo from './UpdatePersonalComponent';
import { Card } from '@material-ui/core';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  card: {
    width: '100%',
    maxWidth: 10000,
  },
  labels: {
    textTransform: "none"
  },
}));

export default function SimpleTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Card className={classes.card} variant="outlined">
        <Paper className={classes.root} elevation={0}>
          <Tabs value={value} 
          onChange={handleChange} 
          aria-label="simple tabs example"
          indicatorColor="primary"
          textColor="primary"
          centered
          >
            <Tab className={classes.labels} label="Personal info" {...a11yProps(0)} />
            <Tab className={classes.labels} label="Email" {...a11yProps(1)} />
            <Tab className={classes.labels} label="Password" {...a11yProps(2)} />
          </Tabs>
        </Paper>
        <Divider variant="middle" light={true} />
        <TabPanel value={value} index={0}>
          <UpdatePersonalInfo />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <UpdateEmail />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <UpdatePassword />
        </TabPanel>
      </Card>
    </div>
  );
}
