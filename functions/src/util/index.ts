import { auth } from 'firebase-admin';
import * as authentication from './auth';

type Auth = auth.Auth;

export async function isAdmin(as: Auth, authToken?: string): Promise<void> {
    return authentication.isAdmin(as, authToken);
}

export async function isUser(as: Auth, authToken?: string): Promise<void> {
    return authentication.isUser(as, authToken);
}