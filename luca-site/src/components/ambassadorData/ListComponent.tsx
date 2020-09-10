import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    selected: {
      backgroundColor: '#f0f0f0'
    },
    listItem: {
      backgroundColor: '#FFFF'
    }
  }),
);

export default function ListComponent(props: any) {
  const classes = useStyles();
  const [selected, setSelected] = React.useState("");

  const selectCode = (code: string) => {
    setSelected(code);
  }

  return (
    <div className={classes.root}>
      <List>
        {props.codes.map((code: any) => (
          <ListItem button className={selected === code ? classes.selected : classes.listItem} onClick={() => selectCode(code)}>
            <ListItemText primary={code} /> 
          </ListItem>
        ))}
      </List>
    </div>
  );
}