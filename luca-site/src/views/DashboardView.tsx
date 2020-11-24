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

const dashboardState = Object.freeze({
  totalSales: 0,
  totalCheckouts: 0,
  totalCommissions: 0,
  monthlyCommissions: [],
  productMap: new Map(),
  announcements: [],
});


const App: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const api = React.useContext(DbContext);
  const [loaded, setLoaded] = React.useState(false);
  const [admin, setAdmin] = React.useState(false);
  const [sidebar, updateSidebar] = React.useState(false);
  const [dashboardData, updateState] = React.useState(dashboardState);

  const sidebarToggle = () => {
    updateSidebar(!sidebar);
  }

  React.useEffect(() => {
    if (!api.isLoggedIn()) {
      history.push('/login');
    } else {
      api.checkAdminStatus()
        .then((status: boolean) => {
          if (status) {
            setAdmin(true);
            getAnnouncements();
          } else {
            setLoaded(true);
            loadDashboardData();
          }
        })
        .catch((error: any) => {
          history.push('/error');
        })
    }
  }, [history, api]);

  const getAnnouncements = async () => {
    api.loadAnnouncements()
      .then(() => {
        setLoaded(true);
      })
      .catch((error: any) => {
      })
  }

  const loadDashboardData = async () => {
    api.loadDashboardData();
    // how to make dashboard state refresh while api.loadDashboardData runs its course?
    updateState({
      ...dashboardData,
      totalSales: api.dashboardData.totalSales,
      totalCommissions: api.dashboardData.totalCommissions,
      monthlyCommissions: api.dashboardData.monthlyCommissions,
      totalCheckouts: api.dashboardData.totalCheckouts,
      productMap: api.dashboardData.productMap,
      announcements: api.dashboardData.announcements
    })
  }

  if (!loaded) {
    return (<LoadComponent />)
  }

  console.log(dashboardData);

  return (
    <div className={clsx(classes.root)}>
      <CssBaseline />
      <Sidebar sidebarStatus={sidebar} sidebarToggle={sidebarToggle} />
      <main className={classes.content}>
        {admin &&
          <AdminComponent adminStatus={admin} sidebarToggle={sidebarToggle} />
        }
        {!admin &&
          <DashboardComponent adminStatus={admin} sidebarToggle={sidebarToggle} data={dashboardData} />
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
