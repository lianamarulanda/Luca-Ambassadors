import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { DbContext } from '../../util/api';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography'
import { Grid } from '@material-ui/core';

interface Column {
  id: 'date' | 'description';
  label: string;
  minWidth?: number;
  maxWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: 'date', label: 'Date Posted', minWidth: 100, maxWidth: 100 },
  { id: 'description', label: 'Description', minWidth: 100, maxWidth: 100 },
];

interface Data {
  date: string;
  description: string;
}

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
  title: {
    fontWeight: 'bolder'
  },
  button: {
    color: '#2E5941'
  },
  dialogPaper: {
    height: '50%',
  },
  uploadSuccess: {
    color: '#2E5941'
  }
});

export default function AnnouncementsComponent(props: any) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [openDialog, setDialog] = React.useState(false);
  const api = React.useContext(DbContext);
  const data = api.dashboardData.announcements as object[];
  const [announcement, setAnnouncement] = React.useState({
    description: "",
    date: ""
  });
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const openPopup = (announcement: any) => {
    setAnnouncement({
      ...announcement,
      description: announcement.description,
      date: announcement.date
    });
    setDialog(true);
  }

  const closePopup = () => {
    setAnnouncement({
      ...announcement,
      description: "",
      date: "",
    });
    setDialog(false);
    setMessage("");
    setError("");
  }

  const deleteAnnouncement = (announcement: any) => {
    api.deleteAnnouncement(announcement)
      .then((result: string) => {
        setError("");
        setMessage(result);
      })
      .catch((error: string) => {
        setMessage("");
        setError(error);
      })
  }

  return (
    <Paper className={classes.root}>
      <Dialog
        open={openDialog}
        onClose={closePopup}
        fullWidth={true}
        maxWidth={'md'}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle id="alert-dialog-title">
          Announcement
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {announcement.description}
          </DialogContentText>
          <Grid item>
            {message !== "" &&
              <Typography variant="overline" className={classes.uploadSuccess} gutterBottom>
                {message}
              </Typography>
            }
            {error !== "" &&
              <Typography variant="overline" color="error" display="block" gutterBottom>
                {error}
              </Typography>
            }
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={closePopup} className={classes.button}>
            Close
          </Button>
          {props.adminStatus &&
            <Button className={classes.button} onClick={() => deleteAnnouncement(announcement)} autoFocus>
              Delete
            </Button>
          }
        </DialogActions>
      </Dialog>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, maxWidth: column.maxWidth }}
                  className={classes.title}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: any) => {
              console.log(row);
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  {columns.map((column) => {
                    const original = row[column.id];
                    var value = original;

                    if (value.length > 255) {
                      value = value.substring(0, 253);
                      value += '...';
                    }
                    return (
                      <TableCell key={column.id} align={column.align} onClick={() => openPopup(row)}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}