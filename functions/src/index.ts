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
// test
export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

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
    // console.log(response.data);
    response.status(200).send(result.data);
  })
});



