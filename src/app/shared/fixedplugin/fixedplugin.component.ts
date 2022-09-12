import { Component, OnInit } from "@angular/core";
import { empty } from "rxjs";

@Component({
  moduleId: module.id,
  selector: "fixedplugin-cmp",
  templateUrl: "fixedplugin.component.html",
})
export class FixedPluginComponent implements OnInit {
  public localsetSidebarColor: string;
  public localsetSidebarActiveColor: string;
  public sidebarColor: string = "black";
  public sidebarActiveColor: string = "danger";

  public state: boolean = true;

  changeSidebarColor(color) {
    //save sidebar color to local storage
    localStorage.setItem("sidebarColor", color);

    var sidebar = <HTMLElement>document.querySelector(".sidebar");

    this.sidebarColor = color;
    if (sidebar != undefined) {
      sidebar.setAttribute("data-color", this.sidebarColor);
    }
  }
  changeSidebarActiveColor(color) {
    localStorage.setItem("sidebarActiveColor", color);
    var sidebar = <HTMLElement>document.querySelector(".sidebar");
    this.sidebarActiveColor = color;
    if (sidebar != undefined) {
      sidebar.setAttribute("data-active-color", color);
    }
  }
  ngOnInit() {
    this.localsetSidebarColor = localStorage.getItem("sidebarColor");
    this.localsetSidebarActiveColor =
      localStorage.getItem("sidebarActiveColor");

    if (this.localsetSidebarColor != undefined) {
      this.sidebarColor = this.localsetSidebarColor;
      this.changeSidebarColor(this.sidebarColor);
    } else {
      this.changeSidebarColor("black");
    }

    if (this.localsetSidebarActiveColor != undefined) {
      this.sidebarActiveColor = this.localsetSidebarActiveColor;
      this.changeSidebarActiveColor(this.sidebarActiveColor);
    } else {
      this.changeSidebarActiveColor("danger");
    }
  }
}
