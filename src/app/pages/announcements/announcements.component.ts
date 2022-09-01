import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
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
  selector: "table-cmp",
  moduleId: module.id,
  templateUrl: "announcements.component.html",
})
export class AnnouncementsComponent implements OnInit {
  public tableData1: TableData;
  loading = false;
  announcementsFound = false;

  @ViewChild("modalContent", { static: true }) modalContent: TemplateRef<any>;
  @ViewChild("modalContentView", { static: true })
  modalContentView: TemplateRef<any>;

  modalData: {
    title: string;
    type: string;
    body: string;
  };

  announcement = {
    id: "",
    title: "",
    description: "",
    announcementType: "",
  };

  constructor(
    private crudService: CrudService,
    public toastr: ToastrService,
    private modal: NgbModal,
    private formBuilder: FormBuilder
  ) {}

  announcementForm!: FormGroup;
  ngOnInit() {
    this.tableData1 = {
      headerRow: [],
      dataRows: [],
    };

    //initialize table data
    this.filterAnnouncements("parents");
  }

  filterAnnouncements(filterValue: string) {
    if (filterValue == "parents") {
      this.crudService.GetParentsAnnouncements().subscribe((res) => {
        this.loading = false;
        this.tableData1.dataRows = [];
        this.tableData1.headerRow = [];
        this.announcementsFound = res.length > 0;
        for (let i = 0; i < res.length; i++) {
          this.tableData1.headerRow.push("", "Title", "To", "Body");
          this.tableData1.dataRows.push([
            res[i]["id"],
            res[i]["announcementTitle"],
            res[i]["announcementType"],
            res[i]["announcementBody"],
            "",
          ]);
        }
      });
    } else if (filterValue == "teachers") {
      this.crudService.GetTeachersAnnouncements().subscribe((res) => {
        this.loading = false;
        this.tableData1.dataRows = [];
        this.tableData1.headerRow = [];
        this.announcementsFound = res.length > 0;
        for (let i = 0; i < res.length; i++) {
          this.tableData1.headerRow.push("", "Title", "To", "Body");
          this.tableData1.dataRows.push([
            res[i]["id"],
            res[i]["announcementTitle"],
            res[i]["announcementType"],
            res[i]["announcementBody"],
            "",
          ]);
        }
      });
    } else if (filterValue == "students") {
      this.crudService.GetStudentsAnnouncements().subscribe((res) => {
        this.loading = false;
        this.tableData1.dataRows = [];
        this.tableData1.headerRow = [];
        this.announcementsFound = res.length > 0;
        for (let i = 0; i < res.length; i++) {
          this.tableData1.headerRow.push("", "Title", "To", "Body");
          this.tableData1.dataRows.push([
            res[i]["id"],
            res[i]["announcementTitle"],
            res[i]["announcementType"],
            res[i]["announcementBody"],
            "",
          ]);
        }
      });
    } else if (filterValue == "busdrivers") {
      this.crudService.GetBusDriversAnnouncements().subscribe((res) => {
        this.loading = false;
        this.tableData1.dataRows = [];
        this.tableData1.headerRow = [];
        this.announcementsFound = res.length > 0;
        for (let i = 0; i < res.length; i++) {
          this.tableData1.headerRow.push("", "Title", "To", "Body");
          this.tableData1.dataRows.push([
            res[i]["id"],
            res[i]["announcementTitle"],
            res[i]["announcementType"],
            res[i]["announcementBody"],
            "",
          ]);
        }
      });
    }
  }

  addAnnouncement() {
    this.announcementForm = this.formBuilder.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      announcementType: ["", Validators.required],
    });
    this.modal.open(this.modalContent, {
      size: "lg",
      windowClass: "zindex",
    });
  }

  onSubmit() {
    this.loading = true;
    //get today's date + time in milliseconds
    const date = new Date();
    const time = date.getTime();

    const data = {
      announcementTitle: this.announcementForm.value.title,
      announcementBody: this.announcementForm.value.description,
      announcementTime: Utils.getDateTimeInMilliseconds(
        date.toString(),
        time.toString()
      ),
      announcementImage: Utils.defaultAnnouncementImage,
      announcementType: this.announcementForm.value.announcementType,
    };

    this.crudService.AddAnnouncement(data).then((res) => {
      this.loading = false;
      this.modal.dismissAll();
    });
  }

  showAnnouncement(row) {
    this.announcement.id = row[0];
    this.announcement.title = row[1];
    this.announcement.announcementType = row[2];
    this.announcement.description = row[3];
    this.modal.open(this.modalContentView, {
      size: "lg",
      windowClass: "zindex",
    });
  }

  deleteAnnouncement(announcement) {
    this.loading = true;
    this.crudService.DeleteAnnouncement(announcement).then((res) => {
      this.loading = false;
      this.modal.dismissAll();
    });
  }
}
