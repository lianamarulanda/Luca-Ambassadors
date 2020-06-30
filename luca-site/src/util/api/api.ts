import axios from 'axios';
import orders from '../../orders.json';
import { promises } from 'fs';
import { configure } from '@testing-library/react';

const firebaseConfig = require('../../config.json');
const shopifyConfig = require('../../shopifyConfig.json');

// Might need to make this more efficient later
var firebase = require("firebase");

export default class Api {
  private myDatabase: any;
  private authentication: any;
  private usersRef: any;
  private amRef: any;
  public userData: any;
  public codeData: object;
  public orderRequest: any;

  constructor() {
    firebase.initializeApp(firebaseConfig);
    // database instance - specifies firestore service
    this.myDatabase = firebase.firestore();
    this.authentication = firebase.auth();
    this.usersRef = this.myDatabase.collection('users');
    this.amRef = this.myDatabase.collection('ambassadors');
    this.codeData = {};
    this.userData = {};
    this.orderRequest = {
      "order": {

        "customer": {
          "first_name": "",
          "last_name": "",
          "email" : "",
        },
        "test": true,
        "email": "", 
        "send_receipt": true,
        "shipping_address": {
          "first_name": "",
          "last_name": "",
          "address1": "",
          "address2": "",
          "city": "",
          "province": "",
          "country": "",
          "zip": ""
        },
        "line_items": [],
      }
    };
  }

    // read from database
    public async getData(): Promise<void> {
        const usersRef = this.myDatabase.collection('users');

        usersRef.get()
            .then((snapshot: any[]) => {
                    snapshot.forEach(doc => {
                    console.log(doc.id, '=>', doc.data());
                });
            })
            .catch((err: any) => {
                console.log('Error getting documents', err);
            });
    }

    // delete from database 
    public async deleteData(): Promise<void> {
        // delete specific fields - in this case, age, from specified user given PK
        const usersRef = this.myDatabase.collection('users').doc('QfeWa5sMNdH4ii2fJt8V');

        var FieldValue = firebase.firestore.FieldValue;
        
        usersRef.update({
            age: FieldValue.delete()
        });
    }
    // delete entire user doc 
    public async deleteUser(docId: string): Promise<void> {
        // delete user w passed in docId string
        const usersRef = this.myDatabase.collection('users').doc(docId);
        usersRef.delete();
    }

