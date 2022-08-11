import { Routes } from "@angular/router";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { ProfileComponent } from "../../pages/profile/profile.component";
import { TableComponent } from "../../pages/table/table.component";
import { TypographyComponent } from "../../pages/typography/typography.component";
import { WaitingListComponent } from "../../pages/icons/waitinglist.component";
import { MapsComponent } from "../../pages/maps/maps.component";
import { TimeTableComponent } from "../../pages/timetable/timetable.component";
import { UpgradeComponent } from "../../pages/upgrade/upgrade.component";

export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  { path: "table", component: TableComponent },
  { path: "typography", component: TypographyComponent },
  { path: "waitlist", component: WaitingListComponent },
  { path: "maps", component: MapsComponent },
  { path: "timetable", component: TimeTableComponent },
  { path: "profile", component: ProfileComponent },
  { path: "upgrade", component: UpgradeComponent },
];
