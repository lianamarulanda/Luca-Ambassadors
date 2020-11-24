import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Sidebar from '../components/layout/SidebarComponent'
import { useHistory } from 'react-router-dom'
import { DbContext } from '../util/api';
import AdminComponent from '../components/dashboard/AdminComponent';
import DashboardComponent from '../components/dashboard/DashboardComponent';

const dashboardState = Object.freeze({
  totalSales: undefined,
  totalCheckouts: undefined,
  totalCommissions: undefined,
  monthlyCommissions: undefined,
  productMap: undefined,
  announcements: undefined,
  userOrders: undefined,
});


const App: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const api = React.useContext(DbContext);
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
        updateState({
          ...dashboardData,
          announcements: api.dashboardData.announcements,
        })
      })
      .catch((error: any) => {
      })
  }

  const loadDashboardData = async () => {
    await api.loadDashboardData().then(async () => {
      updateState({
        ...dashboardData,
        totalSales: api.dashboardData.totalSales,
        totalCommissions: api.dashboardData.totalCommissions,
        monthlyCommissions: api.dashboardData.monthlyCommissions,
        totalCheckouts: api.dashboardData.totalCheckouts,
        productMap: api.dashboardData.productMap,
        userOrders: api.dashboardData.userOrders
      })
    });
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
