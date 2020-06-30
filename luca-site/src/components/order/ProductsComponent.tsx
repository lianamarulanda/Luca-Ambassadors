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

// sort the products to load based on package component
function filterProducts(productType: string, allProducts: object[]): object[] {
  // will need to take variants into account!!
  var filteredProducts = [] as object[];
  switch(productType) {
    case "1 Bracelet Set": {
      allProducts.forEach((product: any) => {
        if (product.tags.includes("Sets") && product.variants[0].inventory_quantity !== 0) {
          filteredProducts.push(product);
        }
      })
      break;
    } case "2 Single Bracelets": {
      allProducts.forEach((product: any) => {
        if (product.product_type === "Bracelet" && !product.tags.includes("Sets") && product.variants[0].inventory_quantity !== 0) {
          filteredProducts.push(product);
        }
      })
      break;
    } case "2 Anklets": {
      allProducts.forEach((product: any) => {
        if (product.product_type === "anklet" && product.variants[0].inventory_quantity !== 0) {
          filteredProducts.push(product);
        }
      })
      break;
    } case "2 1 Bracelet + 1 Anklet": {
      allProducts.forEach((product: any) => {
        if (product.product_type === "Bracelet" && !product.tags.includes("Sets") && product.variants[0].inventory_quantity !== 0) {
          filteredProducts.push(product);
        } if (product.product_type === "anklet" && product.variants[0].inventory_quantity !== 0) {
          filteredProducts.push(product);
        }
      })
      break;
    } case "1 Necklace": {
      allProducts.forEach((product: any) => {
        if (product.product_type === "Necklace" && product.variants[0].inventory_quantity !== 0) {
          filteredProducts.push(product);
        }
      })
      break;
    } case "1 Pair of Earrings": {
      allProducts.forEach((product: any) => {
        if (product.product_type === "Earrings" && product.variants[0].inventory_quantity !== 0) {
          filteredProducts.push(product);
        }
      })
      break;
    } case "1 Baseball Cap": {
      allProducts.forEach((product: any) => {
        if (product.product_type === "Hats" && product.variants[0].inventory_quantity !== 0) {
          filteredProducts.push(product);
        }
      })
      break;
    }
  }

  return createTiles(filteredProducts);
}

function createTiles(products: object[]): object[]
{
  var tiles = [] as object[];
  products.forEach((product: any) => {
    if (product.images[0] === undefined)
      console.log("undefined product!" + product.title);
    else {
      tiles.push({
        img: product.images[0].src,
        title: product.title,
        link: "https://www.luca-love.com/products/" + product.handle,
        variant_id: product.variants[0].id,
      })
    }

  })

  return tiles;
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
      backgroundColor: '#168C80',
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
  if (props.packageSelection !== selectionState.currentPackage)
  { 
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

  }

  const handleSelect = (variant_id: string) => {
    const newProducts = selectionState.productsSelected.slice();
    if (newProducts.includes(variant_id)) {
      // delete from products array
      var index = newProducts.indexOf(variant_id);
      newProducts.splice(index, 1);
    } else if (newProducts.length < selectionState.maxQuantity) {
      newProducts.push(variant_id);
    }

    setProductSelection({
      ...selectionState,
      productsSelected: newProducts,
    });
    
    var productsToOrder = [] as object[];

    newProducts.forEach((productID: string) => {
      productsToOrder.push({
        variant_id: productID,
        quantity: 1
      })
    })

    orderApi.orderRequest.order.line_items = productsToOrder;
  };

  return (
    <div className={classes.root}>
      <GridList cellHeight={180} className={classes.gridList}>
        <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
          <ListSubheader component="div">Select items</ListSubheader>
        </GridListTile>
        {selectionState.loadedProducts.map((tile: any) => (
          <GridListTile 
          key={tile.img}  
          className={selectionState.productsSelected.includes(tile.variant_id) ? classes.selectedTile : classes.tile}
          >
            <img src={tile.img} alt={tile.title} onClick={() => handleSelect(tile.variant_id)} />
            <GridListTileBar
              className={classes.tileBar}
              title={tile.title}
              actionIcon={
                <IconButton href={tile.link} target="_blank" aria-label={`info about ${tile.title}`} className={classes.icon}>
                  <InfoIcon />
                </IconButton>
              }
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}

ProductsComponent.propTypes = {
  packageSelection: PropTypes.any,
}