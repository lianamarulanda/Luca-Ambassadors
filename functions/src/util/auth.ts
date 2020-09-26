import { auth } from 'firebase-admin';

type Auth = auth.Auth;

export async function isAdmin(as: Auth, authToken?: string): Promise<void> {
    return new Promise((resolve, reject) => {
        // No authorization token or an authorization token that does not start with "Bearer"
        if (!authToken || !authToken.startsWith('Bearer ')) {
            reject();
        } else {
            // Get the encoded token
            const encodedToken = authToken.split('Bearer ')[1];

            // Verify that this is a valid token and has the admin claim set to true
            as.verifyIdToken(encodedToken)
                .then((verifiedToken: any) => {
                    if (verifiedToken.admin) {
                        resolve();
                    } else {
                        reject();
                    }
                })
                .catch((error: Error) => {
                    reject(error);
                });
        }
    });
}

export async function isUser(as: Auth, authToken?: string): Promise<void> {
    return new Promise((resolve, reject) => {
        // No authorization token or an authorization token that does not start with "Bearer"
        if (!authToken || !authToken.startsWith('Bearer ')) {
            reject();
        } else {
            // Get the encoded token
            const encodedToken = authToken.split('Bearer ')[1];

            // Verify that this is a valid token
            as.verifyIdToken(encodedToken)
                .then(() => {
                    resolve();
                })
                .catch((error: Error) => {
                    reject(error);
                });
        }
    });
}