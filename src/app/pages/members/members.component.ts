import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../../shared/services/auth.service";
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

  constructor(
    private crudService: CrudService,
    private authService: AuthService,
    public toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.loading = true;
    this.tableData1 = {
      headerRow: ["Name", "User", "Email", "Phone", "Verified"],
      dataRows: [],
    };
    const userId = Utils.getUserId();
    console.log(userId);
    this.crudService.GetWaitListUsers().subscribe((res) => {
      this.loading = false;

      this.tableData1.dataRows = [];
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
    });
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

  filterMembers(filterValue: string) {
    //if filter value is parents then filter by PARENT
    //if filter value is teachers then filter by TEACHER
    //if filter value is students then filter by STUDENT
    //if filter value is busdrivers then filter by BUS_DRIVER

    if (filterValue === "all") {
      this.ngOnInit();
    } else if (filterValue == "parents") {
      this.tableData1.dataRows = this.tableData1.dataRows.filter(
        (row) => row[1] === "PARENT"
      );
    } else if (filterValue == "teachers") {
      this.tableData1.dataRows = this.tableData1.dataRows.filter(
        (row) => row[1] === "TEACHER"
      );
    } else if (filterValue == "students") {
      this.tableData1.dataRows = this.tableData1.dataRows.filter(
        (row) => row[1] === "STUDENT"
      );
    } else if (filterValue == "busdrivers") {
      this.tableData1.dataRows = this.tableData1.dataRows.filter(
        (row) => row[1] === "BUS_DRIVER"
      );
    }
  }
}
