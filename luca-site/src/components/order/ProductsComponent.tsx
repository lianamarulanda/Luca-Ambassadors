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
import square from '../../images/square.jpg';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';

// sort the products to load based on package component
function filterProducts(productType: string, allProducts: object[]): object[] {
  // will need to take variants into account!!
  var filteredProducts = [] as object[];
  switch(productType) {
    case "1 Bracelet Set": {
      allProducts.forEach((product: any) => {
        if (product.tags.includes("Sets")) {
          filteredProducts.push(product);
        }
      })
      break;
    } case "2 Single Bracelets": {
      allProducts.forEach((product: any) => {
        if (product.product_type === "Bracelet" && !product.tags.includes("Sets")) {
          filteredProducts.push(product);
        }
      })
      break;
    } case "2 Anklets": {
      allProducts.forEach((product: any) => {
        if (product.product_type === "anklet") {
          filteredProducts.push(product);
        }
      })
      break;
    } case "2 1 Bracelet + 1 Anklet": {
      allProducts.forEach((product: any) => {
        if (product.product_type === "Bracelet" && !product.tags.includes("Sets")) {
          filteredProducts.push(product);
        } if (product.product_type === "anklet") {
          filteredProducts.push(product);
        }
      })
      break;
    } case "1 Necklace": {
      allProducts.forEach((product: any) => {
        if (product.product_type === "Necklace") {
          filteredProducts.push(product);
        }
      })
      break;
    } case "1 Pair of Earrings": {
      allProducts.forEach((product: any) => {
        if (product.product_type === "Earrings") {
          filteredProducts.push(product);
        }
      })
      break;
    } case "1 Baseball Cap": {
      allProducts.forEach((product: any) => {
        if (product.product_type === "Hats") {
          filteredProducts.push(product);
        }
      })
      break;
    }
  }
  return filteredProducts;
}

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
    }
  }),
);

const initialState= Object.freeze({
  productsSelected: [] as string[],
  currentPackage: "",
  maxQuantity: 0,
  loadedProducts: [] as object[]
});

export default function ProductsComponent(props: any) {
  const classes = useStyles();
  const orderApi = React.useContext(ordersContext);
  const [selectionState, setProductSelection] = React.useState(initialState);

  // if we select a new package, clear out the products selected from component and the order request
  // load the new filtered products
  if (props.packageSelection !== selectionState.currentPackage) { 
    const newProducts = [] as any;
    var max = parseInt(props.packageSelection.charAt(0));
    var filteredProducts = [] as any;

    // filter the products to load based on package selected 
    filteredProducts = filterProducts(props.packageSelection, props.data);
    
    setProductSelection({
      ...selectionState,
      productsSelected: newProducts,
      currentPackage: props.packageSelection,
      maxQuantity: max,
      loadedProducts: filteredProducts
    });
    // clear products from order request
    orderApi.orderRequest.order.line_items = newProducts;
    orderApi.inventoryProductMap.clear();
    orderApi.subtotal = 0;

    // set max quantity in order context
    if (orderApi.packageSelection === "1 Bracelet + 1 Anklet")
      orderApi.maxQuantity = 1;
    else 
      orderApi.maxQuantity = max;
  }

  const handleSelect = (productTile: any) => {
    var canAdd = true;
    var newProducts = selectionState.productsSelected.slice();
    // if our products selected already includes the product, it is being deselcted, so delete it
    if (newProducts.includes(productTile.variants[0].id)) {
      var index = newProducts.indexOf(productTile.variants[0].id);
      newProducts.splice(index, 1);
      orderApi.orderRequest.order.line_items.splice(index, 1);
      orderApi.inventoryProductMap.delete(productTile.variants[0].id);
      orderApi.subtotal -= productTile.variants[0].price;
    // it is possible to add the new product bc not yet reached max capacity
    } else if (newProducts.length < selectionState.maxQuantity) {
      if (selectionState.currentPackage === "2 1 Bracelet + 1 Anklet" && newProducts.length === 1) {
        if (orderApi.orderRequest.order.line_items[0].title.includes("Anklet") && productTile.title.includes("Anklet"))
          canAdd = false;
        else if (orderApi.orderRequest.order.line_items[0].title.includes("Bracelet") && productTile.title.includes("Bracelet"))
          canAdd = false;
      }

      if (canAdd) {
        newProducts.push(productTile.variants[0].id);
        orderApi.orderRequest.order.line_items.push({
          title: productTile.title,
          variant_id: productTile.variants[0].id,
          quantity: 1
        });
        orderApi.inventoryProductMap.set(productTile.variants[0].id, productTile.variants[0].inventory_quantity);
        orderApi.subtotal += productTile.variants[0].price;
      }

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
      orderApi.subtotal += productTile.variants[0].price;
    }

    setProductSelection({
      ...selectionState,
      productsSelected: newProducts,
    });
  };

  return (
    <div className={classes.root}>
      <GridList cellHeight={180} className={classes.gridList}>
        <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
          <Grid container style={{justifyContent: 'center'}}>
            <ListSubheader component="div">Select items</ListSubheader>
            <Tooltip title={<div><Typography variant="subtitle1">Click on a product's info button to view more details.</Typography><br /> <Typography variant="subtitle1">The quantities will be selected in the next step.</Typography></div>} >
              <IconButton aria-label="info">
                <InfoIcon fontSize="small"/>
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
      <Grid>
        <Typography variant="overline">Number of items selected: {orderApi.orderRequest.order.line_items.length} </Typography>
      </Grid>
    </div>
  );
}

ProductsComponent.propTypes = {
  packageSelection: PropTypes.any,
}