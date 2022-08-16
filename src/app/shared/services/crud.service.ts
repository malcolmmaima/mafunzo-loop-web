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

  // Get all announcements corresponding to the school id
  GetParentsAnnouncements() {
    const schoolId = Utils.getUserId();
    console.log("School ID: " + schoolId);
    const announcementsRef: AngularFirestoreDocument<any> = this.afs.doc(
      `announcements/${schoolId}`
    );

    return announcementsRef.collection("PARENT").valueChanges();
  }

  // Add new announcement to the database
  AddAnnouncement(announcement): Promise<any> {
    if (announcement != null && announcement[0] != "") {
      const schoolId = Utils.getUserId();
      const announcementId = this.afs.createId();
      const announcementRef: AngularFirestoreDocument<any> = this.afs.doc(
        `announcements/${schoolId}/${announcement["announcementType"]}/${announcementId}`
      );

      //append new firestore document id to the announcement object then add to the database

      const announcementNew = {
        id: announcementId,
        announcementTitle: announcement["announcementTitle"],
        announcementBody: announcement["announcementBody"],
        announcementImage: announcement["announcementImage"],
        announcementTime: announcement["announcementTime"],
      };
      return announcementRef
        .set(announcementNew, { merge: true })
        .then(() => {
          this.toastr.success("Announcement added successfully");
        })
        .catch((error) => {
          this.toastr.error("Unable to add announcement");
        });
    }
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
