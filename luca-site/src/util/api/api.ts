// import { Database } from 'firebase';

import { getHeapSnapshot } from "v8";

const firebaseConfig = require('../../config.json');

// Might need to make this more efficient later
var firebase = require("firebase");

export default class Api {
    private myDatabase: any;

    constructor() {
        firebase.initializeApp(firebaseConfig);
        // database instance - specifies firestore service
        this.myDatabase = firebase.firestore();
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
        // create a user in the database w/passed in parameters
        const usersRef = this.myDatabase.collection('users');

        usersRef.add({
                firstName: firstName,
                lastName: lastName,
                email: email
            }).then((ref: { id: any; }) => {
            // debug print statement
            console.log('Added document with ID: ', ref.id);
          });
    }
    
    public async loginUser(email: string, password: string)
    {
        const usersRef = this.myDatabase.collection('users');
        usersRef.where('email', '==', email).get()
            .then((snapshot: any) => {
                if (snapshot.empty) {
                    console.log('No matching documents.'); // debug print
                }
                else
                {
                    console.log(email); // debug print email
                }
            })
            .catch((err: any) => {
                console.log('Error getting documents', err); // debug print
            });
    }
}

