import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core/';
import ProductsComponent from './ProductsComponent';

const useStyles = makeStyles((theme: any) => ({
  card: {
    padding: theme.spacing(2),
    '&:hover': {
      backgroundColor: '#8CA888',
    },
    textTransform: "none",
    width: '100%',
    length: '100%'
  },
  selectedCard: {
    padding: theme.spacing(2),
    backgroundColor: '#8CA888',
    textTransform: "none",
    width: '100%',
    length: '100%'
  },
  title: {
    marginBottom: '30px'
  },
}));

const initialState= Object.freeze({
  isDisplayed: false,
  packageSelection: "",

});

export default function PackageComponent(props: any) {
  const classes = useStyles();

  const [selectionState, setCurrentSelection] = React.useState(initialState);

  const handleSelect = (selection: string) => {

    if (selectionState.isDisplayed && selection === selectionState.packageSelection) {
      setCurrentSelection({
        ...selectionState,
        isDisplayed: !selectionState.isDisplayed,
        packageSelection: ""
      });
    } else if (selectionState.isDisplayed && selection !== "") {
      setCurrentSelection({
        ...selectionState,
        packageSelection: selection
      });
     } else if (!selectionState.isDisplayed && selection !== "") {
      setCurrentSelection({
        ...selectionState,
        isDisplayed: !selectionState.isDisplayed,
        packageSelection: selection
      });        
     }
  };


  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom className={classes.title}>
        Select package
      </Typography>
      <Grid container spacing={3}>        
        <Grid item xs={4} >
          <Button 
          variant="outlined" 
          className={selectionState.packageSelection === "1 Bracelet Set" ? classes.selectedCard : classes.card } 
          onClick={() => handleSelect("1 Bracelet Set")}
          >
            1 Bracelet Set
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button 
          variant="outlined" 
          className={selectionState.packageSelection === "2 Single Bracelets" ? classes.selectedCard : classes.card }  
          onClick={() => handleSelect("2 Single Bracelets")}
          >
            2 Single Bracelets
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button 
          variant="outlined" 
          className={selectionState.packageSelection === "2 Anklets" ? classes.selectedCard : classes.card }  
          onClick={() => handleSelect("2 Anklets")}
          >
            2 Anklets
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button 
          variant="outlined" 
          style={{ fontSize: '13px', padding: '18px'}} 
          className={selectionState.packageSelection === "2 1 Bracelet + 1 Anklet" ? classes.selectedCard : classes.card } 
          onClick={() => handleSelect("2 1 Bracelet + 1 Anklet")}>
            1 Bracelet + 1 Anklet
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button 
          variant="outlined" 
          className={selectionState.packageSelection === "1 Necklace" ? classes.selectedCard : classes.card }  
          onClick={() => handleSelect("1 Necklace")}
          >
            1 Necklace
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button 
          variant="outlined" 
          className={selectionState.packageSelection === "1 Pair of Earrings" ? classes.selectedCard : classes.card } 
          onClick={() => handleSelect("1 Pair of Earrings")}
          >
            1 Pair of Earrings
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button 
          variant="outlined" 
          className={selectionState.packageSelection === "1 Baseball Cap" ? classes.selectedCard : classes.card } 
          onClick={() => handleSelect("1 Baseball Cap")}
          >
            1 Baseball Cap
          </Button>
        </Grid>
      </Grid>

      { selectionState.isDisplayed && 
      <div>
        <br />
          <ProductsComponent packageSelection={selectionState.packageSelection} {...props} />
      </div>
      }
    </React.Fragment>
)};