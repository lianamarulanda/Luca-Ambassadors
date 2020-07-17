import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Sidebar from '../components/layout/SidebarComponent'
import { useHistory } from 'react-router-dom'
import { DbContext } from '../util/api';
import LoadComponent from '../components/layout/LoadComponent';
import AdminComponent from '../components/dashboard/AdminComponent';
import DashboardComponent from '../components/dashboard/DashboardComponent';


const App: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const api = React.useContext(DbContext);
  const [loaded, setLoaded] = React.useState(false);
  const [admin, setAdmin] = React.useState(false);

  React.useEffect(() => {
    if (!api.isLoggedIn()) {;
      history.push('/login');
    } else {
      api.checkAdminStatus()
        .then((status: boolean) => {
          if (status) {
            setAdmin(true);
            setLoaded(true);
          }
          else {
            if (!loaded) {
              getDashboardData();
            }
          }
        })
    }
  }, [history, api]);

  const getDashboardData = async () => {
    await api.loadDashboardData();
    setLoaded(true);
  }

  if (!loaded) {
    return(<LoadComponent />)
  }

  return (
    <div className={clsx(classes.root)}>
      <CssBaseline />
      <Sidebar />
      <main className={classes.content}>
        { admin &&
          <AdminComponent />
        }
        { !admin &&
          <DashboardComponent />
        }
      </main>
    </div>
  )
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
}))

export default App
