import { Injectable, NgZone } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection,
} from "@angular/fire/compat/firestore/";
import { ToastrService } from "ngx-toastr";
import { map } from "rxjs";
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

  GetUserDetails(userId: string) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${userId}`
    );
    return userRef.valueChanges();
  }

  GetWaitListUsers() {
    return this.afs.collection("users").valueChanges();
  }

  // Get all announcements corresponding to the school id
  GetParentsAnnouncements() {
    const schoolId = Utils.getUserId();
    console.log(schoolId);
    const announcementsRef: AngularFirestoreDocument<any> = this.afs.doc(
      `announcements/${schoolId}`
    );

    return announcementsRef.collection("PARENT").valueChanges();
  }

  GetStudentsAnnouncements() {
    const schoolId = Utils.getUserId();
    const announcementsRef: AngularFirestoreDocument<any> = this.afs.doc(
      `announcements/${schoolId}`
    );

    return announcementsRef.collection("STUDENT").valueChanges();
  }

  GetTeachersAnnouncements() {
    const schoolId = Utils.getUserId();
    const announcementsRef: AngularFirestoreDocument<any> = this.afs.doc(
      `announcements/${schoolId}`
    );

    return announcementsRef.collection("TEACHER").valueChanges();
  }

  GetBusDriversAnnouncements() {
    const schoolId = Utils.getUserId();
    const announcementsRef: AngularFirestoreDocument<any> = this.afs.doc(
      `announcements/${schoolId}`
    );

    return announcementsRef.collection("BUS_DRIVER").valueChanges();
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
        announcementType: announcement["announcementType"],
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

  DeleteAnnouncement(announcement): Promise<any> {
    if (announcement != null && announcement[0] != "") {
      const schoolId = Utils.getUserId();
      const announcementRef: AngularFirestoreDocument<any> = this.afs.doc(
        `announcements/${schoolId}/${announcement["announcementType"]}/${announcement["id"]}`
      );
      return announcementRef
        .delete()
        .then(() => {
          this.toastr.success("Announcement deleted successfully");
        })
        .catch((error) => {
          this.toastr.error("Unable to delete announcement");
        });
    } else {
      this.toastr.error("Unable to delete announcement");
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

          if (user[1] == "TEACHER") {
            this.CreateTeacher(user, true);
          }
        })
        .catch((error) => {
          this.toastr.error("Unable to approve " + user[0]);
        });
    } else {
      this.toastr.error("Unable to approve " + user[0]);
    }
  }

  updateUserRole(userPhone: string, role: string) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${userPhone}`
    );

    userRef
      .set(
        {
          accountType: role,
        },
        { merge: true }
      )
      .then(() => {
        this.toastr.success("User role updated successfully");
      })
      .catch((error) => {
        this.toastr.error("Unable to update user role");
      });
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
          if (user[1] == "TEACHER") {
            this.CreateTeacher(user, false);
          }
        })
        .catch((error) => {
          this.toastr.error("Unable to block " + user[0]);
        });
    } else {
      this.toastr.error("Unable to block " + user[0]);
    }
  }

  AddNewEvent(event): Promise<any> {
    if (event != null && event[0] != "") {
      const schoolId = Utils.getUserId();
      const eventId = this.afs.createId();
      const eventRef: AngularFirestoreDocument<any> = this.afs.doc(
        `calendar_events/${schoolId}/${event["accountType"]}/${eventId}`
      );

      //append new firestore document id to the event object then add to the database
      const eventNew = {
        id: eventId,
        title: event["title"],
        description: event["description"],
        start: Utils.getDateTimeInMilliseconds2(event["start"]),
        end: Utils.getDateTimeInMilliseconds2(event["end"]),
      };
      return eventRef
        .set(eventNew, { merge: true })
        .then(() => {
          this.toastr.success("Event added successfully");
        })
        .catch((error) => {
          console.log(error);
          this.toastr.error("Unable to add event");
        });
    }
  }

  AddNewTimeTable(timeTable, grade): Promise<any> {
    if (timeTable != null) {
      const schoolId = Utils.getUserId();
      const subjectId = this.afs.createId();
      const subjectsRef: AngularFirestoreDocument<any> = this.afs.doc(
        `subjects/${schoolId}/${grade}/${subjectId}`
      );

      //append new firestore document id to the timeTable object then add to the database
      const timeTableNew = {
        id: subjectId,
        subjectName: timeTable["subjectName"],
        subjectGrade: grade,
        assignedTeacher: "",
        startTime: Utils.getDateTimeInMilliseconds2(timeTable["startTime"]),
        endTime: Utils.getDateTimeInMilliseconds2(timeTable["endTime"]),
        dayOfWeek: Utils.getDayOfWeekFromMilliseconds(
          Utils.getDateTimeInMilliseconds2(timeTable["startTime"])
        ),
      };

      return subjectsRef
        .set(timeTableNew, { merge: true })
        .then(() => {
          this.toastr.success("TimeTable added successfully");
        })
        .catch((error) => {
          this.toastr.error("Unable to add TimeTable");
        });
    }
  }

  FetchParentsCalendarEvents() {
    const schoolId = Utils.getUserId();
    const calendarEventsRef: AngularFirestoreDocument<any> = this.afs.doc(
      `calendar_events/${schoolId}`
    );

    return calendarEventsRef.collection("PARENT").valueChanges();
  }
  FetchTeachersCalendarEvents() {
    const schoolId = Utils.getUserId();
    const calendarEventsRef: AngularFirestoreDocument<any> = this.afs.doc(
      `calendar_events/${schoolId}`
    );

    return calendarEventsRef.collection("TEACHER").valueChanges();
  }

  fetchStudentsCalendarEvents() {
    const schoolId = Utils.getUserId();
    const calendarEventsRef: AngularFirestoreDocument<any> = this.afs.doc(
      `calendar_events/${schoolId}`
    );

    return calendarEventsRef.collection("STUDENT").valueChanges();
  }

  fetchBusDriversCalendarEvents() {
    const schoolId = Utils.getUserId();
    const calendarEventsRef: AngularFirestoreDocument<any> = this.afs.doc(
      `calendar_events/${schoolId}`
    );

    return calendarEventsRef.collection("BUS_DRIVER").valueChanges();
  }

  deleteEvent(targetType: string, documentId: string): Promise<any> {
    const schoolId = Utils.getUserId();
    var targetT = "";
    if (targetType == "parents") {
      targetT = "PARENT";
    } else if (targetType == "teachers") {
      targetT = "TEACHER";
    } else if (targetType == "students") {
      targetT = "STUDENT";
    } else if (targetType == "busdrivers") {
      targetT = "BUS_DRIVER";
    }

    const calendarEventsRef: AngularFirestoreDocument<any> = this.afs.doc(
      `calendar_events/${schoolId}/${targetT}/${documentId}`
    );
    return calendarEventsRef.delete();
  }

  deleteTimeTableItem(grade: string, documentId: string): Promise<any> {
    const schoolId = Utils.getUserId();
    const calendarEventsRef: AngularFirestoreDocument<any> = this.afs.doc(
      `subjects/${schoolId}/${grade}/${documentId}`
    );
    return calendarEventsRef.delete();
  }

  getRequests(phoneNumber: string) {
    const schoolId = Utils.getUserId();
    const requestsRef: AngularFirestoreDocument<any> = this.afs.doc(
      `requests/${schoolId}`
    );

    const userRequests = requestsRef.collection(phoneNumber).valueChanges();
    return userRequests;
  }

  updateRequest(phoneNumber: string, request: any) {
    const schoolId = Utils.getUserId();
    const requestsRef: AngularFirestoreDocument<any> = this.afs.doc(
      `requests/${schoolId}`
    );

    const userRequests = requestsRef.collection(phoneNumber);
    return userRequests.doc(request["id"]).set(request, { merge: true });
  }

  getUserDetails(userId: string) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${userId}`
    );

    return userRef.valueChanges();
  }

  updateUser(updatedSchoolFields) {
    const schoolId = Utils.getUserId();
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${schoolId}`
    );

    return userRef.set(updatedSchoolFields, { merge: true });
  }

  CreateTeacher(teacher, activeTeacher: boolean) {
    //make sure teacher is not null and has a valid phone number
    if (teacher != null && teacher[3] != "") {
      const schoolId = Utils.getUserId();
      const teacherRef: AngularFirestoreDocument<any> = this.afs.doc(
        `teachers/${schoolId}/collection/${teacher[3]}`
      );

      //teacher[0] is a combination of first name and last name, we want to split it into first name and last name
      const teacherNew = {
        id: teacher[3],
        firstName: teacher[0].split(" ")[0],
        lastName: teacher[0].split(" ")[1],
        phoneNumber: teacher[3],
        emailAddress: teacher[2],
        dateCreated: Utils.getCurrentTime(),
        bio: "...",
        grades: [],
        subjects: [],
        profilePicture: Utils.defaultAvatar,
        status: activeTeacher ? "ACTIVE" : "INACTIVE",
      };

      return teacherRef
        .set(teacherNew, { merge: true })
        .then(() => {
          this.toastr.info(
            "Teacher: " +
              teacherNew.firstName +
              " " +
              teacherNew.lastName +
              " updated successfully"
          );
        })
        .catch((error) => {
          console.log(error);
          this.toastr.error("Unable to update teacher record");
        });
    } else {
      this.toastr.error("Unable to update teacher record");
    }
  }

  fetchGradeTimeTable(grade: string) {
    const schoolId = Utils.getUserId();
    const gradeTimeTableRef: AngularFirestoreDocument<any> = this.afs.doc(
      `subjects/${schoolId}`
    );

    return gradeTimeTableRef.collection(grade).valueChanges();
  }
}
