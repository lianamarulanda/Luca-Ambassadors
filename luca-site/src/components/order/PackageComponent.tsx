import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core/';
import ProductsComponent from './ProductsComponent';
import { ordersContext } from '../../util/orders';

const useStyles = makeStyles((theme: any) => ({
  card: {
    padding: theme.spacing(2),
    height: '80px',
    [theme.breakpoints.down('sm')]: {
      height: "120px"
    },
    '&:hover': {
      backgroundColor: '#8CA888',
    },
    textTransform: "none",
    width: '100%',
    length: '100%'
  },
  selectedCard: {
    padding: theme.spacing(2),
    height: '80px',
    [theme.breakpoints.down('sm')]: {
      height: "120px"
    },
    backgroundColor: '#8CA888',
    textTransform: "none",
    width: '100%',
    length: '100%',
  },
  title: {
    marginBottom: '30px'
  },
}));

const initialState = Object.freeze({
  isDisplayed: false,
  packageSelection: "",

});

const productFilters = Object.freeze({
  "1 Eyeglass Chain": [] as object[],
  "2 Single Bracelets": [] as object[],
  "2 Anklets": [] as object[],
  "2 1 Bracelet + 1 Anklet": [] as object[],
  "1 Necklace": [] as object[],
  "1 Pair of Earrings": [] as object[],
  "1 Baseball Cap": [] as object[]
})

export default function PackageComponent(props: any) {
  const classes = useStyles();
  const [selectionState, setCurrentSelection] = React.useState(initialState);
  const orderApi = React.useContext(ordersContext);
  const [filteredProducts, updateFilters] = React.useState(productFilters);

  React.useEffect(() => {
    if (filteredProducts["2 Single Bracelets"].length === 0) {
      filterProducts(props.data);
    }
  }, []);

  const filterProducts = (allProducts: any) => {
    var glassesChains = [] as object[];
    var singleBracelets = [] as object[];
    var anklets = [] as object[];
    var braceletAnklet = [] as object[];
    var necklaces = [] as object[];
    var earrings = [] as object[];
    var baseballCaps = [] as object[];

    allProducts.forEach((product: any) => {
      if (product.product_type == "Eyeglass Chain") {
        glassesChains.push(product);
      } else if (product.product_type === "Bracelet" && !product.tags.includes("Sets")) {
        singleBracelets.push(product);
        braceletAnklet.push(product);
      } else if (product.product_type === "anklet") {
        anklets.push(product);
        braceletAnklet.push(product);
      } else if (product.product_type === "Necklace") {
        necklaces.push(product);
      } else if (product.product_type === "Earrings") {
        earrings.push(product);
      } else if (product.product_type === "Hats") {
        baseballCaps.push(product);
      }
    })

    updateFilters({
      ...filteredProducts,
      "1 Eyeglass Chain": glassesChains,
      "2 Single Bracelets": singleBracelets,
      "2 Anklets": anklets,
      "2 1 Bracelet + 1 Anklet": braceletAnklet,
      "1 Necklace": necklaces,
      "1 Pair of Earrings": earrings,
      "1 Baseball Cap": baseballCaps
    });
  }

  const handleSelect = (selection: string) => {
    if (selectionState.isDisplayed && selection === selectionState.packageSelection) {
      setCurrentSelection({
        ...selectionState,
        isDisplayed: !selectionState.isDisplayed,
        packageSelection: ""
      });
      orderApi.packageSelection = "";
    } else if (selectionState.isDisplayed && selection !== "") {
      setCurrentSelection({
        ...selectionState,
        packageSelection: selection
      });
      orderApi.packageSelection = selection;
    } else if (!selectionState.isDisplayed && selection !== "") {
      setCurrentSelection({
        ...selectionState,
        isDisplayed: !selectionState.isDisplayed,
        packageSelection: selection
      });
      orderApi.packageSelection = selection;
    }
    if (orderApi.packageSelection === "2 1 Bracelet + 1 Anklet")
      orderApi.packageSelection = "1 Bracelet + 1 Anklet";
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
            className={selectionState.packageSelection === "1 Eyeglass Chain" ? classes.selectedCard : classes.card}
            onClick={() => handleSelect("1 Eyeglass Chain")}
          >
            1 Eyeglass Chain
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button
            variant="outlined"
            className={selectionState.packageSelection === "2 Single Bracelets" ? classes.selectedCard : classes.card}
            onClick={() => handleSelect("2 Single Bracelets")}
          >
            2 Single Bracelets
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button
            variant="outlined"
            className={selectionState.packageSelection === "2 Anklets" ? classes.selectedCard : classes.card}
            onClick={() => handleSelect("2 Anklets")}
          >
            2 Anklets
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button
            variant="outlined"
            style={{ fontSize: '13px' }}
            className={selectionState.packageSelection === "2 1 Bracelet + 1 Anklet" ? classes.selectedCard : classes.card}
            onClick={() => handleSelect("2 1 Bracelet + 1 Anklet")}>
            1 Bracelet + 1 Anklet
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button
            variant="outlined"
            className={selectionState.packageSelection === "1 Necklace" ? classes.selectedCard : classes.card}
            onClick={() => handleSelect("1 Necklace")}
          >
            1 Necklace
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button
            variant="outlined"
            className={selectionState.packageSelection === "1 Pair of Earrings" ? classes.selectedCard : classes.card}
            onClick={() => handleSelect("1 Pair of Earrings")}
          >
            1 Pair of Earrings
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="outlined"
            className={selectionState.packageSelection === "1 Baseball Cap" ? classes.selectedCard : classes.card}
            style={{ height: '70px' }}
            onClick={() => handleSelect("1 Baseball Cap")}
          >
            1 Baseball Cap
          </Button>
        </Grid>
      </Grid>

      {selectionState.isDisplayed &&
        <div>
          <br />
          <ProductsComponent packageSelection={selectionState.packageSelection} {...filteredProducts} />
        </div>
      }
      {!selectionState.isDisplayed &&
        <Typography variant="overline" style={{ marginTop: '30px' }}>
          Number of items selected: {orderApi.orderRequest.order.line_items.length}
        </Typography>
      }
    </React.Fragment>
  )
};