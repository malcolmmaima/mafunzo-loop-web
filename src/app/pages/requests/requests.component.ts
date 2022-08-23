import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import Utils from "../../helpers/MafunzoUtils";
import { CrudService } from "../../shared/services/crud.service";

declare interface TableData {
  headerRow: string[];
  dataRows: string[][];
}

@Component({
  selector: "typography-cmp",
  moduleId: module.id,
  templateUrl: "requests.component.html",
})
export class RequestsComponent implements OnInit {
  public tableData1: TableData;
  loading = false;
  requestsFound = false;

  constructor(
    private crudService: CrudService,
    private afs: AngularFirestore
  ) {}
  ngOnInit(): void {
    this.getRequests();
    this.loading = true;
    this.tableData1 = {
      headerRow: ["Name", "User", "Email", "Phone"],
      dataRows: [],
    };
  }

  getRequests() {
    const schoolId = Utils.getUserId();

    var members = [];

    // get all members of the school
    this.afs
      .collection("users")
      .ref.where("schools." + schoolId, "==", true)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          members.push(doc.data());
        });

        //wait 2 seconds before getting requests
        setTimeout(() => {
          //loop through members and for each member pass the phone number as a collection reference to the requests collection
          members.forEach((member) => {
            this.afs
              .collection("requests/" + schoolId + "/" + member["phone"])
              .get()
              .subscribe((snapshot) => {
                snapshot.forEach((doc) => {
                  //get document data from collections "users" document "member["phone"]"
                  this.afs
                    .collection("users")
                    .doc(member["phone"])
                    .get()
                    .subscribe((snapshot) => {
                      this.tableData1.dataRows.push([
                        snapshot.data()["firstName"] +
                          " " +
                          snapshot.data()["lastName"],
                        snapshot.data()["accountType"],
                        snapshot.data()["email"],
                        snapshot.data()["phone"],
                      ]);
                      this.requestsFound = this.tableData1.dataRows.length > 0;
                    }),
                    (error) => {
                      console.log(error);
                    };
                });
              });
          });
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
