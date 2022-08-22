import { Routes } from "@angular/router";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { ProfileComponent } from "../../pages/profile/profile.component";
import { AnnouncementsComponent } from "../../pages/announcements/announcements.component";
import { MembersListComponent } from "../../pages/members/members.component";
import { MapsComponent } from "../../pages/maps/maps.component";
import { TimeTableComponent } from "../../pages/timetable/timetable.component";
import { UpgradeComponent } from "../../pages/upgrade/upgrade.component";
import { RequestsComponent } from "../../pages/requests/requests.component";

export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  { path: "announcements", component: AnnouncementsComponent },
  { path: "requests", component: RequestsComponent },
  { path: "members", component: MembersListComponent },
  { path: "maps", component: MapsComponent },
  { path: "timetable", component: TimeTableComponent },
  { path: "profile", component: ProfileComponent },
  { path: "upgrade", component: UpgradeComponent },
];
