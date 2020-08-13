import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import PropTypes from 'prop-types';
import { ordersContext } from '../../util/orders';
import square from '../../images/square5.png';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';
import LoadComponent from '../layout/LoadComponent'; 
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {
      width: 500,
      height: 450,
    },
    tileBar: {
      textAlign: 'left',
    },
    icon: {
      color: 'rgba(255, 255, 255, 0.54)',
    },
    tile: {
      cursor: 'pointer',
      '&:hover': {
        boxShadow: theme.shadows[15],
      },
    },
    selectedTile: {
      backgroundColor: '#427340',
      cursor: 'pointer',
      '&:hover': {
        boxShadow: theme.shadows[15],
      },
    },
    snackbar: {
      width: '100%'
    }
  }),
);

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function SelectFreeGiftComponent(props: any) {
  const classes = useStyles();
  const orderApi = React.useContext(ordersContext);
  const [loaded, setLoaded] = React.useState(false);
  const [announcement, setOpen] = React.useState(false);
  const [selectionState, setProductSelection] = React.useState({
    productsSelected: initProductsSelected(),
    maxQuantity: 0,
    loadedProducts: [] as object[]
  });

  function initProductsSelected(): string[] {
    var itemsSelected = [] as string[];
    // clear products from order request
    orderApi.orderRequest.order.line_items.forEach((product: any) => {
      itemsSelected.push(product.variant_id);
    })
    return itemsSelected;
  }

  React.useEffect(() => {
    if (selectionState.loadedProducts.length === 0) {
      filterProducts(props.currTier, props.data);
      setLoaded(true);
    }
  }, []);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const filterProducts = (currTier: string, allProducts: any) => {
    var products = [] as object[];
    var productTag = "";
    var max = 1;
    switch(currTier)
    {
      case "0": {
        productTag = "First Sale";
        orderApi.packageSelection = "2 Exclusive Bracelets";
        max = 2; 
        break;
      }
      case "1": {
        productTag = "Third Sale";
        setOpen(true);
        orderApi.packageSelection = "1 Natural Stone Bracelet + Sticker Pack";
        break;
      }
      case "2": {
        productTag = "Tenth Sale";
        orderApi.packageSelection = "1 Luca Love T-Shirt";
        break;
      }
      case "3": {
        productTag = "Fifteenth Sale";
        orderApi.packageSelection = "1 Travel Sized Care Package";
        break;
      }
    }

    allProducts.forEach((product: any) => {
      if (product.tags.includes(productTag))
        products.push(product);
    })
    orderApi.maxQuantity = max;

    setProductSelection({
      ...selectionState,
      loadedProducts: products,
      maxQuantity: max
    });
  }

  const handleSelect = (productTile: any) => {
    var newProducts = selectionState.productsSelected.slice();
    // if our products selected already includes the product, it is being deselcted, so delete it
    if (newProducts.includes(productTile.variants[0].id)) {
      var index = newProducts.indexOf(productTile.variants[0].id);
      newProducts.splice(index, 1);
      orderApi.orderRequest.order.line_items.splice(index, 1);
      orderApi.inventoryProductMap.delete(productTile.variants[0].id);
      orderApi.subtotal -= parseFloat(productTile.variants[0].price);
      // it is possible to add the new product bc not yet reached max capacity
    } else if (newProducts.length < selectionState.maxQuantity) {

      newProducts.push(productTile.variants[0].id);
      orderApi.orderRequest.order.line_items.push({
        title: productTile.title,
        variant_id: productTile.variants[0].id,
        quantity: 1
      });
      orderApi.inventoryProductMap.set(productTile.variants[0].id, productTile.variants[0].inventory_quantity);
      orderApi.subtotal += parseFloat(productTile.variants[0].price);

      // we reached max capacity, so if the max capacity is one, replace the item
    } else if (newProducts.length === selectionState.maxQuantity && selectionState.maxQuantity === 1) {
      // replace current product w/new one
      newProducts[0] = productTile.variants[0].id;
      orderApi.orderRequest.order.line_items[0] = {
        title: productTile.title,
        variant_id: productTile.variants[0].id,
        quantity: 1
      }
      orderApi.inventoryProductMap.clear();
      orderApi.inventoryProductMap.set(productTile.variants[0].id, productTile.variants[0].inventory_quantity);
      orderApi.subtotal = 0;
      orderApi.subtotal += parseFloat(productTile.variants[0].price);
    }

    setProductSelection({
      ...selectionState,
      productsSelected: newProducts,
    });
  };

  if (!loaded)
    return (<LoadComponent />);

  return (
    <div className={classes.root}>
      {announcement &&
        <Snackbar
          open={announcement}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          className={classes.snackbar}
        >
          <Alert onClose={handleClose} severity="info">
            <Typography variant="subtitle1" style={{ fontWeight: "bolder" }}>
              The sticker pack will be mailed to you along with the selected bracelet!
            </Typography>
          </Alert>
        </Snackbar>
      }
      <Typography variant="h6" style={{textAlign: 'left'}}> Free Gift: {orderApi.packageSelection} </Typography>
      <GridList cellHeight={180} className={classes.gridList}>
        <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
          <Grid container style={{ justifyContent: 'center' }}>
            <ListSubheader component="div">Select items</ListSubheader>
            <Tooltip title={<div><Typography variant="subtitle1">Click on a product's info button to view more details.</Typography><br /> <Typography variant="subtitle1">The quantities will be selected in the next step.</Typography></div>} >
              <IconButton aria-label="info">
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Grid>
        </GridListTile>
        {selectionState.loadedProducts.map((tile: any) => (
          <GridListTile
            key={tile.id}
            className={selectionState.productsSelected.includes(tile.variants[0].id) ? classes.selectedTile : classes.tile}
          >
            <img src={tile.image !== null ? tile.image.src : square} alt={tile.title} onClick={() => handleSelect(tile)} />
            <GridListTileBar
              className={classes.tileBar}
              title={tile.title}
              actionIcon={
                <IconButton href={`https://luca-love.com/products/${tile.handle}`} target="_blank" aria-label={`info about ${tile.title}`} className={classes.icon}>
                  <InfoIcon />
                </IconButton>
              }
            />
          </GridListTile>
        ))}
      </GridList>
      <br />
      <Grid style={{ marginTop: '25px' }}>
        <Typography variant="overline">Number of items selected: {orderApi.orderRequest.order.line_items.length} </Typography>
        <br />
      </Grid>
    </div>
  );
}

SelectFreeGiftComponent.propTypes = {
  packageSelection: PropTypes.any,
  currTier: PropTypes.string,
}