import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { TabsPage } from '../tabs/tabs';

const getDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const date = today.getDate();
    return `${year}-${month}-${date}`;
}

const getSampleWatchlist = () => {
    return ['FB', 'AAPL', 'NFLX', 'GOOGL', 'WMT', 'DIS', 'KO', 'JNJ'];
}

const getName = (displayName) => {
    return displayName ? displayName : 'anonymous';
}

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
    authState: any = null;
    user: any = {};

    constructor(public navCtrl: NavController,
        public menuCtrl: MenuController,
        public afAuth: AngularFireAuth,
        private afs: AngularFirestore) {

        this.afAuth.authState.subscribe(auth => this.setUserProfile(auth));
    }

    reset() {
        this.user = {};
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

    setUserProfile(auth) {
        this.authState = auth;
        if (auth) {
            this.userProfile.then(profile => {
                this.user = profile ? profile : {};
            });
        }
    }

    logout() {
        console.log('LoginPage-logout');
        this.afAuth.auth.signOut().then(res => {
            const parent = this.navCtrl.parent.parent;
            parent.setRoot(LoginPage);
        });
    }

    /**
     * After login and DB update operations
     * @private
     * @param {any} userData 
     * @memberof LoginPage
     */
    private afterSignIn = (userData) => {
        console.log('LoginPage-afterSignIn', userData);
        this.navCtrl.setRoot(TabsPage);
    }

    private updateDatabase(userData) {
        const loc = `/Users/${userData.uid}`;
        const doc = this.afs.doc(loc);
        const snapshot = doc.snapshotChanges().take(1).toPromise();

        return snapshot.then(snap => snap.payload.exists 
            ? doc.update(userData) 
            : doc.set(userData))
        .then(() => console.log('updateDatabase-success'))
        .catch(error => console.log('updateDatabase-error', error));
    }

    /**
     * Update user object and database
     * @private
     * @param {any} user 
     * @returns {Promise<any>} 
     * @memberof LoginPage
     */
    private updateUserData(user): Promise<any> {
        this.authState = user;
        const userData = {
            uid: this.currentUserId,
            email: this.authState.email,
            photoURL: this.authState.photoURL,
            isAnonymous: this.authState.isAnonymous,
            name: getName(this.authState.displayName),
            lastLogin: getDate(),
            watchlist: getSampleWatchlist()
        };
        this.user = userData;
        console.log('updateUserData', userData, user);
        return this.updateDatabase(userData)
            .then(() => userData);
    }

    anonymousLogin() {
        this.reset();
        return this.afAuth.auth.signInAnonymously()
        .then((user) => this.updateUserData(user))
        .then(this.afterSignIn)
        .catch(error => console.log(error));
    }

    emailLogin(email, password) {
        this.reset();
        return this.afAuth.auth.signInWithEmailAndPassword(email, password)
        .then((user) => this.updateUserData(user))
        .then(this.afterSignIn)
        .catch(error => console.log(error));
    }

    private signInWithRedirect() {
        const provider = new firebase.auth.GoogleAuthProvider();
        this.afAuth.auth.signInWithRedirect(provider)
        .then(() => {
            return this.afAuth.auth.getRedirectResult()
            .then(result => {
                const token = result.credential.accessToken;
                const user = result.user;
                return this.updateUserData(user);
            });
        }).then(this.afterSignIn)
        .catch(error => console.log(error));
    }

    private socialSignIn(provider) {
        // https://g926q.app.goo.gl/
        return this.afAuth.auth.signInWithPopup(provider)
            .then((credential) =>  this.updateUserData(credential.user))
            .then(this.afterSignIn)
            .catch(error => console.log(error));
    }

    githubLogin() {
        this.reset();
        const provider = new firebase.auth.GithubAuthProvider()
        return this.socialSignIn(provider);
    }

    googleLogin() {
        this.reset();
        const provider = new firebase.auth.GoogleAuthProvider()
        return this.socialSignIn(provider);
    }

    facebookLogin() {
        this.reset();
        const provider = new firebase.auth.FacebookAuthProvider()
        return this.socialSignIn(provider);
    }

    twitterLogin(){
        this.reset();
        const provider = new firebase.auth.TwitterAuthProvider()
        return this.socialSignIn(provider);
    }

    ionViewDidEnter() {
        console.log('LoginPage-ionViewDidEnter');
        this.menuCtrl.enable(false,'sidemenu');
    }

}
