import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
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
  public tableData2: TableData;

  @ViewChild("modalContent", { static: true }) modalContent: TemplateRef<any>;

  loading = false;
  requestsFound = false;
  selectedUser: string = "User Requests";
  selectedPhone: string;

  constructor(
    private crudService: CrudService,
    private afs: AngularFirestore,
    public toastr: ToastrService,
    private modal: NgbModal,
    private formBuilder: FormBuilder
  ) {}

  requestForm!: FormGroup;
  ngOnInit(): void {
    this.getRequests();
    this.loading = true;
    this.tableData1 = {
      headerRow: ["Name", "User", "Email", "Phone"],
      dataRows: [],
    };

    this.tableData2 = {
      headerRow: ["Subject", "Time", "Message", "Status"],
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
                      //make sure not to add an existing user to the table
                      if (
                        this.tableData1.dataRows.findIndex(
                          (row) => row[3] == snapshot.data()["phone"]
                        ) == -1
                      ) {
                        this.tableData1.dataRows.push([
                          snapshot.data()["firstName"] +
                            " " +
                            snapshot.data()["lastName"],
                          snapshot.data()["accountType"],
                          snapshot.data()["email"],
                          snapshot.data()["phone"],
                        ]);
                      }
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

  showUserRequests(rowData) {
    this.selectedUser = rowData[0];
    this.selectedPhone = rowData[3];
    this.crudService.getRequests(rowData[3]).subscribe((data) => {
      this.tableData2.dataRows = [];
      //concat message to 150 characters
      data.forEach((request) => {
        this.tableData2.dataRows.push([
          request["subject"],
          Utils.getDateFromMilliseconds(request["createdAt"]).toDateString(),
          request["message"].substring(0, 100) + "...",
          request["status"],
          request["id"],
        ]);
      });
    });
  }

  //show single clicked user request using a modal
  showUserRequest(rowData) {
    this.requestForm = this.formBuilder.group({
      subject: [rowData[0], Validators.required],
      time: [rowData[1], Validators.required],
      message: [rowData[2], Validators.required],
      status: [rowData[3], Validators.required],
      id: [rowData[4], Validators.required],
    });
    this.modal.open(this.modalContent, {
      size: "lg",
      windowClass: "zindex",
    });
  }

  //update request status
  onSubmit(formData) {
    this.crudService
      .updateRequest(this.selectedPhone, formData.value)
      .then((res) => {
        this.toastr.success("Request updated successfully");
        this.modal.dismissAll();
      })
      .catch((error) => {
        this.toastr.error("Error updating request");
      });
  }
}
