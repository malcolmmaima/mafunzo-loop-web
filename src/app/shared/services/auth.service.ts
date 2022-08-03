import { Injectable, NgZone } from "@angular/core";
import { User } from "./user";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/compat/firestore/";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  userData: any;

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem("user", JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem("user"));
      } else {
        localStorage.setItem("user", null);
        JSON.parse(localStorage.getItem("user"));
      }
    });
  }

  SignIn(email, password) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(["/dashboard"]);
        });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  //sign up function
  SignUp(email, password, user) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign up and returns promise */
        this.SendVerificationMail();
        this.SetUserData(result, user);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  //Verification Mail to user
  async SendVerificationMail() {
    await (await this.afAuth.currentUser).sendEmailVerification().then(() => {
      this.router.navigate(["verify-email"]);
    });
  }

  //Reset Password Function
  ForgotPassword(passwordResetEmail) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert("Password reset email sent, check your inbox.");
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  //check user login
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem("user"));
    return user !== null && user.emailVerified !== false ? true : false;
  }

  //set full user data we get
  SetUserData(result, user) {
    const userRef: AngularFirestoreDocument = this.afs.doc(
      `users/${result.uid}`
    );
    const userData: User = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      dateCreated: user.dateCreated,
      profilePic: user.profilePic,
      accountType: user.accountType,
      enabled: user.enabled,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  // Sign out function
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem("user");
      this.router.navigate(["/"]);
    });
  }
}
