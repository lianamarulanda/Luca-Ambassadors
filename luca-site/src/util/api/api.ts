import axios from 'axios';

const firebaseConfig = require('../../config.json');

// Might need to make this more efficient later
var firebase = require("firebase");

export default class Api {
  private myDatabase: any;
  private authentication: any;
  private usersRef: any;
  private amRef: any;
  private mediaRef: any;
  private storage: any;
  private annRef: any;
  public userData: any;
  public dashboardData: any;
  


  constructor() {
    firebase.initializeApp(firebaseConfig);
    // database instance - specifies firestore service
    this.myDatabase = firebase.firestore();
    this.authentication = firebase.auth();
    this.storage = firebase.storage();
    this.usersRef = this.myDatabase.collection('users');
    this.amRef = this.myDatabase.collection('ambassadors');
    this.mediaRef = this.myDatabase.collection('media');
    this.annRef = this.myDatabase.collection('announcements');
    this.userData = {};
    this.dashboardData = {};
  }

  // True if user is logged in, false if user is not logged in
  public async isInitialized(): Promise<boolean> {
    return new Promise((resolve) => {
      this.authentication.onAuthStateChanged(async (user: any) => {
        if (user) {
          await this.loadUserData();
          resolve(true);
        } else {
          this.userData.email = '';
          resolve(false);
        }
      });
    });
  }

  public isLoggedIn(): boolean {
    if (this.userData.email && this.userData.email !== '') {
      return true;
    }
    return false;
  }

  public async sendPassReset(email: string): Promise<void> {
    return new Promise ((resolve, reject) => {
      this.authentication.sendPasswordResetEmail(email).then(function() {
        resolve();
      }).catch(function(error: any) {
        if (error.code === "auth/user-not-found")
          reject("There is no account tied to this email!");
        if (error.code === "auth/invalid-email")
          reject("Invalid email address!")
        reject("An error occurred!");
      });
    });
  }

  public async createUser(firstName: string, lastName: string, email: string, password: string, discountCode: string): Promise<string> {
    return new Promise ((resolve, reject) => {
      // first, check if valid discount code 
      this.checkDiscountCode(discountCode)
        .then((isValid: boolean) => {
          if (!isValid)
            reject("The ambassador code provided does not exist!");
          else {
            // create user in firebase authentication
            this.authentication.createUserWithEmailAndPassword(email, password)
              // create ambassador object in db
              .then(() => { // A
                this.amRef.add({ // B
                  discountCode: discountCode
                })
                  // after adding the ambassador object, create the user object
                  .then((ref: { id: any; }) => { // B
                    this.usersRef.add({ // C
                      firstName: firstName,
                      lastName: lastName,
                      email: email,
                      ambassadorID: ref.id
                    })
                      // after creating user object, send an email verification - needs a then/catch?
                      .then(() => { // C
                        this.sendEmailVerification();
                        resolve("");
                      })
                      .catch((error: any) => { // C
                        reject("An error has occurred!");
                      });                          
                  })
                  .catch((error: any) => { // B
                    reject("An error has occurred!");
                  });
              })
              // catch firebase authentication user creation errors
              .catch(function(error: any) { // A
                if (error.code === "auth/weak-password")
                  reject("The passsword is too weak.");
                if (error.code === "auth/email-already-in-use")
                  reject("The email is already in use.");
                if (error.code === "auth/invalid-email")
                  reject("The email is invalid.");
                reject("An error has occurred!");
              });
          }
        })
        .catch((error: any) => {
          if (error === "already-in-use") {
            reject("The ambassador code is already in use!")
          }
          reject("An error has occurred!");
        });
    });
  }

  public async checkDiscountCode(discountCode: string) : Promise<boolean> {
    return new Promise((resolve, reject) => {
      var request = {
        "title": discountCode
      }
      axios.post('https://us-central1-luca-ambassadors.cloudfunctions.net/getDiscountCodes', request)
      .then((response: any) => {
        if (response.data) {
          // check if already in use
          this.amRef.get().then(function(snapshot: any) {
            snapshot.forEach(function(doc: any) {
              if (doc.data().discountCode.toLowerCase() === discountCode.toLowerCase()) {
                reject("already-in-use");
              }
            })
            resolve(true);
          })
          .catch((error: any) => {
            reject(error);
          })
        }
        else
          resolve(false);
      })
      .catch((error: any) => {
        reject(error);
      });
    })
  }

  public async sendEmailVerification(): Promise<void> {
    return new Promise((resolve, reject) => {
      var user = firebase.auth().currentUser;
      user.sendEmailVerification().then(function() {
        resolve();
      }).catch(function(error: any) {
        reject();
      });
    })
  }

