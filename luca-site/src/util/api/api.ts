// import { Database } from 'firebase';

import { getHeapSnapshot } from "v8";

const firebaseConfig = require('../../config.json');

// Might need to make this more efficient later
var firebase = require("firebase");

export default class Api {
  private myDatabase: any;
  private authentication: any;
  private usersRef: any;
  private amRef: any;

  constructor() {
    firebase.initializeApp(firebaseConfig);
    // database instance - specifies firestore service
    this.myDatabase = firebase.firestore();
    this.authentication = firebase.auth();
    this.usersRef = this.myDatabase.collection('users');
    this.amRef = this.myDatabase.collection('ambassadors');
  }

    // write to database
    public async writeData(): Promise<void> {
        const usersRef = this.myDatabase.collection('users');

        usersRef.add({
                age: 59,
                firstName: 'Julio',
                lastName: 'Marulanda'
            }).then((ref: { id: any; }) => {
            console.log('Added document with ID: ', ref.id);
          });
    }

    // update database - test updating user / querying email
    public async updateEmail() : Promise<void> {
        const usersRef = this.myDatabase.collection('users');
        var query = usersRef.where('email', '==', 'ainovamc@gmail.com').get()
            .then((snapshot: any) => {
                if (snapshot.empty) {
                    console.log('No matching documents.');
                }
             
             snapshot.forEach((doc : any) => {
                    console.log(doc.id, '=>', doc.data());
                    console.log('updating data...');
                    // update the users that meet the query
                    usersRef.doc(doc.id).update({email: 'ainovamc2@gmail.com'});
                });
            })
            .catch((err: any) => {
                console.log('Error getting documents', err);
            });
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



  public async createUser(firstName: string, lastName: string, email: string, password: string): Promise<void> {

    // create user in firebase authentication, only if email not already in use
    this.authentication.createUserWithEmailAndPassword(email, password)
      // if no error in authentication, create ambassador object in db 
      .then(() => {
        this.amRef.add({
          discountCodes: [123] // sample discount code for now
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
    
  public async loginUser(email: string, password: string): Promise<void> {
    // firebase authentication
    this.authentication.signInWithEmailAndPassword(email, password)
      .catch(function(error: any) {
          // handle errors here
          var errorCode = error.code;
          var errorMessage = error.message;
          // delete later - debug print
          console.log(errorMessage + " " + errorCode);
      });
  }

  public async loadUser(email: string) {
    // load user from database by querying email
    
    this.usersRef.where('email', '==', email).get()
      .then((snapshot: any) => {
        if (snapshot.empty) {
            console.log('No matching documents.'); // debug print
        } else {
            console.log(email); // debug print email
        }
      })
      .catch((err: any) => {
        console.log('Error getting documents', err); // debug print
      });
  }



}

