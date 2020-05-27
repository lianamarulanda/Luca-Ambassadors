import * as functions from 'firebase-functions';
var admin = require("firebase-admin");

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

var serviceAccount = require('../adminConfig.json');

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



