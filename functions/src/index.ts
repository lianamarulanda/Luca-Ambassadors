import * as functions from 'firebase-functions';
var admin = require("firebase-admin");
import axios from 'axios';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

var serviceAccount = require('../adminConfig.json');
var shopify = require('../shopifyConfig.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://luca-ambassadors.firebaseio.com"
});

const whitelist = [
  'http://localhost:3000',
  'https://luca-ambassadors.web.app',
];

// request parameter is a json object
export const addAdminRole = functions.https.onRequest((request, response) => {

  admin.auth().getUserByEmail(request.body.email)
    .then((user: any) => admin.auth().setCustomUserClaims(user.uid, {
      admin: true,
    }))
    .then(() => {
      response.status(200).send("Successfully set admin to true")
    })
    .catch((err: any) => response.status(400).send(err));

});

export const getOrders = functions.https.onRequest((request, response) => {
  const origin = request.headers.origin as string;
  if (whitelist.indexOf(origin) > -1) {
    response.set('Access-Control-Allow-Origin', origin);
  }

  if (request.method === 'OPTIONS') {
    response.set('Access-Control-Allow-Methods', 'POST')
      .set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      .status(200)
      .send();
  } else {

    var orders = {
      codeOrders: [] as object[],
      userOrders: [] as object[],
    }

    axios.get('https://' + shopify.apiKey + ':' + shopify.apiPass + '@luca-bracelets.myshopify.com/admin/api/2020-04/orders.json?limit=250')
      .then(async result => {
        // get all results that have a discount code applied
        result.data.orders.forEach((order: any) => {
          if (order.discount_codes.length !== 0 && order.discount_codes[0].code.toLowerCase() === request.body.discountCode.toLowerCase())
            orders.codeOrders.push(order);
          if (order.customer !== undefined && order.customer.email !== null && order.customer.email === request.body.email) {
            var date = new Date(order.created_at);
            orders.userOrders.push({
              id: order.id,
              date: date.toUTCString(),
              number: order.name,
            });
          }
        })

        var url = helper(result.headers.link);
        while (url !== "") {
          var nextOrders: any = await axios.get('https://' + shopify.apiKey + ':' + shopify.apiPass + '@' + url);
          nextOrders.data.orders.forEach((order: any) => {
            if (order.discount_codes.length !== 0 && order.discount_codes[0].code.toLowerCase() === request.body.discountCode.toLowerCase())
              orders.codeOrders.push(order);
            if (order.customer !== undefined && order.customer.email !== null && order.customer.email === request.body.email)
              orders.userOrders.push(order);
          })
          url = helper(nextOrders.headers.link);
        }
        response.status(200).send(orders);
      })
      .catch((err: string) => {
        response.status(200).send(err);
      });
  }
});

export const createOrder = functions.https.onRequest((request, response) => {
  const origin = request.headers.origin as string;
  if (whitelist.indexOf(origin) > -1) {
    response.set('Access-Control-Allow-Origin', origin);
  }

  if (request.method === 'OPTIONS') {
    response.set('Access-Control-Allow-Methods', 'POST')
      .set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      .status(200)
      .send();
  } else {

    axios.post('https://' + shopify.apiKey + ':' + shopify.apiPass + '@luca-bracelets.myshopify.com/admin/api/2020-04/orders.json', request.body)
      .then(result => {
        response.status(200).send(result.data);
      })
      .catch((err: string) => {
        response.status(400).send(err);
      });
  }
});

export const getProducts = functions.https.onRequest((request, response) => {
  var allProducts = [] as object[];
  axios.get('https://' + shopify.apiKey + ':' + shopify.apiPass + '@luca-bracelets.myshopify.com/admin/api/2020-04/products.json?limit=250')
    .then(async (result: any) => {
      result.data.products.forEach((product: any) => {
        if (product.variants.length > 1) {
          for (var i = 0; i < product.variants.length; i++) {
            if (product.variants[i].inventory_quantity !== 0 && product.image !== null) {
              allProducts.push(product);
              break;
            }
          }
        } else if (product.variants[0].inventory_quantity !== 0 && product.image !== null) {
          allProducts.push(product);
        }
      })
      /*
      helper ->
        input result.headers.link
        output: the "next" link if its there, else, empty
      */
      var url = helper(result.headers.link);
      while (url !== "") {
        var nextProducts: any = await axios.get('https://' + shopify.apiKey + ':' + shopify.apiPass + '@' + url);
        nextProducts.data.products.forEach((product: any) => {
          if (product.variants.length > 1) {
            for (var i = 0; i < product.variants.length; i++) {
              if (product.variants[i].inventory_quantity !== 0 && product.image !== null) {
                allProducts.push(product);
                break;
              }
            }
          } else if (product.variants[0].inventory_quantity !== 0 && product.image !== null) {
            allProducts.push(product);
          }
        })

        url = helper(nextProducts.headers.link);
      }
      response.set('Access-Control-Allow-Origin', '*').status(200).send(allProducts);
    })
});

export const getDiscountCodes = functions.https.onRequest((request, response) => {
  const origin = request.headers.origin as string;
  if (whitelist.indexOf(origin) > -1) {
    response.set('Access-Control-Allow-Origin', origin);
  }

  if (request.method === 'OPTIONS') {
    response.set('Access-Control-Allow-Methods', 'POST')
      .set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      .status(200)
      .send();
  } else {
    axios.get('https://' + shopify.apiKey + ':' + shopify.apiPass + `@luca-bracelets.myshopify.com/admin/api/2020-04/discount_codes/lookup.json?code=${request.body.title}`)
      .then((result: any) => {
        if (result.status === 200) {
          response.status(200).send(true);
        }
      })
      .catch((err: any) => {
        if (err.response.statusText === 'Not Found')
          response.status(200).send(false);
        else
          response.status(400).send(err);
      });
  }
});

function helper(inputString: string): string {

  if (inputString === undefined)
    return "";

  if (inputString.includes(`rel="next"`)) {
    // split by comma b/c , indicates split between next/prev
    var linkArr = inputString.split(',');
    if (!inputString.includes(`rel="previous"`))
      var nextString = linkArr[0];
    else
      var nextString = linkArr[1];
    // split by semi colon to remove rel={next}
    linkArr = nextString.split(';');
    nextString = linkArr[0];
    nextString = nextString.trim();
    // remove < and >
    nextString = nextString.slice(9, nextString.length - 1);

    return nextString;
  } else {
    return "";
  }
}


