import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
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
import { ReactComponent } from '*.svg';

const useStyles = makeStyles((theme) => ({
  listItem: {
    padding: theme.spacing(1, 0),
  },
  total: {
    fontWeight: 700,
    color: '#3ace3a'
  },
  title: {
    marginTop: theme.spacing(2),
    textAlign: 'left',
    fontWeight: 'bolder',

  },
}));


export default function ReviewComponent(orderData: any) {
  const classes = useStyles();
  const addresses = [orderData.address1, orderData.city, orderData.province, orderData.zip, orderData.country];
  const orderApi = React.useContext(ordersContext);
  const [reload, setReload] = React.useState(false);
  function addQuantity(): number {
    var total = 0;
    for (var i = 0; i < orderApi.orderRequest.order.line_items.length; i++) {
      total += orderApi.orderRequest.order.line_items[i].quantity;
    }
    return total;
  }
  var totalQuantity: number = addQuantity();

  const increaseQuantity = (product: any) => {
    for (var i = 0; i < orderApi.orderRequest.order.line_items.length; i++) {
      if (orderApi.orderRequest.order.line_items[i].variant_id === product.variant_id && totalQuantity < orderApi.maxQuantity) {
        orderApi.orderRequest.order.line_items[i].quantity++;
        break;
      }
    }
    setReload(!reload);
  }
  const decreaseQuantity = (product: any) => {
    for (var i = 0; i < orderApi.orderRequest.order.line_items.length; i++) {
      if (orderApi.orderRequest.order.line_items[i].variant_id === product.variant_id) {
        if (orderApi.orderRequest.order.line_items[i].quantity > 1)
          orderApi.orderRequest.order.line_items[i].quantity--;
        else if (orderApi.orderRequest.order.line_items[i].quantity === 1) {
          // remove if they set quantity to 0
          orderApi.orderRequest.order.line_items.splice(i, 1);;
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
      <Typography variant="subtitle2" style={{textAlign: 'left', fontWeight:'bolder'}}>
        All items in cart
      </Typography>
      <List disablePadding>
        {orderApi.orderRequest.order.line_items.map((product: any) => (
          <ListItem className={classes.listItem} key={product.variant_id}>
            <ListItemText primary={product.title} />
            <Typography variant="body2">Qty: {product.quantity}</Typography>
            <IconButton color="primary" aria-label="add quantity" onClick={() => increaseQuantity(product)}> 
              <AddBoxIcon />
            </IconButton>
            <IconButton color="primary" aria-label="subtract quantity" onClick={() => decreaseQuantity(product)}>
              <RemoveIcon />
            </IconButton>
          </ListItem>
        ))}
        <ListItem className={classes.listItem}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" className={classes.total}>
            Free
          </Typography>
        </ListItem>
      </List>
      <Grid container spacing={2} style={{alignItems: 'left', justifyContent:'left'}}/*style={{alignItems: 'center', justifyContent: 'center'}}*/>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" gutterBottom className={classes.title}>
            Shipping
          </Typography>
          <Typography gutterBottom style={{textAlign: 'left'}}>{orderApi.orderRequest.order.customer.first_name + " " + orderApi.orderRequest.order.customer.last_name}</Typography>
          <Typography gutterBottom style={{textAlign: 'left'}}>{addresses.join(', ')}</Typography>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
ReviewComponent.propTypes = {
  orderData: PropTypes.any,
}