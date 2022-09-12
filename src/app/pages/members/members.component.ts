import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../../shared/services/auth.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Utils from "../../helpers/MafunzoUtils";
import { CrudService } from "../../shared/services/crud.service";

declare interface TableData {
  headerRow: string[];
  dataRows: string[][];
}

@Component({
  selector: "icons-cmp",
  moduleId: module.id,
  templateUrl: "members.component.html",
})
export class MembersListComponent implements OnInit {
  public tableData1: TableData;

  loading = false;
  usersFound = false;
  selectedUser: string;
  selectedUserPhone: string;
  selectedUserRole: string;
  selectedUserEmail: string;

  @ViewChild("modalContentView", { static: true })
  modalContentView: TemplateRef<any>;

  memberForm!: FormGroup;

  constructor(
    private crudService: CrudService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private modal: NgbModal,
    public toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.loading = true;
    this.tableData1 = {
      headerRow: ["Name", "User", "Email", "Phone", "Verified"],
      dataRows: [],
    };
    const userId = Utils.getUserId();
    console.log(
      Utils.generateRandomString(5) + userId + Utils.generateRandomString(10)
    );
    this.getUsers("all", userId);
  }

  ngAfterViewInit() {
    const userId = Utils.getUserId();

    if (userId == null || userId == undefined) {
      this.toastr.error(
        "User id not found, please logout and login again for a smooth experience"
      );
      //this.authService.SignOut();
    }
  }

  approveUser(user) {
    this.crudService.ApproveUser(user);
  }

  declineUser(user) {
    this.crudService.DeclineUser(user);
  }

  updateMemberRole(userPhone: string, userRole: string) {
    this.crudService.updateUserRole(userPhone, userRole);
  }

  filterMembers(filterValue: string) {
    //if filter value is parents then filter by PARENT
    //if filter value is teachers then filter by TEACHER
    //if filter value is students then filter by STUDENT
    //if filter value is busdrivers then filter by BUS_DRIVER

    if (filterValue === "all") {
      this.getUsers("all", Utils.getUserId());
    }
    if (filterValue == "parents") {
      this.getUsers("PARENT", Utils.getUserId());
    }
    if (filterValue == "teachers") {
      this.getUsers("TEACHER", Utils.getUserId());
    }
    if (filterValue == "students") {
      this.getUsers("STUDENT", Utils.getUserId());
    }
    if (filterValue == "busdrivers") {
      this.getUsers("BUS_DRIVER", Utils.getUserId());
    }
    if (this.tableData1.dataRows.length == 0) {
      this.tableData1.dataRows = [];
      this.usersFound = false;
      this.loading = false;
    }
  }

  getUsers(filterValue: string, userId) {
    this.crudService.GetWaitListUsers().subscribe((res) => {
      this.loading = false;

      this.tableData1.dataRows = [];
      if (filterValue == "all") {
        for (let i = 0; i < res.length; i++) {
          for (const key in res[i]["schools"]) {
            if (key === userId) {
              this.tableData1.headerRow = [
                "Name",
                "User",
                "Email",
                "Phone",
                "Verified",
              ];
              this.tableData1.dataRows.push([
                res[i]["firstName"] + " " + res[i]["lastName"],
                res[i]["accountType"],
                res[i]["email"],
                res[i]["phone"],
                res[i]["schools"][userId],
              ]);
            }
          }

          this.usersFound = this.tableData1.dataRows.length > 0;
        }
      } else {
        this.tableData1.dataRows = [];
        for (let i = 0; i < res.length; i++) {
          for (const key in res[i]["schools"]) {
            if (key === userId && res[i]["accountType"] === filterValue) {
              this.tableData1.headerRow = [
                "Name",
                "User",
                "Email",
                "Phone",
                "Verified",
              ];
              this.tableData1.dataRows.push([
                res[i]["firstName"] + " " + res[i]["lastName"],
                res[i]["accountType"],
                res[i]["email"],
                res[i]["phone"],
                res[i]["schools"][userId],
              ]);
            }
          }

          this.usersFound = this.tableData1.dataRows.length > 0;
        }
      }
    });
  }

  onSubmit() {
    this.updateMemberRole(this.selectedUserPhone, this.memberForm.value.role);
    setTimeout(() => {
      this.modal.dismissAll();
    }, 2000);
  }

  showMember(row) {
    this.selectedUserPhone = row[3];
    this.selectedUserEmail = row[2];
    this.selectedUserRole = row[1];
    this.selectedUser = row[0];

    this.memberForm = this.formBuilder.group({
      name: [this.selectedUser, Validators.required],
      email: [this.selectedUserEmail, Validators.required],
      phone: [this.selectedUserPhone, Validators.required],
      role: [this.selectedUserRole, Validators.required],
    });

    this.modal.open(this.modalContentView, {
      size: "lg",
      windowClass: "zindex",
    });
  }
}