  public async createUser(firstName: string, lastName: string, email: string, password: string, discountCode: string): Promise<void> {
    // create user in firebase authentication, only if email not already in use
    this.authentication.createUserWithEmailAndPassword(email, password)
      // if no error in authentication, create ambassador object in db 
      .then(() => {
        this.amRef.add({
          discountCode: discountCode
        })
          // after adding the ambassador object, create the user object
          .then((ref: { id: any; }) => {
            this.usersRef.add({
              firstName: firstName,
              lastName: lastName,
              email: email,
              ambassadorID: ref.id
            })
            .then((ref: { id: any; }) => {
              // debug print statement
              console.log('Added document with ID: ', ref.id);
            });                             
          });
      })
      // create user in the database 
      .catch(function(error: any) {
        // handle errors here
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage + " " + errorCode);
      });
  }

  public async loginUser(email: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      // firebase authentication
      this.authentication.signInWithEmailAndPassword(email, password)
        .then(async (user: any) => {
          console.log("logged in user: " + user);
          await this.loadUser(email);
          resolve(true);
        })
        .catch(function(error: any) {
            // handle errors here
            var errorCode = error.code;
            var errorMessage = error.message;
            // delete later - debug print
            console.log(errorMessage + " " + errorCode);
            resolve(false);
        });
    })
  }

  public async checkAdminStatus(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // authentication.currentUser seems to handle log in
      this.authentication.currentUser.getIdTokenResult()
        .then((idTokenResult: any) => {
          // Confirm the user is an Admin.
          if (!!idTokenResult.claims.admin) {
            console.log("is admin");
            resolve(true);
          } else {
            console.log("is not admin");
            resolve(false);
          }
        })
        .catch((error: any) => {
          console.log(error);
          reject(error);
        });
    })
  }
  // query user in the database
  public async loadUser(email: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // load user from database by querying email
      this.usersRef.where('email', '==', email).get()
        .then((snapshot: any) => {
          if (snapshot.empty) {
              console.log('No matching documents.'); // debug print
              resolve();
          } else {
            snapshot.forEach(async (doc: any) => {
              console.log(doc.id, '=>', doc.data());
              this.userData.firstName = doc.data().firstName;
              this.userData.lastName = doc.data().lastName;
              const discountCode = await this.getAmbassador(doc.data().ambassadorID);
              let array = await this.getOrders(discountCode);
              this.codeData = this.getCodeData(array);
              console.log(this.codeData); // debug
              console.log(this.userData); // debug
              resolve();
            });
          }
        })
        .catch((err: any) => {
          console.log('Error getting documents', err); // debug print
          reject();
        });
    })
  }

  public async getAmbassador(ambassadorID: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // query the ambassadors db for corresponding ambassador object
      let ambassador = this.amRef.doc(ambassadorID);

      ambassador.get()
        .then((doc: any) => {
          if (!doc.exists) {
            console.log('No such document!');
            reject();
          } else {
            resolve(doc.data().discountCode);
          }
        })
        .catch((err: any) => {
          console.log('Error getting document', err);
          reject();
        });
    });
  }

  public async updatePassword(oldPassword: string, newPassword: string, confirmPassword: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (newPassword !== confirmPassword) {
        resolve("passwords not equal");
        return;
      }
      var user = this.authentication.currentUser;
      var credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        oldPassword
      );

      // Prompt the user to re-provide their sign-in credentials
      user.reauthenticateWithCredential(credential).then(function() {
        // User re-authenticated.
        // can now update the password
        var newPass = newPassword;
    
        user.updatePassword(newPass).then(function() {
          // Update successful.
          resolve("success");
        }).catch((err: any) => {
          // error happened - perhaps new password isnt strong enough 
          // https://firebase.google.com/docs/auth/web/manage-users
          resolve(err.message);
        });

      }).catch(function(error: any) {
        // An error happened- perhaps old password is wrong
        resolve(error.message);
      });
    });
  }

  public async updateEmail(newEmail: string, confirmEmail: string, password: string) : Promise<string> {
    return new Promise((resolve, reject) => {
      if (confirmEmail !== newEmail) {
        resolve("emails not equal");
        return;
      }
      
      var user = this.authentication.currentUser;
      var oldEmail = user.email;
      var credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        password
      );

      // re-authenticate user 
      user.reauthenticateWithCredential(credential).then(() => {
        // User reauthenticated, can now update email
        // update in firebase authentication
        user.updateEmail(newEmail).then(() => {
          // successfully updated in authentication, now update in database
          this.usersRef.where('email', '==', oldEmail).get()
            .then((snapshot: any) => {
              if (snapshot.empty) {
                resolve("No matching documents");
                // do i need to return here?
              }
            
              snapshot.forEach((doc : any) => {
                this.usersRef.doc(doc.id).update({email: newEmail});
                resolve("success");
              });
            })
            .catch((err: any) => {
              // Error happened w database update
              // can also resolve error codes
              resolve(err.message);
            });

        }).catch(function(error: any) {
          // An error happened w/updating email in authentication
          resolve(error.message);
        });

      }).catch(function(error: any) {
        // An error happened w/reauthenticating - perhaps pass is wrong
        resolve(error.message);
      });
    });
  }

  public async updatePersonalInfo(firstName: string, lastName: string, amCode: string, password: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      var user = this.authentication.currentUser;
      var credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        password
      );

      // re-authenticate user using given password
      await user.reauthenticateWithCredential(credential).then(async () => {
        // query user in database baed on the current logged in user email 
        await this.usersRef.where('email', '==', user.email).get()
          .then((snapshot: any) => {
            if (snapshot.empty) {
              resolve("No matching email");
              return;
            } snapshot.forEach((doc : any) => {
              // update database for filled in fields
              if (firstName !== "") {
                // update firstName
                console.log("updating first name...");
                this.usersRef.doc(doc.id).update({firstName: firstName});
                // do i need to do a .catch after calling update function?
                console.log("updated first name");
              }
        
              if (lastName !== "") {
                // update lastName
                console.log("updating last name...");
                this.usersRef.doc(doc.id).update({lastName: lastName});
                console.log("updated last name");
              }
              if (amCode !== "") {
                // update ambassador code
                console.log("updating ambassador code...");
                this.amRef.doc(doc.data().ambassadorID).update({discountCode: amCode});
                console.log("updated ambassador code");
              }
              resolve("success");
            });
          }).catch((err: any) => {
            // Error happened w database query
            resolve(err.message);
            return;
          });
      }).catch(function(error: any) {
        // error occured w/reauthentication
        resolve(error.message);
        return;
      }); 
    });
  }

  // public saveAddress(address1: string, address2: string, city: string, state: string, country: string, zip: string): void
  // {
  //   // may need to add first and last name to address
  //   this.orderRequest.order.shipping_address.address1 = address1;
  //   this.orderRequest.order.shipping_address.address2 = address2;
  //   this.orderRequest.order.shipping_address.city = city;
  //   this.orderRequest.order.shipping_address.province = state;
  //   this.orderRequest.order.shipping_address.country = country;
  //   this.orderRequest.order.shipping_address.zip = zip;
  //   // debug
  //   console.log(this.orderRequest);
  // }

  // public submitOrder(): Promise<boolean> {
  //   return new Promise((resolve, reject) => {
  //     var email = this.authentication.currentUser.email;
  //     // fill remaining details
  //     this.orderRequest.order.email = email;
  //     this.orderRequest.order.customer.first_name = this.userData.firstName;
  //     this.orderRequest.order.customer.last_name = this.userData.lastName;
  //     this.orderRequest.order.customer.email = email;

  //     // test line items
  //     this.orderRequest.order.line_items.title = "Matteo Bracelet in Maroon";
  //     this.orderRequest.order.line_items.quantity = 1;
  //   });
  // }

  // may nt need to be async
  public async getOrders(discountCode: string): Promise<[]> {
    return new Promise((resolve, reject) => {
      // local array to store all the orders filtered by user discount code
      var codeOrders: any = [];

      orders.orders.forEach((order: any) => {
        // print only discount codes associated w/order
        if (order.discount_codes.length > 0)
          if (order.discount_codes[0].code.toLowerCase() === discountCode.toLowerCase())
            codeOrders.push(order);
      })
      // debug - print every item in codeOrders
      codeOrders.forEach((order: any) => {
        console.log(order.discount_codes[0].code);
      })
      resolve(codeOrders);
    });
  }

  public getCodeData(codeOrders: []): object {

    var monthlyCommissions: number[] = [];
    var codeData = {} as any;
    var totalSales = 0;
    let productMap = new Map();

    codeOrders.forEach((order: any) => {
      // DON'T FORGET TO CHECK FOR YEAR *see if the data should only be valid per year*
      // if this app only cares for yearly data, our orders api call can be just starting from current year 
      // accumulate the subtotal prices to see how much revenue was brought in
      totalSales += parseFloat(order.subtotal_price);

      // handle monthly commissions
      var date = new Date(order.created_at);
      // .getMonth will return actual month - 1, which fits our indexes 
      if (typeof monthlyCommissions[date.getMonth()] === 'undefined') {
        console.log("index is undefined!"); // debug
        monthlyCommissions[date.getMonth()] = 0;
      } 
      console.log("index contains: " + monthlyCommissions[date.getMonth()]); // debug
      monthlyCommissions[date.getMonth()] += (.20 * parseFloat(order.subtotal_price));

      // handle product mapping
      order.line_items.forEach((product: any) =>{
        if (productMap.has(product.title)) {
          productMap.set(product.title, productMap.get(product.title)+product.quantity);
        } else {
          productMap.set(product.title, product.quantity);
        }
      })
    })

    // clean up monthlyCommissions to replace undefined indexes w/0, and round defined elements 
    for (let i = 0; i < monthlyCommissions.length; i++) {
      if (typeof monthlyCommissions[i] === 'undefined') {
        monthlyCommissions[i] = 0;
      } else {
        monthlyCommissions[i] = parseFloat(monthlyCommissions[i].toFixed(2));
      }
    }

    // sort productMap by value -> so highest values (counts) go first 
    const sortedProducts= new Map(
      Array
        .from(productMap)
        .sort((a, b) => {
          // a[1], b[1] is the value of the map
          return b[1] - a[1];
        })
    )
    // set codeData fields
    codeData.totalSales = totalSales;
    codeData.totalCheckouts = codeOrders.length;
    codeData.totalCommissions = (.20 * totalSales);
    codeData.monthlyCommissions = monthlyCommissions;
    codeData.productMap = sortedProducts;
    return codeData;
  }

  public async getAllProducts(): Promise<object[]> {
    return new Promise((resolve, reject) => {
      var allProducts = [] as object[];

      axios.post('https://us-central1-luca-ambassadors.cloudfunctions.net/getProducts')
      .then((response: any) => {
        allProducts = response;
        resolve(allProducts);
      })
    });
  }
  
  public placeOrder(orderRequest: object): Promise<number> {
    return new Promise((resolve, reject) => {
      console.log("i got here");
      console.log(orderRequest);

      axios.post('https://us-central1-luca-ambassadors.cloudfunctions.net/createOrder', orderRequest)
      .then((response: any) => {
        console.log("i got here 2");
        resolve(response.data.order.id);
      })
    });
  }
}

