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
  //console.log(shopify.apiKey);
  //console.log(shopify.apiPass);
  
  axios.get('https://' + shopify.apiKey + ':' + shopify.apiPass + '@luca-bracelets.myshopify.com/admin/api/2020-04/orders.json')
  .then(result => {
    response.status(200).send(result.data);
  })
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
    // // test creating an order
    // const requestObject = {
    //   "order": {
    //     "customer": {
    //       // including first/last name optional - will tie email to existing customer regardless
    //       // but better to include first/last name in case new customer
    //       "email": "lianamarulanda@gmail.com",
    //     },
    //     "email": "lianamarulanda@gmail.com",
    //     "send_receipt": true,
    //     "test": true,
    //     "line_items": [
    //       {
    //         "variant_id": 29764331176039,
    //         "quantity": 1
    //       }
    //     ]z
    //   }
    // };

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
    console.log(result);
    allProducts = result.data.products;

    /*
    helper ->
      input result.headers.link
      output: the "next" link if its there, else, empty
    */
   var url = helper(result.headers.link);
   while (url !== "") {
    var nextProducts: any = await axios.get('https://' + shopify.apiKey + ':' + shopify.apiPass + '@' + url);
    console.log(nextProducts.body);
    allProducts = allProducts.concat(nextProducts.data.products);
    url = helper(nextProducts.headers.link);
   }

    response.set('Access-Control-Allow-Origin', '*').status(200).send(allProducts);
  }) 
});

function helper(inputString: string): string {
  
  if (inputString === undefined)
    return "";

  if (inputString.includes(`rel="next"`)) {
      // split by comma b/c , indicates split between next/prev
      var linkArr = inputString.split(',');
      var nextString = linkArr[0];
      // split by semi colon to remove rel={next}
      linkArr = nextString.split(';');
      nextString = linkArr[0];
      // remove < and >
      nextString = nextString.slice(9, nextString.length-1);

      return nextString;
    } else {
      return "";
    }
}


