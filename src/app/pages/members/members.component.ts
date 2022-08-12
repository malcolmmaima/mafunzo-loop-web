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
    this.crudService.GetWaitListUsers().subscribe((res) => {
      this.loading = false;

      if (userId == null || userId == undefined) {
        this.toastr.error("Something went wrong, please try again");
        this.authService.SignOut();
      }

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

  approveUser(user) {
    this.crudService.ApproveUser(user);
  }

  declineUser(user) {
    this.crudService.DeclineUser(user);
  }
}
