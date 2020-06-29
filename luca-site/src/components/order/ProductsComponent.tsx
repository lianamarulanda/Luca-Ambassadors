import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import PropTypes from 'prop-types';
import tileData from './tileData';
import { ordersContext } from '../../util/orders';


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
        boxShadow: theme.shadows[24],
      },
    },
    selectedTile: {
      backgroundColor: '#168C80',
      cursor: 'pointer',
      '&:hover': {
        boxShadow: theme.shadows[24],
      },
    }
  }),
);

const initialState= Object.freeze({
  productsSelected: [] as string[],
  currentPackage: "",
  maxQuantity: 0,
});

export default function ProductsComponent(props: any) {
  const classes = useStyles();
  const orderApi = React.useContext(ordersContext);
  const [selectionState, setProductSelection] = React.useState(initialState);

  // if we select a new package, clear out the products selected from component and the order request
  if (props.packageSelection !== selectionState.currentPackage)
  { 
    console.log("new package selection is: " + props.packageSelection);
    const newProducts = [] as any;
    var max = parseInt(props.packageSelection.charAt(0));

    setProductSelection({
      ...selectionState,
      productsSelected: newProducts,
      currentPackage: props.packageSelection,
      maxQuantity: max,
    });
    orderApi.orderRequest.order.line_items = newProducts;
  }

  const handleSelect = (tileName: any) => {
    const newProducts = selectionState.productsSelected.slice();

    if (newProducts.includes(tileName)) {
      // delete from products array
      var index = newProducts.indexOf(tileName);
      newProducts.splice(index, 1);
    } else if (newProducts.length < selectionState.maxQuantity) {
      newProducts.push(tileName);
    }

    setProductSelection({
      ...selectionState,
      productsSelected: newProducts,

    });
    
    orderApi.orderRequest.order.line_items = newProducts;
    orderApi.printRequest();
  };

  return (
    <div className={classes.root}>
      <GridList cellHeight={180} className={classes.gridList}>
        <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
          <ListSubheader component="div">Select items</ListSubheader>
        </GridListTile>
        {tileData.map((tile) => (
          <GridListTile 
          key={tile.img} 
          onClick={() => handleSelect(tile.title)} 
          className={selectionState.productsSelected.includes(tile.title) ? classes.selectedTile : classes.tile}
          >
            <img src={tile.img} alt={tile.title} />
            <GridListTileBar
              className={classes.tileBar}
              title={tile.title}
              subtitle={<span>by: {tile.author}</span>}
              actionIcon={
                <IconButton href='https://www.luca-love.com' target="_blank" aria-label={`info about ${tile.title}`} className={classes.icon}>
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