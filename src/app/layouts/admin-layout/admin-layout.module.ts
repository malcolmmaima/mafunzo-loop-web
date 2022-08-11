import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AdminLayoutRoutes } from "./admin-layout.routing";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { ProfileComponent } from "../../pages/profile/profile.component";
import { StudentsComponent } from "../../pages/students/students.component";
import { ParentsComponent } from "../../pages/parents/parents.component";
import { MembersListComponent } from "../../pages/members/members.component";
import { MapsComponent } from "../../pages/maps/maps.component";
import { TimeTableComponent } from "../../pages/timetable/timetable.component";
import { UpgradeComponent } from "../../pages/upgrade/upgrade.component";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  declarations: [
    DashboardComponent,
    ProfileComponent,
    StudentsComponent,
    UpgradeComponent,
    ParentsComponent,
    MembersListComponent,
    MapsComponent,
    TimeTableComponent,
  ],
})
export class AdminLayoutModule {}
