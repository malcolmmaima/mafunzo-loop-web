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
  selector: "dashboard-cmp",
  moduleId: module.id,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      h3 {
        margin: 0 0 10px;
      }

      pre {
        background-color: #f5f5f5;
        padding: 15px;
      }
    `,
  ],
  templateUrl: "dashboard.component.html",
})
export class DashboardComponent implements OnInit {
  totalStudents: number = 0;
  totalParents: number = 0;
  totalTeachers: number = 0;
  totalSchoolUsers: number = 0;

  @ViewChild("modalViewCalendarEvent", { static: true })
  modalViewCalendarEvent: TemplateRef<any>;
  @ViewChild("modalNewEvent", { static: true }) modalNewEvent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="nc-icon nc-ruler-pencil"></i>',
      a11yLabel: "Edit",
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent("Edited", event);
      },
    },
    {
      label: '<i class="nc-icon nc-simple-remove text-danger"></i>',
      a11yLabel: "Delete",
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent("Deleted", event);
      },
    },
  ];

  refresh = new Subject<void>();

  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = false;

  constructor(
    private modal: NgbModal,
    private formBuilder: FormBuilder,
    private crudService: CrudService
  ) {}

  newEventForm!: FormGroup;

  ngOnInit() {
    this.fetchCalendarEvents();
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    console.log(date, events);
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
    console.log(this.modalData);
    this.modal.open(this.modalViewCalendarEvent, {
      size: "lg",
      windowClass: "zindex",
    });
  }

  addEvent(): void {
    this.newEventForm = this.formBuilder.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      accountType: ["", Validators.required],
      start: ["", Validators.required],
      end: ["", Validators.required],
    });
    this.modal.open(this.modalNewEvent, {
      size: "lg",
      windowClass: "zindex",
    });
  }

  fetchCalendarEvents() {
    this.crudService.FetchCalendarEvents().subscribe((data) => {
      this.events = data.map((e) => {
        return {
          title: e.title,
          start: Utils.getDateFromMilliseconds(e.start),
          end: Utils.getDateFromMilliseconds(e.end),
          description: e.description,
          color: colors.red,
          draggable: true,
          resizable: {
            beforeStart: true,
            afterEnd: true,
          },
        };
      });
      //date for 2 seconds after the events are fetched
      setTimeout(() => {
        //new date with time set to 00:00:00
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        this.refresh.next();
        //this.dayClicked({ date: today, events: [] });
      }, 2000);
    }),
      (error) => {
        console.log(error);
      };
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  onSubmit() {
    console.log(this.newEventForm.value);
    this.crudService.AddNewEvent(this.newEventForm.value).then((data) => {
      this.events.push(data);
      this.modal.dismissAll();
    });
  }
}
