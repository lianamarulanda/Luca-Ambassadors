import React from 'react';
import MediaComponent from '../components/download/MediaComponent'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import Sidebar from '../components/layout/SidebarComponent';
import Container from '@material-ui/core/Container'
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
  const classes = useStyles();
  const api = React.useContext(DbContext);
  const history = useHistory();
  const [admin, setAdmin] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const [content, loadContent] = React.useState([] as object[]);
  const [sidebar, updateSidebar] = React.useState(false);

  const sidebarToggle = () => {
    updateSidebar(!sidebar);
  }

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
              .catch((error: any) => {
                history.push('/error');
              })
          })
          .catch((error: any) => {
            history.push('/error');
          })
      }
    }
  }, [history, api]);


  if (!loaded) {
    return (<LoadComponent message={"If not redirected in a few seconds, please refresh the page."} />)
  }

  return (
    <div className={clsx(classes.root)}>
      <CssBaseline />
      <Sidebar sidebarStatus={sidebar} sidebarToggle={sidebarToggle} />
      <main className={classes.content}>
        <Container maxWidth="lg" className={classes.container}>
          <HeaderComponent adminStatus={admin} title={admin ? "Upload and Delete Content" : "Download Content"}
            component="download"
            sidebarToggle={sidebarToggle}
          />
          <Divider light />
          <MediaComponent adminStatus={admin} content={content} />
        </Container>
      </main>
    </div>
  );
}

export default MediaView;