import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    details: {
      display: 'flex',
      flexDirection: 'column',
    },
    content: {
      marginBottom: 50
    },
    image: {
      marginLeft: 50,
      width: 170,
    },
    title: {
      fontFamily: "Helvetica",
      marginBottom: 12,
    },
    code: {
      fontWeight: 450,
      marginRight: 5
    },
  }),
);

export default function WelcomeComponent() {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography variant="h5" className={classes.title} component="h2">
            Welcome, Julio
          </Typography>
          <Grid container>
            <Typography className={classes.code} variant="body2" component="p">
              Ambassador Code: 
            </Typography>
            <Typography color="textSecondary" variant="body2" component="p">
              JULIOF12
            </Typography>
          </Grid>
        </CardContent>
      </div>
      <CardMedia
        className={classes.image}
        image="https://cdn.pixabay.com/photo/2017/01/16/20/21/bubbles-1985148_1280.png"
      />
    </Card>
  );
}
