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
  public tableData2: TableData;
  loading = false;
  announcementsFound = false;

  @ViewChild("modalContent", { static: true }) modalContent: TemplateRef<any>;

  constructor(
    private crudService: CrudService,
    public toastr: ToastrService,
    private modal: NgbModal,
    private formBuilder: FormBuilder
  ) {}

  announcementForm!: FormGroup;
  ngOnInit() {
    this.tableData1 = {
      headerRow: ["Title", "Body", ""],
      dataRows: [],
    };

    this.crudService.GetParentsAnnouncements().subscribe((res) => {
      this.loading = false;
      this.announcementsFound = res.length > 0;
      this.tableData1.dataRows = [];
      for (let i = 0; i < res.length; i++) {
        this.tableData1.dataRows.push([
          res[i]["announcementTitle"],
          res[i]["announcementBody"],
          "",
        ]);
      }
    });
  }

  addAnnouncement() {
    this.announcementForm = this.formBuilder.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      date: ["", Validators.required],
      time: ["", Validators.required],
      announcementType: ["", Validators.required],
    });
    this.modal.open(this.modalContent, {
      size: "lg",
      windowClass: "zindex",
    });
  }

  onSubmit() {
    this.loading = true;
    const data = {
      announcementTitle: this.announcementForm.value.title,
      announcementBody: this.announcementForm.value.description,
      announcementTime: Utils.getDateTimeInMilliseconds(
        this.announcementForm.value.date,
        this.announcementForm.value.time
      ),
      announcementImage: Utils.defaultAnnouncementImage,
      announcementType: this.announcementForm.value.announcementType,
    };

    this.crudService.AddAnnouncement(data).then((res) => {
      this.loading = false;
      this.modal.dismissAll();
    });
  }
}
