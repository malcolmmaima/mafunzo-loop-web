import { ToastrService } from "ngx-toastr";
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
} from "@angular/core";
import Chart from "chart.js";

import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from "date-fns";
import { Subject } from "rxjs";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from "angular-calendar";
import { EventColor } from "calendar-utils";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CrudService } from "../../shared/services/crud.service";
import Utils from "../../helpers/MafunzoUtils";

const colors: Record<string, EventColor> = {
  red: {
    primary: "#ad2121",
    secondary: "#FAE3E3",
  },
  blue: {
    primary: "#1e90ff",
    secondary: "#D1E8FF",
  },
  yellow: {
    primary: "#e3bc08",
    secondary: "#FDF1BA",
  },
};

@Component({
  selector: "notifications-cmp",
  moduleId: module.id,
  templateUrl: "timetable.component.html",
})
export class TimeTableComponent {
  totalStudents: number = 0;
  totalParents: number = 0;
  totalTeachers: number = 0;
  totalSchoolUsers: number = 0;
  totalBusDrivers: number = 0;
  otherUsers: number = 0;

  @ViewChild("modalViewCalendarEvent", { static: true })
  modalViewCalendarEvent: TemplateRef<any>;
  @ViewChild("modalNewTimeTable", { static: true })
  modalNewTimeTable: TemplateRef<any>;

  view: CalendarView = CalendarView.Week; //default to week

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    // {
    //   label: '<i class="nc-icon nc-ruler-pencil"></i>',
    //   a11yLabel: "Edit",
    //   onClick: ({ event }: { event: CalendarEvent }): void => {
    //     this.handleEvent("Edited", event);
    //   },
    // },
    // {
    //   label: '<i class="nc-icon nc-simple-remove text-danger"></i>',
    //   a11yLabel: "Delete",
    //   onClick: ({ event }: { event: CalendarEvent }): void => {
    //     this.events = this.events.filter((iEvent) => iEvent !== event);
    //     this.handleEvent("Deleted", event);
    //   },
    // },
  ];

  refresh = new Subject<void>();
  filterVal = "grade_1";
  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = false;

  constructor(
    private modal: NgbModal,
    private formBuilder: FormBuilder,
    private crudService: CrudService,
    private toastr: ToastrService
  ) {}

  newTimeTableForm!: FormGroup;

  ngOnInit() {
    this.fetchGradeTimetable(this.filterVal);
  }

  fetchGradeTimetable(gradeLevel: string) {
    this.crudService.fetchGradeTimeTable(gradeLevel).subscribe((data) => {
      this.events = data.map((e) => {
        return {
          id: e.id,
          title: e.subjectName,
          start: new Date(e.startTime),
          end: new Date(e.endTime),
          color: colors.red,
          draggable: false,
          resizable: {
            beforeStart: true,
            afterEnd: true,
          },
        };
      });
    });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent("Dropped or resized", event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalViewCalendarEvent, {
      size: "lg",
      windowClass: "zindex",
    });
  }

  addEvent(): void {
    this.newTimeTableForm = this.formBuilder.group({
      subjectName: ["", Validators.required],
      startTime: ["", Validators.required],
      endTime: ["", Validators.required],
    });
    this.modal.open(this.modalNewTimeTable, {
      size: "lg",
      windowClass: "zindex",
    });
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.crudService
      .deleteTimeTableItem(this.filterVal, eventToDelete.id.toString())
      .then(() => {
        this.toastr.success("Timetable item deleted");
        this.events = this.events.filter((event) => event !== eventToDelete);
        this.modal.dismissAll();
      }),
      (error) => {
        console.log(error);
        this.toastr.error("Error deleting time table item");
      };
  }

  setView(view: CalendarView) {
    console.log(view);
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
    this.refresh.next();
  }

  onSubmit() {
    this.crudService
      .AddNewTimeTable(this.newTimeTableForm.value, this.filterVal)
      .then((data) => {
        this.events.push(data);
        this.modal.dismissAll();
      });
  }

  filterGrade(filterValue: string) {
    this.filterVal = filterValue;
    this.fetchGradeTimetable(filterValue);
  }

  showNotification(from, align) {
    const color = Math.floor(Math.random() * 5 + 1);

    switch (color) {
      case 1:
        this.toastr.info(
          '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Welcome to <b>Mafunzo Loop</b>.</span>',
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-info alert-with-icon",
            positionClass: "toast-" + from + "-" + align,
          }
        );
        break;
      case 2:
        this.toastr.success(
          '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Welcome to <b>Mafunzo Loop</b>.</span>',
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-success alert-with-icon",
            positionClass: "toast-" + from + "-" + align,
          }
        );
        break;
      case 3:
        this.toastr.warning(
          '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Welcome to <b>Mafunzo Loop</b>.</span>',
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-warning alert-with-icon",
            positionClass: "toast-" + from + "-" + align,
          }
        );
        break;
      case 4:
        this.toastr.error(
          '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Welcome to <b>Mafunzo Loop</b>.</span>',
          "",
          {
            timeOut: 4000,
            enableHtml: true,
            closeButton: true,
            toastClass: "alert alert-danger alert-with-icon",
            positionClass: "toast-" + from + "-" + align,
          }
        );
        break;
      case 5:
        this.toastr.show(
          '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Welcome to <b>Mafunzo Loop</b>.</span>',
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-primary alert-with-icon",
            positionClass: "toast-" + from + "-" + align,
          }
        );
        break;
      default:
        break;
    }
  }
}
