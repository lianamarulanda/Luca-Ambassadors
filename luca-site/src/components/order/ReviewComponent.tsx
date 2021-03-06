import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { ordersContext } from '../../util/orders';
import AddBoxIcon from '@material-ui/icons/AddBox';
import IconButton from '@material-ui/core/IconButton'
import RemoveIcon from '@material-ui/icons/Remove';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles((theme) => ({
  listItem: {
    padding: theme.spacing(1, 0),
  },
  total: {
    fontWeight: 700,
    color: '#427340'
  },
  title: {
    marginTop: theme.spacing(2),
    textAlign: 'left',
    fontWeight: 'bolder',
  },
  icon: {
    color: '#2E5941'
  }
}));


export default function ReviewComponent(orderData: any) {
  const classes = useStyles();
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const addresses = [orderData.address1, orderData.city, orderData.province, orderData.zip, orderData.country];
  const orderApi = React.useContext(ordersContext);
  const [reload, setReload] = React.useState(false);
  const [error, setError] = React.useState("");

  function addQuantity(): number {
    var total = 0;
    for (var i = 0; i < orderApi.orderRequest.order.line_items.length; i++) {
      total += orderApi.orderRequest.order.line_items[i].quantity;
    }
    return total;
  }
  var totalQuantity: number = addQuantity();

  const increaseQuantity = (product: any) => {
    setError("");
    for (var i = 0; i < orderApi.orderRequest.order.line_items.length; i++) {
      if (orderApi.orderRequest.order.line_items[i].variant_id === product.variant_id && totalQuantity < orderApi.maxQuantity) {
        if (orderApi.inventoryProductMap.get(product.variant_id) >= orderApi.orderRequest.order.line_items[i].quantity + 1)
          orderApi.orderRequest.order.line_items[i].quantity++;
        else
          setError(`Cannot increase quantity for ${product.title}: not enough in stock`);
        break;
      }
    }
    setReload(!reload);
  }
  const decreaseQuantity = (product: any) => {
    setError("");
    for (var i = 0; i < orderApi.orderRequest.order.line_items.length; i++) {
      if (orderApi.orderRequest.order.line_items[i].variant_id === product.variant_id) {
        if (orderApi.orderRequest.order.line_items[i].quantity > 1)
          orderApi.orderRequest.order.line_items[i].quantity--;
        else if (orderApi.orderRequest.order.line_items[i].quantity === 1) {
          // remove if they set quantity to 0
          orderApi.orderRequest.order.line_items.splice(i, 1);
        }
        break;
      }
    }
    setReload(!reload);
  }
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      {error !== "" &&
        <div>
          <Typography variant="overline" color="error" display="block" gutterBottom>
            {error}
          </Typography>
        </div>
      }
      <Grid container direction="row" justify="space-between" alignItems="center">
        <Grid item>
          <Typography variant="subtitle2" style={{ textAlign: 'left', fontWeight: 'bolder' }}>
            All items in cart
          </Typography>
        </Grid>
        <Grid item style={{ justifySelf: 'right' }}>
          <Typography variant="subtitle2" style={{ textAlign: 'right' }}>
            {orderApi.packageSelection}
          </Typography>
        </Grid>
      </Grid>
      <List disablePadding>
        {orderApi.orderRequest.order.line_items.map((product: any) => (
          <ListItem className={classes.listItem} key={product.variant_id}>
            <Grid container direction="row" justify="space-between" alignItems="center">
              <Grid item xs={12} md={8}>
                <ListItemText primary={product.title} />
              </Grid>
              <Grid item xs={12} md={4}>
                <Grid container direction="row" alignItems="center" justify={smallScreen ? "flex-start" : "flex-end"}>
                  <Typography variant="body2">Qty: {product.quantity}</Typography>
                  <IconButton className={classes.icon} aria-label="add quantity" onClick={() => increaseQuantity(product)}>
                    <AddBoxIcon />
                  </IconButton>
                  <IconButton className={classes.icon} aria-label="subtract quantity" onClick={() => decreaseQuantity(product)}>
                    <RemoveIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </ListItem>
        ))}
        <ListItem className={classes.listItem}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" className={classes.total}>
            Free
          </Typography>
        </ListItem>
      </List>
      <Grid container spacing={2} style={{ alignItems: 'left', justifyContent: 'left' }}/*style={{alignItems: 'center', justifyContent: 'center'}}*/>
        <Grid item xs={6}>
          <Typography variant="subtitle2" gutterBottom className={classes.title}>
            Shipping
          </Typography>
          <Typography gutterBottom style={{ textAlign: 'left' }}>{orderApi.orderRequest.order.customer.first_name + " " + orderApi.orderRequest.order.customer.last_name}</Typography>
          <Typography gutterBottom style={{ textAlign: 'left' }}>{addresses.join(', ')}</Typography>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
ReviewComponent.propTypes = {
  orderData: PropTypes.any,
}