import { Routes } from "@angular/router";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { ProfileComponent } from "../../pages/profile/profile.component";
import { StudentsComponent } from "../../pages/students/students.component";
import { ParentsComponent } from "../../pages/parents/parents.component";
import { MembersListComponent } from "../../pages/members/members.component";
import { MapsComponent } from "../../pages/maps/maps.component";
import { TimeTableComponent } from "../../pages/timetable/timetable.component";
import { UpgradeComponent } from "../../pages/upgrade/upgrade.component";
import { TeachersComponent } from "../../pages/teachers/teachers.component";

export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  { path: "students", component: StudentsComponent },
  { path: "parents", component: ParentsComponent },
  { path: "teachers", component: TeachersComponent },
  { path: "members", component: MembersListComponent },
  { path: "maps", component: MapsComponent },
  { path: "timetable", component: TimeTableComponent },
  { path: "profile", component: ProfileComponent },
  { path: "upgrade", component: UpgradeComponent },
];
