import { Injectable, NgZone } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/compat/firestore/";
import { ToastrService } from "ngx-toastr";
import Utils from "../../helpers/MafunzoUtils";

@Injectable({
  providedIn: "root",
})
export class CrudService {
  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    public toastr: ToastrService
  ) {}

  GetWaitListUsers() {
    return this.afs.collection("users").valueChanges();
  }

  ApproveUser(user) {
    if (user != null && user[0] != "") {
      const schoolId = Utils.getUserId();
      const updateSchool = {
        [schoolId]: true,
      };
      const userRef: AngularFirestoreDocument<any> = this.afs.doc(
        `users/${user[3]}`
      );

      //schools field is an array of key value pairs e.g. [{schoolId: true},
      //{ schoolId: false }, .... n], we want to update where key is schoolId and value is false
      userRef
        .set(
          {
            schools: updateSchool,
          },
          { merge: true }
        )
        .then(() => {
          this.toastr.success(user[0] + " approved successfully");
        })
        .catch((error) => {
          this.toastr.error("Unable to approve " + user[0]);
        });
    } else {
      this.toastr.error("Unable to approve " + user[0]);
    }
  }

  DeclineUser(user) {
    if (user != null && user[0] != "") {
      const schoolId = Utils.getUserId();
      const updateSchool = {
        [schoolId]: false,
      };
      const userRef: AngularFirestoreDocument<any> = this.afs.doc(
        `users/${user[3]}`
      );

      //schools field is an array of key value pairs e.g. [{schoolId: true},
      //{ schoolId: false }, .... n], we want to update where key is schoolId
      userRef
        .set(
          {
            schools: updateSchool,
          },
          { merge: true }
        )
        .then(() => {
          this.toastr.warning(user[0] + " blocked successfully");
        })
        .catch((error) => {
          this.toastr.error("Unable to block " + user[0]);
        });
    } else {
      this.toastr.error("Unable to block " + user[0]);
    }
  }
}
