import axios from 'axios';
const firebaseConfig = require('../../config.json');

// Might need to make this more efficient later
var firebase = require("firebase");
var salesTiers = require('../../saleTiers.json');

export default class Api {
  private myDatabase: any;
  private authentication: any;
  private usersRef: any;
  private amRef: any;
  private mediaRef: any;
  private storage: any;
  private announcements: any;
  private bannerRef: any;
  public userData: any;
  public dashboardData: any;
  public ordersLoaded: boolean;

  constructor() {
    firebase.initializeApp(firebaseConfig);
    // database instance - specifies firestore service
    this.myDatabase = firebase.firestore();
    this.authentication = firebase.auth();
    this.storage = firebase.storage();
    this.usersRef = this.myDatabase.collection('users');
    this.amRef = this.myDatabase.collection('ambassadors');
    this.mediaRef = this.myDatabase.collection('media');
    this.announcements = this.myDatabase.collection('announcements');
    this.bannerRef = this.myDatabase.collection('banner');
    this.userData = {};
    this.dashboardData = {};
    this.ordersLoaded = false;
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

  public async getAuthToken(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.authentication.currentUser.getIdToken()
        .then((token: any) => {
          resolve(token);
        })
        .catch((error: any) => {
          reject(error);
        })
    })
  }

  public async sendPassReset(email: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.authentication.sendPasswordResetEmail(email).then(function () {
        resolve();
      }).catch(function (error: any) {
        if (error.code === "auth/user-not-found")
          reject("There is no account tied to this email!");
        else if (error.code === "auth/invalid-email")
          reject("Invalid email address!")
        else
          reject("An error occurred!");
      });
    });
  }

  public async createUser(firstName: string, lastName: string, email: string, password: string, discountCode: string, influencerCode: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // first, check if valid discount code 
      this.checkDiscountCode(discountCode)
        .then(() => {
          // create user in firebase authentication
          this.authentication.createUserWithEmailAndPassword(email, password)
            // create ambassador object in db
            .then(() => {
              this.amRef.add({
                discountCode: discountCode,
                giftClaimStatus: false,
                currTier: "0",
              })
                // after adding the ambassador object, create the user object
                .then((ref: { id: any; }) => {
                  var influencer = false;
                  if (influencerCode === 'LL4E')
                    influencer = true;

                  this.usersRef.add({ // C
                    firstName: firstName,
                    lastName: lastName,
                    email: email.toLowerCase(),
                    ambassadorID: ref.id,
                    influencer: influencer
                  })
                    // after creating user object, send an email verification
                    .then(() => {
                      this.sendEmailVerification();
                      resolve();
                    })
                    // error with creating user db object
                    .catch((error: any) => {
                      reject("An error has occurred!");
                    });
                })
                // error with creating ambassador db object
                .catch((error: any) => {
                  reject("An error has occurred!");
                });
            })
            // catch firebase authentication user creation errors
            .catch(function (error: any) {
              if (error.code === "auth/weak-password")
                reject("The passsword is too weak.");
              else if (error.code === "auth/email-already-in-use")
                reject("The email is already in use.");
              else if (error.code === "auth/invalid-email")
                reject("The email is invalid.");
              else
                reject("An error has occurred!");
            });
        })
        // handle error with discount code check
        .catch((error: any) => {
          if (error === "does-not-exist")
            reject("The ambassador code does not exist!");
          else if (error === "already-in-use")
            reject("The ambassador code is already in use!")
          else
            reject("An error has occurred!");
        });
    });
  }

  public async checkDiscountCode(discountCode: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      var request = {
        "title": discountCode
      }
      axios.post('https://us-central1-luca-ambassadors.cloudfunctions.net/getDiscountCodes', request)
        .then((response: any) => {
          if (response.data) {
            // check if already in use
            this.amRef.get().then(function (snapshot: any) {
              snapshot.forEach(function (doc: any) {
                if (doc.data().discountCode.toLowerCase() === discountCode.toLowerCase()) {
                  reject("already-in-use");
                }
              })
              resolve();
            })
              .catch((error: any) => {
                reject(error);
              })
          }
          else
            reject("does-not-exist");
        })
        .catch((error: any) => {
          reject(error);
        });
    })
  }

  public async sendEmailVerification(): Promise<void> {
    return new Promise((resolve, reject) => {
      var user = firebase.auth().currentUser;
      user.sendEmailVerification().then(function () {
        resolve();
      }).catch(function (error: any) {
        reject(error);
      });
    })
  }

  public async loginUser(email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // firebase authentication login
      this.authentication.signInWithEmailAndPassword(email, password)
        .then(async () => {
          this.loadUserData()
            .then(async() => {
              var userToken = await this.getAuthToken();
              resolve();
            })
            .catch(() => {
              reject("An error occurred!");
            })
        })
        // handle login errors
        .catch(function (error: any) {
          reject("Invalid email and/or password!")
        });
    })
  }

  public async logout(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.authentication.signOut().then(() => {
        this.userData = {};
        this.dashboardData = {};
        this.ordersLoaded = false;
        resolve();
      }).catch(function (error: any) {
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
    var currDate = new Date();

    if (date.getFullYear() < currDate.getFullYear())
      return 0; 
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
              this.userData.influencerStatus = doc.data().influencer;
              // query ambassador db to get discount code
              this.amRef.doc(doc.data().ambassadorID).get()
                .then((doc: any) => {
                  if (!doc.exists) {
                    reject();
                  } else {
                    this.userData.discountCode = doc.data().discountCode;
                    this.userData.giftClaimStatus = doc.data().giftClaimStatus;
                    this.userData.currTier = doc.data().currTier;
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

  // load the basic stats such as order count, products, etc
  public async loadDashboardData(): Promise<void> {
    return new Promise((resolve, reject) => {
      // if we have called already, don't call this func
      if (!this.ordersLoaded) {
        this.getOrders(this.userData.discountCode)
          .then(async(codeOrders: []) => {
            this.getCodeData(codeOrders);
            resolve();
          })
          // error w/getting associated orders
          .catch((error: any) => {
            reject(error);
          });
      } else {
        resolve();
      }
    })
  }

  public async getOrders(discountCode: string): Promise<[]> {
    return new Promise(async (resolve, reject) => {
      var userToken = await this.getAuthToken();
      var config = {
        headers: {
          "authorization": `Bearer ${userToken}`,
        }
      }
      var orders = {
        discountCode: discountCode,
        email: this.authentication.currentUser.email
      }
      axios.post('https://us-central1-luca-ambassadors.cloudfunctions.net/getOrders', orders, config)
        .then((response: any) => {
          this.dashboardData.userOrders = response.data.userOrders;
          this.ordersLoaded = true;
          resolve(response.data.codeOrders);
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
    var currDate = new Date();

    codeOrders.forEach((order: any) => {
      // accumulate the subtotal prices to see how much revenue was brought in
      totalSales += parseFloat(order.subtotal_price);

      // handle monthly commissions
      var date = new Date(order.created_at);
      if (date.getFullYear() === currDate.getFullYear()) {
        // .getMonth will return actual month - 1, which fits our indexes 
        if (typeof monthlyCommissions[date.getMonth()] === 'undefined') {
          monthlyCommissions[date.getMonth()] = 0;
        }
        monthlyCommissions[date.getMonth()] += (.20 * parseFloat(order.subtotal_price));
      }
      // handle product mapping
      order.line_items.forEach((product: any) => {
        if (productMap.has(product.title)) {
          productMap.set(product.title, productMap.get(product.title) + product.quantity);
        } else {
          productMap.set(product.title, product.quantity);
        }
      })
    })

    // clean up monthlyCommissions to replace undefined indexes w/0, and round defined elements 
    for (let i = 0; i <= currDate.getMonth(); i++) {
      if (typeof monthlyCommissions[i] === 'undefined') {
        monthlyCommissions[i] = 0;
      } else {
        monthlyCommissions[i] = parseFloat(monthlyCommissions[i].toFixed(2));
      }
    }

    // sort productMap by value -> so highest values (counts) go first 
    const sortedProducts = new Map(
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

  public async getBiMonthlyStatus(): Promise<boolean> {
    return new Promise ((resolve, reject) => {
      // if dashboard data is empty, load dashboard data
      if (Object.keys(this.dashboardData).length === 0) {
        this.loadDashboardData()
          .then(() => {
            var canOrder = this.getAppOrders();
            resolve(canOrder);
          })
          .catch((error: any) => {
            reject();
          })
      }
      else {
        var canOrder = this.getAppOrders();
        resolve(canOrder);
      }
    }) 
  }

  public getAppOrders(): boolean {
    var currDate = new Date();
    var limit = new Date();
    limit.setMonth(limit.getMonth() - 2);
    var appOrders = [];

    // go thru orders and see if last app order was placed at least 2 months ago
    for (var i = 0; i < this.dashboardData.userOrders.length; i++) {
      if (this.dashboardData.userOrders[i].appOrder) 
        appOrders.push(this.dashboardData.userOrders[i]);
    }

    if (appOrders.length > 0) {
      // sort by date
      appOrders.sort(function(a: any, b: any) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        // @ts-ignore
        return new Date(b.date) - new Date(a.date);
      });

      var latestDate = new Date(appOrders[0].date);
      latestDate.setHours(0,0,0,0);
      limit.setHours(0,0,0,0);

      if (latestDate <= limit) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  public getLastOrderDate(): string[] {

    var lastOrderDate = new Date(this.dashboardData.userOrders[0].date);
    var nextOrderDate = new Date(lastOrderDate);
    nextOrderDate.setMonth(lastOrderDate.getMonth() + 2);
    nextOrderDate.setHours(0,0,0,0);

    var dates = [] as string[];
    dates.push(lastOrderDate.toLocaleString());
    dates.push(nextOrderDate.toLocaleString());

    return dates;
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
      user.reauthenticateWithCredential(credential).then(function () {
        // User re-authenticated.
        // can now update the password
        var newPass = newPassword;

        user.updatePassword(newPass).then(function () {
          // Update successful.
          resolve("Password updated successfully!");
        }).catch((err: any) => {
          // an error happened w/update password
          if (err.code === "auth/weak-password")
            reject("Password is not strong enough!")
          else
            reject("An error has occurred.");
        });
      }).catch(function (error: any) {
        // An error happened w/reauthentication- perhaps old password is wrong
        if (error.code === "auth/wrong-password")
          reject("Invalid old password!");
        else
          reject("An error has occurred.")
      });
    });
  }

  public async updateEmail(newEmail: string, confirmEmail: string, password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (confirmEmail !== newEmail) {
        reject("Emails not equal!");
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
                reject("An error has occurred.");
                return;
              }
              snapshot.forEach(async (doc: any) => {
                this.usersRef.doc(doc.id).update({ email: newEmail })
                  .then(() => {
                    this.loadUserData()
                      .then(() => {
                        resolve(`Successfully updated email! Please check your inbox to verify ${newEmail}`);
                        this.sendEmailVerification();
                      })
                      .catch((error: any) => {
                        reject("An error has occurred.")
                      })
                  })
                  .catch((error: any) => {
                    reject("An error has occurred.")
                  })
              });
            })
            .catch((err: any) => {
              // Error happened w database query
              reject("An error has occurred.");
            });
        }).catch(function (error: any) {
          // An error happened w/updating email in authentication
          if (error.code === "auth/invalid-email")
            reject("Invalid email!");
          else if (error.code === "auth/email-already-in-use")
            reject("Email already in use!");
          else
            reject("An error has occurred.")
        });

      }).catch(function (error: any) {
        // An error happened w/reauthenticating
        if (error.code === "auth/wrong-password") {
          reject("Invalid password!");
          return;
        }
        reject("An error has occurred.")
      });
    });
  }

  public async updatePersonalInfo(firstName: string, lastName: string, amCode: string, password: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      var updatedUser = {} as any;

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
        // query user in database based on the current logged in user email 
        this.usersRef.where('email', '==', user.email).get()
          .then((snapshot: any) => {
            if (snapshot.empty) {
              reject("An error has occurred.");
              return;
            } snapshot.forEach(async (doc: any) => {
              updatedUser = doc.data();

              if (firstName !== "") {
                // update firstName
                updatedUser.firstName = firstName;
              }
              if (lastName !== "") {
                // update lastName
                updatedUser.lastName = lastName;
              }
              if (amCode !== "") {
                // update ambassador code
                this.checkDiscountCode(amCode)
                  .then(() => {
                    this.amRef.doc(doc.data().ambassadorID).update({ discountCode: amCode })
                      .then(() => {
                        this.usersRef.doc(doc.id).update(updatedUser)
                          .then(async () => {
                            await this.loadUserData();
                            resolve("Update successful!");
                          })
                          .catch((error: any) => {
                            reject("An error has occurred.");
                          })
                      })
                      .catch((error: any) => {
                        reject("An error has occurred.");
                      })
                  })
                  .catch((error: string) => {
                    if (error === "does-not-exist") {
                      reject("The ambassador code does not exist!");
                    }
                    else if (error === "already-in-use") {
                      reject("The ambassador code is already in use!")
                    }
                    else
                      reject("An error has occurred!");
                  })
              } else {
                this.usersRef.doc(doc.id).update(updatedUser)
                  .then(async () => {
                    await this.loadUserData();
                    resolve("Update successful!");
                  })
                  .catch((error: any) => {
                    reject("An error has occurred.");
                  })
              }
            });
          }).catch((err: any) => {
            // Error happened w user database query
            reject("An error has occurred.");
            return;
          });
      }).catch(function (error: any) {
        // error occured w/reauthentication
        if (error.code === "auth/wrong-password")
          reject("Invalid password!");
        reject("An error has occurred.")
      });
    });
  }

  public async getAllProducts(): Promise<object[]> {
    return new Promise(async(resolve, reject) => {
      var userToken = await this.getAuthToken();
      var config = {
        headers: {
          "authorization": `Bearer ${userToken}`,
        }
      }
      var allProducts = [] as object[];
      var request = {
        "influencerStatus": this.userData.influencerStatus 
      }

      axios.post('https://us-central1-luca-ambassadors.cloudfunctions.net/getProducts', request, config)
        .then((response: any) => {
          allProducts = response;
          resolve(allProducts);
        })
        .catch((error: any) => {
          reject(error);
        })
    });
  }

  public placeOrder(orderRequest: object): Promise<number> {
    return new Promise(async(resolve, reject) => {
      var userToken = await this.getAuthToken();
      var config = {
        headers: {
          "authorization": `Bearer ${userToken}`,
        }
      }
      axios.post('https://us-central1-luca-ambassadors.cloudfunctions.net/createOrder', orderRequest, config)
        .then((response: any) => {
          resolve(response.data.order.order_number);
        })
        .catch((error: any) => {
          reject(error);
        })
    });
  }

  public getAllCodes(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      var codes = [] as string[];
      this.amRef.get()
        .then((querySnapshot: any) => {
          querySnapshot.forEach((doc: any) => {
            codes.push(doc.data().discountCode);
          })
          resolve(codes);
        })
        .catch((error: any) => {
          reject(error);
        })
    });
  }

  public async uploadPhoto(picture: any): Promise<string> {
    return new Promise((resolve, reject) => {
      if (picture.title === "") {
        reject("Please give the image a title!");
        return;
      }
      if (picture.pictureName === "") {
        reject("Please upload an image!");
        return;
      }

      var currDate = new Date();

      var imageRef = this.storage.ref().child(picture.pictureName);
      imageRef.put(picture.picture)
        .then(async (snapshot: any) => {
          snapshot.ref.getDownloadURL()
            .then((url: string) => {
              this.mediaRef.doc(picture.pictureName).set({
                url: url,
                title: picture.title,
                date: currDate
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
        this.mediaRef.doc(picture.pictureName).delete().then(function () {
          resolve();
        }).catch(function (error: any) {
          reject("An error occurred!");
        });
      }).catch(function (error: any) {
        reject("An error occurred!");
      });
    })
  }

  public async loadAllPhotos(): Promise<object[]> {
    return new Promise((resolve, reject) => {
      var images = [] as object[];
      this.mediaRef.orderBy("date", "desc").get().then(function (querySnapshot: any) {
        querySnapshot.forEach(function (image: any) {
          images.push({
            title: image.data().title,
            url: image.data().url,
            name: image.id,
          })
        });
        resolve(images);
      })
        .catch((error: any) => {
          reject("An error occurred!");
        })
    })
  }

  public async createAnnouncement(announcement: any): Promise<string> {
    return new Promise((resolve, reject) => {
      if (announcement.message === "") {
        reject("Please type in an announcement message!");
      } else {
        var currDate = new Date();
        this.announcements.add({
          description: announcement.message,
          date: currDate.toLocaleString()
        })
          .then(() => {
            resolve("Announcement successfully created! Refresh to view.");
          })
          .catch((error: any) => {
            reject("An error occurred!");
          })
      }
    })
  }

  public async loadAnnouncements(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.dashboardData.announcements === undefined) {
        var announcements = [] as object[];
        this.announcements.orderBy("date", "desc").get().then((querySnapshot: any) => {
          querySnapshot.forEach(function (announcement: any) {
            announcements.push({
              description: announcement.data().description,
              date: announcement.data().date,
            })
          });
          this.dashboardData.announcements = announcements;
          resolve();
        })
          .catch((error: any) => {
            reject("An error occurred!");
          })
      } else {
        resolve();
      }
    })
  }

  public async getBanner(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.bannerRef.doc("currentBanner").get()
        .then((banner: any) => {
          resolve(banner.data().description);
        })
        .catch((error: any) => {
          reject();
        })
    })
  }

  public async createBanner(banner: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.bannerRef.doc("currentBanner").set({
        description: banner
      })
        .then(() => {
          resolve("Banner successfully updated!");
        })
        .catch((error: any) => {
          reject("An error occurred with updating the announcement.");
        })
    })
  }

  public async deleteAnnouncement(announcement: any): Promise<string> {
    return new Promise((resolve, reject) => {
      this.announcements.where('date', '==', announcement.date).get()
        .then((querySnapshot: any) => {
          querySnapshot.forEach((announcement: any) => {
            this.announcements.doc(announcement.id).delete()
              .then(() => {
                resolve("Announcement successfully deleted!");
              })
              .catch((error: any) => {
                reject("An error occurred with deleting the announcement.");
              })
          })
        })
        .catch((error: any) => {
          reject("An error occurred with deleting the announcement.");
        })
    });
  }

  public async deleteBanner(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.bannerRef.doc("currentBanner").delete()
        .then(() => {
          resolve("Banner successfully deleted!");
        })
        .catch((error: any) => {
          reject("An error occurred with deleting the announcement.");
        })
    })
  }

  public async setGiftClaimStatus(newStatus: boolean, newTier: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.amRef.where("discountCode", "==", this.userData.discountCode).get()
        .then((querySnapshot: any) => {
          querySnapshot.forEach((doc: any) => {
            this.amRef.doc(doc.id).update({
              giftClaimStatus: newStatus,
              currTier: newTier,
            })
              .then(() => {
                this.userData.giftClaimStatus = newStatus;
                this.userData.currTier = newTier;
                resolve();
              })
              .catch((error: any) => {
                reject(error);
              })
          })
        })
        .catch((error: any) => {
          reject(error);
        })
    })
  }

  public async getGiftClaimStatus(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.loadDashboardData()
        .then(() => {
          if (!this.userData.giftClaimStatus) {
            var totalCheckouts = this.dashboardData.totalCheckouts % 50;
            var currTier = this.userData.currTier;
            var milestoneReached = false;

            // check if user has reached a milestone
            for (var i = 0; i < Object.keys(salesTiers).length; i++) {
              var num = i.toString();
              if (totalCheckouts >= salesTiers[num]) {
                if (currTier < Object.keys(salesTiers)[i]) {
                  // milestone has been reached
                  milestoneReached = true;
                  break;
                }
              }
            }

            if (milestoneReached) {
              this.setGiftClaimStatus(true, currTier)
                .then(() => {
                  this.userData.giftClaimStatus = true;
                  resolve(true);
                })
                .catch((error: any) => {
                  reject(error);
                })
            }
            else {
              resolve(false);
            }
          }
          else {
            resolve(true);
          }
        })
        .catch((error: any) => {
          reject(error);
        })
    })
  }

  // admin functions
  public getDataForCode(discountCode: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getOrders(discountCode)
        .then((codeOrders: []) => {
          this.getCodeData(codeOrders);
          resolve();
        })
        .catch((error: any) => {
          reject(error);
        })
    })
  }

  public addAdminUser(email: string): Promise<boolean> {
    return new Promise(async(resolve, reject) => {
      // check if the email is valid
      this.usersRef.where("email", "==", email).get()
        .then(async(snapshot: any) => {
          if (snapshot.empty) {
            reject(false);
            return;
          } else {
            var userToken = await this.getAuthToken();
            var config = {
              headers: {
                "authorization": `Bearer ${userToken}`,
              }
            }
            var request = {
              "email": email,
            }
            axios.post('https://us-central1-luca-ambassadors.cloudfunctions.net/addAdminRole', request, config)
              .then(() => {
                resolve(true);
              })
              .catch((error: any) => {
                reject(error);
              })
          }   
        })
        // error w finding the email in the db
        .catch((error: any) => {
          reject(error);
        })
    })
  }
}

