import React from 'react';
import MediaComponent from '../components/download/MediaComponent'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import Sidebar from '../components/layout/SidebarComponent';
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography';
import { DbContext } from '../util/api';
import { useHistory } from 'react-router-dom';
import LoadComponent from '../components/layout/LoadComponent';
import HeaderComponent from '../components/layout/HeaderComponent';
import Divider from '@material-ui/core/Divider';

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
    marginBottom: '15px'
  }
}));

function MediaView() {
  // notes - could probably make title a lighter gray
  const classes = useStyles();
  const api = React.useContext(DbContext);
  const history = useHistory();
  const [admin, setAdmin] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const [content, loadContent] = React.useState([] as object[]);

  React.useEffect(() => {
    if (!api.isLoggedIn()) {
      history.push('/login');
    } else {
      if (!loaded) {
        api.checkAdminStatus()
          .then((status: boolean) => {
            setAdmin(status);
            api.loadAllPhotos()
              .then((images: any) => {
                loadContent(images);
                setLoaded(true);
              })
          })
      } 
    }
  }, [history, api]);


  if (!loaded) {
    return(<LoadComponent />)
  }

  return (
    <div className={clsx(classes.root)}>
      <CssBaseline />
      <Sidebar />
      <main className={classes.content}>
        <Container maxWidth="lg" className={classes.container}>
          <HeaderComponent adminStatus={admin} title={admin ? "Upload and Delete Content" : "Download Social Media Content"}
            component="download"
          />
          <Divider light/>
          <MediaComponent adminStatus={admin} content={content} />
        </Container>
      </main>
    </div>
  );
}

export default MediaView;