  public async loginUser(email: string, password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // firebase authentication login
      this.authentication.signInWithEmailAndPassword(email, password)
        .then(async (user: any) => {
          await this.loadUserData();
          resolve("");
        })
        // handle login errors
        .catch(function(error: any) {
          reject("Invalid email and/or password!")
        });
    })
  }

  public async logout(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.authentication.signOut().then(function() {
        resolve();
      }).catch(function(error: any) {
        // catch error with signing out
        reject();
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
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((error: any) => {
          reject("An error occurred!");
        });
    })
  }

  public getMonthCreated(): any {
    var dateString = this.authentication.currentUser.metadata.creationTime;
    var date = new Date(dateString);
    return date.getMonth();
  }

  public checkEmailVerification(): boolean {
    return this.authentication.currentUser.emailVerified;
  }

  // function to load everything we need about a user -> their name, email, and discount code
  public async loadUserData(): Promise<void> {
    return new Promise((resolve, reject) => {
      // get current logged in user, then query in db
      var user = this.authentication.currentUser;
      this.usersRef.where('email', '==', user.email).get()
        .then((snapshot: any) => {
          if (snapshot.empty) {
            reject();
          } else {
            snapshot.forEach((doc: any) => {
              // load user related data
              this.userData.firstName = doc.data().firstName;
              this.userData.lastName = doc.data().lastName;
              this.userData.email = doc.data().email;
              // query ambassador db to get discount code
              this.amRef.doc(doc.data().ambassadorID).get()
                .then((doc: any) => {
                  if (!doc.exists) {
                    reject();
                  } else {
                    this.userData.discountCode = doc.data().discountCode;
                    resolve();
                  }
                })
                .catch((err: any) => {
                  reject(err);
                });
            })
          }
        })
        .catch((error: any) => {
          reject(error);
        });
    })
  }

  public async loadDashboardData(): Promise<void> {
    return new Promise((resolve, reject) => {
      // if the class dashboard data object is empty, then load it
      if (Object.keys(this.dashboardData).length === 0) {
        this.getOrders(this.userData.discountCode)
          // then, get the actual code data
          .then((orders: []) => {
            this.getCodeData(orders);
            resolve();
          })
          // error with getting the associated orders
          .catch((error: any) => {
            reject(error);
          });
      } else {
        resolve();
      }
    })
  }

  public async getOrders(discountCode: string): Promise<[]> {
    return new Promise((resolve, reject) => {
      // local array to store all the orders filtered by user discount code - should i do this in the cloud function instead?
      var codeOrders: any = [];
      // array to store the orders that the user has made
      var userOrders = [] as object[];

      axios.post('https://us-central1-luca-ambassadors.cloudfunctions.net/getOrders')
      .then((response: any) => {
        response.data.forEach((order: any) => {
          if (order.discount_codes[0].code.toLowerCase() === discountCode.toLowerCase())
            codeOrders.push(order);
          if (order.customer !== undefined && order.customer.email !== null && order.customer.email === this.authentication.currentUser.email) {
            var date = new Date(order.created_at);
            userOrders.push({
              id: order.id,
              date: date.toUTCString(),
              number: order.name
            })
          }
        })
        this.dashboardData.userOrders = userOrders;
        resolve(codeOrders);
      })
      .catch((error: any) => {
        reject(error);
      });
    });
  }

  public getCodeData(codeOrders: []): void {
    var monthlyCommissions: number[] = [];
    var totalSales = 0;
    var productMap = new Map();

    codeOrders.forEach((order: any) => {
      // accumulate the subtotal prices to see how much revenue was brought in
      totalSales += parseFloat(order.subtotal_price);

      // handle monthly commissions
      var date = new Date(order.created_at);
      var currDate = new Date();
      if (date.getFullYear() === currDate.getFullYear()) {
        // .getMonth will return actual month - 1, which fits our indexes 
        if (typeof monthlyCommissions[date.getMonth()] === 'undefined') {
          monthlyCommissions[date.getMonth()] = 0;
        } 
        monthlyCommissions[date.getMonth()] += (.20 * parseFloat(order.subtotal_price));
      }
      // handle product mapping
      order.line_items.forEach((product: any) =>{
        if (productMap.has(product.title)) {
          productMap.set(product.title, productMap.get(product.title) + product.quantity);
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
    // set dashboardData fields
    this.dashboardData.totalSales = totalSales;
    this.dashboardData.totalCheckouts = codeOrders.length;
    this.dashboardData.totalCommissions = (.20 * totalSales);
    this.dashboardData.monthlyCommissions = monthlyCommissions;
    this.dashboardData.productMap = sortedProducts;
  }

  public async updatePassword(oldPassword: string, newPassword: string, confirmPassword: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (newPassword !== confirmPassword) {
        reject("Passwords are not equal!");
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
          resolve("Password updated successfully!");
        }).catch((err: any) => {
          // an error happened w/update password
          if (err.code === "auth/weak-password")
            reject("Password is not strong enough!")
          reject("An error has occurred.");
        });

      }).catch(function(error: any) {
        // An error happened w/reauthentication- perhaps old password is wrong
        if (error.code === "auth/wrong-password")
          reject("Invalid old password!");
        reject("An error has occurred.")
      });
    });
  }

  public async updateEmail(newEmail: string, confirmEmail: string, password: string) : Promise<string> {
    return new Promise((resolve, reject) => {
      if (confirmEmail !== newEmail) {
        reject("Emails not equal!");
        return;
      }

      // include check to see if email already equals curr email? 
      
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
                reject("An error has occurred.");
                // do i need to return here?
              }
            
              snapshot.forEach(async (doc : any) => {
                // do i need a .then() / .catch() here?
                await this.usersRef.doc(doc.id).update({email: newEmail});
                await this.loadUserData();
                resolve(`Successfully updated email! Please check your inbox to verify ${newEmail}`);
                this.sendEmailVerification();
              });
            })
            .catch((err: any) => {
              // Error happened w database update
              reject("An error has occurred.");
            });

        }).catch(function(error: any) {
          // An error happened w/updating email in authentication
          if (error.code === "auth/invalid-email")
            reject("Invalid email!");
          if (error.code === "auth/email-already-in-use")
            reject("Email already in use!");
          reject("An error has occurred.")
        });

      }).catch(function(error: any) {
        // An error happened w/reauthenticating - perhaps pass is wrong
          if (error.code === "auth/wrong-password")
          reject("Invalid password!");
        reject("An error has occurred.")
      });
    });
  }

  public async updatePersonalInfo(firstName: string, lastName: string, amCode: string, password: string): Promise<string> {
    return new Promise(async (resolve, reject) => {

      if (firstName === "" && lastName === "" && amCode === "") {
        reject("Please fill out at least one of the fields!")
      }

      var user = this.authentication.currentUser;
      var credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        password
      );

      // re-authenticate user using given password
      user.reauthenticateWithCredential(credential).then(async () => {
        // query user in database baed on the current logged in user email 
        this.usersRef.where('email', '==', user.email).get()
          .then((snapshot: any) => {
            if (snapshot.empty) {
              reject("An error has occurred.");
              return;
            } snapshot.forEach(async (doc : any) => {
              // update database for filled in fields
              if (firstName !== "") {
                // update firstName - do i need to await?
                this.usersRef.doc(doc.id).update({firstName: firstName});
              }
              if (lastName !== "") {
                // update lastName - await?
                this.usersRef.doc(doc.id).update({lastName: lastName});
              }
              if (amCode !== "") {
                // update ambassador code - await?
                this.amRef.doc(doc.data().ambassadorID).update({discountCode: amCode});
              }
              await this.loadUserData();
              resolve("Update successful!");
            });
          }).catch((err: any) => {
            // Error happened w database query
            reject("An error has occurred.");
            return;
          });
      }).catch(function(error: any) {
        // error occured w/reauthentication
        if (error.code === "auth/wrong-password")
          reject("Invalid password!");
        reject("An error has occurred.")
      }); 
    });
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
      axios.post('https://us-central1-luca-ambassadors.cloudfunctions.net/createOrder', orderRequest)
      .then((response: any) => {
        resolve(response.data.order.order_number);
      })
      .catch((error: any) => {
        reject(error);
      })
    });
  }

  public async uploadPhoto(picture: any): Promise<string> {
    return new Promise((resolve, reject) => {

      console.log(picture);

      if (picture.title === ""){
        reject("Please give the image a title!");
      }

      if (picture.pictureName === "") {
        console.log("I got to empty picture");
        reject("Please upload an image!");
      }

      var imageRef = this.storage.ref().child(picture.pictureName);
      imageRef.put(picture.picture)
        .then(async (snapshot: any) => {
          console.log(snapshot);
          snapshot.ref.getDownloadURL()
            .then((url: string) => {
              this.mediaRef.doc(picture.pictureName).set({
                url: url,
                title: picture.title
              })
                .then(() => {
                  resolve("Image successfully uploaded!");
                })
                .catch((error: any) => {
                  reject("An error occurred!");
                })
            })
            .catch((error: any) => {
              reject("An error occurred!");
            })
        })
        .catch((err: any) => {
          reject("An error occurred!");
        })
    })
  }

  public deletePhoto(picture: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.storage.ref().child(picture.pictureName).delete().then(() => {
        // File deleted successfully in storage, now delete in database
        this.mediaRef.doc(picture.pictureName).delete().then(function() {
          resolve();
        }).catch(function(error: any) {
            reject("An error occurred!");
        });
      }).catch(function(error: any) {
        reject("An error occurred!");
      });
    })
  }

  public async loadAllPhotos(): Promise<object[]> {
    return new Promise((resolve, reject) => {
      var images = [] as object[];

      this.mediaRef.get().then(function(querySnapshot: any) {
        querySnapshot.forEach(function(image: any) {
          images.push({
            title: image.data().title,
            url: image.data().url,
            name: image.id,
          })
        });
        console.log(images);
        resolve(images);
      })
        .catch((error: any) => {
          reject("An error occurred!");
        })
    })
  }
}

