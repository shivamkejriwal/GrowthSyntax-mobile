import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class AuthenticationService {
    authState: any = null;
    user: any = {};

    constructor(public afAuth: AngularFireAuth,
            private afs: AngularFirestore) {
        console.log('AuthenticationService');
        this.afAuth.authState.subscribe(auth => this.setUserProfile(auth));
    }

    // Returns true if user is logged in
    get authenticated(): boolean {
        return this.authState !== null;
    }

    // Returns current user data
    get currentUser(): any {
        return this.authenticated ? this.authState : null;
    }

    get currentUserId(): string {
        return this.authenticated ? this.authState.uid : '';
    }

    // Returns
    get currentUserObservable(): any {
        return this.afAuth.authState
    }

    // Anonymous User
    get currentUserAnonymous(): boolean {
        return this.authenticated ? this.authState.isAnonymous : false
    }

    // Returns current user display name or Guest
    get currentUserDisplayName(): string {
        if (!this.authState) { return 'Guest' }
        else if (this.currentUserAnonymous) { return 'Anonymous' }
        else { return this.authState['displayName'] || 'User without a Name' }
    }

    get userProfile(): any {
        if (!this.currentUserId) {
            return Promise.resolve(false);
        }
        const loc = `/Users/${this.currentUserId}`;
        const doc = this.afs.doc(loc);
        return doc.valueChanges().take(1).toPromise();
    }

    loggedInUser() {
        console.log('AuthenticationService-loggedInUser');
        return new Promise((resolve, reject) => {
            this.afAuth.authState.subscribe(auth => {
                if (!auth.uid) {
                    reject('No User');
                }
                resolve(this.userProfile);
            });
        })
    }

    setUserProfile(auth) {
        this.authState = auth;
        if (auth) {
            this.userProfile.then(profile => {
                this.user = profile ? profile : {};
            });
        }
    }

    logout() {
        return this.afAuth.auth.signOut();
    }

}