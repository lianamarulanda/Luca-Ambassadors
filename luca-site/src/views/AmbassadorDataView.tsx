import React from 'react';
import ListComponent from '../components/ambassadorData/ListComponent';
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import Sidebar from '../components/layout/SidebarComponent';
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography';
import { DbContext } from '../util/api';
import { useHistory } from 'react-router-dom';
import HeaderComponent from '../components/layout/HeaderComponent';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid'
import LoadComponent from '../components/layout/LoadComponent';
import DataComponent from '../components/ambassadorData/DataComponent';
import dataPic from '../images/dataPic2.png';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  title: {
    fontWeight: 700,
    fontFamily: 'Helvetica',
    textAlign: 'left',
    marginBottom: '50px'
  },
  image: {
    width: '70%',
    height: '70%'
  }
}));

function AmbassadorDataView() {
  const classes = useStyles();
  const api = React.useContext(DbContext);
  const history = useHistory();
  const [sidebar, updateSidebar] = React.useState(false);
  const [codes, updateCodes] = React.useState([] as string[]);
  const [selectedCode, updateSelect] = React.useState("");
  const [loaded, setLoad] = React.useState(true);

  const sidebarToggle = () => {
    updateSidebar(!sidebar);
  }

  React.useEffect(() => {
    if (!api.isLoggedIn()) {
      history.push('/login');
    } else {
      api.getAllCodes()
        .then((codes: any) => {
          var ambassadorCodes = [] as string[];
          codes.forEach((code: string) => {
            ambassadorCodes.push(code);
          }) 
          updateCodes(ambassadorCodes);
        })
        .catch((error: any) => {

        })
    }

  }, [history, api]);

  const selectCode = (code: string) => {
    if (code !== "") {
      updateSelect("");
      setLoad(false);
      api.getDataForCode(code)
        .then(() => {
          updateSelect(code);
          setLoad(true);
        })
        .catch((error: any) => {
        })
    } else {
      updateSelect(code);
    }
  }

  if (codes.length === 0)
    return (<LoadComponent message={"Fetching ambassador codes..."} />);
  
  return (
    <div className={clsx(classes.root)}>
      <CssBaseline />
      <Sidebar sidebarStatus={sidebar} sidebarToggle={sidebarToggle} />
      <main className={classes.content}>
        <Container maxWidth="xl" className={classes.container}>
          <HeaderComponent title="Ambassador Data" component="ambassadorsData" sidebarToggle={sidebarToggle} />
          <Divider light style={{ marginBottom: '40px' }} />
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="flex-start"
          >
            <Grid item xs={12} sm={3}>
              <Card>
                <CardContent>
                  <Typography variant="h5" style={{fontFamily: 'helvetica', fontWeight: 600, marginBottom:'20px'}}>
                    All Ambassador Codes
                  </Typography>
                  <Divider />
                  <ListComponent codes={codes} codeSelection={selectCode} load={loaded}/> 
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={9}>
              {!loaded && 
                <LoadComponent message="Loading ambassador code data..." />
              }
              {selectedCode != "" && 
                <Card>
                  <CardContent>
                    <DataComponent selectedCode={selectedCode} />
                  </CardContent>
                </Card>
              }
              {(selectedCode === "" && loaded) &&
                <img src={dataPic} className={classes.image}/>
              }
            </Grid>         
          </Grid>
        </Container>
      </main>
    </div>
  );
}

export default AmbassadorDataView;