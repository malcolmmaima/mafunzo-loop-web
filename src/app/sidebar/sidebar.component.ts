import { Component, OnInit } from "@angular/core";

export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  { path: "/dashboard", title: "Dashboard", icon: "nc-bank", class: "" },
  {
    path: "/members",
    title: "Members",
    icon: "nc-circle-10",
    class: "",
  },
  {
    path: "/timetable",
    title: "Time Table",
    icon: "nc-calendar-60",
    class: "",
  },
  {
    path: "/announcements",
    title: "Announcements",
    icon: "nc-bell-55",
    class: "",
  },
  {
    path: "/requests",
    title: "Requests",
    icon: "nc-book-bookmark",
    class: "",
  },
  { path: "/maps", title: "School Buses", icon: "nc-pin-3", class: "" },
  {
    path: "/profile",
    title: "School Profile",
    icon: "nc-single-02",
    class: "",
  },
  {
    path: "/upgrade",
    title: "Upgrade to PRO",
    icon: "nc-spaceship",
    class: "active-pro",
  },
];

@Component({
  moduleId: module.id,
  selector: "sidebar-cmp",
  templateUrl: "sidebar.component.html",
})
export class SidebarComponent implements OnInit {
  public menuItems: any[];
  ngOnInit() {
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
  }
}
