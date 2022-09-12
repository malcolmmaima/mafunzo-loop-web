import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import Utils from "../../helpers/MafunzoUtils";
import { CrudService } from "../../shared/services/crud.service";

declare var google: any;
declare interface TableData {
  headerRow: string[];
  dataRows: string[][];
}

@Component({
  moduleId: module.id,
  selector: "maps-cmp",
  templateUrl: "maps.component.html",
})
export class MapsComponent implements OnInit {
  public tableData1: TableData;
  myLatlng: any;
  marker: any;
  map: any;

  //selected bus details
  selectedBusId: string;
  selectedBusVIN: string;
  selectedBusDriverPhone: string;
  selectedBusDriverName: string;
  selectedBusActive: boolean;

  //initialize schoolDrivers hashTable
  schoolDrivers = {};

  @ViewChild("modalContentView", { static: true })
  modalContentView: TemplateRef<any>;

  @ViewChild("modalContentAddView", { static: true })
  modalContentAddView: TemplateRef<any>;

  constructor(
    private crudService: CrudService,
    public toastr: ToastrService,
    private modal: NgbModal,
    private formBuilder: FormBuilder
  ) {}

  busDetailsForm!: FormGroup;
  ngOnInit() {
    //get all school drivers
    this.getSchoolDrivers();

    this.tableData1 = {
      headerRow: ["Registration Number", "Assigned Driver", "Active", ""],
      dataRows: [],
    };

    this.myLatlng = new google.maps.LatLng(-1.2857857, 36.820026);

    this.crudService.fetchSchoolBuses().subscribe((res) => {
      this.tableData1.dataRows = [];
      this.tableData1.headerRow = [];
      this.tableData1.headerRow.push(
        "Registration Number",
        "Assigned Driver",
        "Phone",
        "Active",
        ""
      );
      for (let i = 0; i < res.length; i++) {
        //for each school bus get user details with assignedDriver as the document id in users collection
        this.crudService
          .GetUserDetails(res[i].assignedDriver)
          .subscribe((user) => {
            this.tableData1.dataRows.push([
              res[i].vin,
              user.firstName + " " + user.lastName,
              res[i].assignedDriver,
              res[i].active,
              res[i].id,
            ]);

            //make sure there are no duplicates in the table
            this.tableData1.dataRows = this.tableData1.dataRows.filter(
              (v, i, a) => a.findIndex((t) => t[0] === v[0]) === i
            );
          });
      }
    });
    var mapOptions = {
      zoom: 13,
      center: this.myLatlng,
      scrollwheel: false, //we disable de scroll over the map, it is a really annoing when you scroll through page
      styles: [
        {
          featureType: "water",
          stylers: [{ saturation: 43 }, { lightness: -11 }, { hue: "#0088ff" }],
        },
        {
          featureType: "road",
          elementType: "geometry.fill",
          stylers: [
            { hue: "#ff0000" },
            { saturation: -100 },
            { lightness: 99 },
          ],
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [{ color: "#808080" }, { lightness: 54 }],
        },
        {
          featureType: "landscape.man_made",
          elementType: "geometry.fill",
          stylers: [{ color: "#ece2d9" }],
        },
        {
          featureType: "poi.park",
          elementType: "geometry.fill",
          stylers: [{ color: "#ccdca1" }],
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [{ color: "#767676" }],
        },
        {
          featureType: "road",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#ffffff" }],
        },
        { featureType: "poi", stylers: [{ visibility: "off" }] },
        {
          featureType: "landscape.natural",
          elementType: "geometry.fill",
          stylers: [{ visibility: "on" }, { color: "#b8cb93" }],
        },
        { featureType: "poi.park", stylers: [{ visibility: "on" }] },
        { featureType: "poi.sports_complex", stylers: [{ visibility: "on" }] },
        { featureType: "poi.medical", stylers: [{ visibility: "on" }] },
        {
          featureType: "poi.business",
          stylers: [{ visibility: "simplified" }],
        },
      ],
    };
    this.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    this.marker = new google.maps.Marker({
      position: this.myLatlng,
      title: "Karibu Mafunzo",
    });

    // To add the marker to the map, call setMap();
    this.marker.setMap(this.map);
  }

  showBus(row) {
    // make a call to get location from location collection with assignedDriver as the document id

    this.crudService.GetBusLocation(row[2]).subscribe(
      (res) => {
        //clear all previous markers from map
        this.marker.setMap(null);

        this.myLatlng = new google.maps.LatLng(
          res["latitude"],
          res["longitude"]
        );
        this.marker = new google.maps.Marker({
          position: this.myLatlng,
          title: row[0],
        });
        this.marker.setMap(this.map);
        this.map.setCenter(this.myLatlng);
        this.marker.setPosition(this.myLatlng);

        this.map.setZoom(20);

        // set custom marker icon
        this.marker.setIcon("assets/img/school-bus.png");

        //show marker info window
        var infowindow = new google.maps.InfoWindow({
          content:
            "<strong>Driver</strong>: " +
            row[1] +
            "<br /> <strong>Assigned</strong>: " +
            row[0],
        });

        infowindow.open(this.map, this.marker);

        //show marker info window on click
        this.marker.addListener("click", function () {
          infowindow.open(this.map, this.marker);
        });

        //scroll to map
        Utils.scrollTo("map");
      },
      (err) => {
        this.toastr.error("Error getting bus location", "Error");
      }
    );
  }

  showBusModal(row) {
    this.selectedBusId = row[4];
    this.selectedBusActive = row[3];
    this.selectedBusDriverPhone = row[2];
    this.selectedBusDriverName = row[1];
    this.selectedBusVIN = row[0];

    this.busDetailsForm = this.formBuilder.group({
      assignedDriver: [this.selectedBusDriverPhone, Validators.required],
      active: [this.selectedBusActive, Validators.required],
      vin: [this.selectedBusVIN, Validators.required],
    });

    this.modal.open(this.modalContentView, {
      size: "lg",
      windowClass: "zindex",
    });
  }

  getSchoolDrivers() {
    //get school drivers and map them to a hash map of phone number and name
    const schoolID = Utils.getUserId();

    this.crudService.GetWaitListUsers().subscribe((res) => {
      //empty hash table
      this.schoolDrivers = {};
      //get my school id (logged in)

      //loop through all users
      for (let i = 0; i < res.length; i++) {
        //check if user is a driver
        for (const key in res[i]["schools"]) {
          if (key === schoolID && res[i]["accountType"] === "BUS_DRIVER") {
            //add user to hash table
            this.schoolDrivers[res[i]["phone"]] = res[i]["firstName"];
          }
        }
      }
    });
  }

  saveBusDetails(selectedBusId) {
    const busDetails = {
      assignedDriver: Utils.extractPhoneNumber(
        this.busDetailsForm.value.assignedDriver
      ),
      active: JSON.parse(
        this.busDetailsForm.value.active.toString().toLowerCase()
      ),
      vin: this.busDetailsForm.value.vin,
    };
    //save bus details
    this.crudService.UpdateBusDetails(selectedBusId, busDetails).then((res) => {
      this.modal.dismissAll();
      this.ngOnInit();
    });
  }

  addNewBus() {
    this.busDetailsForm = this.formBuilder.group({
      assignedDriver: ["", Validators.required],
      active: [false, Validators.required],
      vin: ["", Validators.required],
    });

    this.modal.open(this.modalContentAddView, {
      size: "lg",
      windowClass: "zindex",
    });
  }

  addBus() {
    const busDetails = {
      assignedDriver: Utils.extractPhoneNumber(
        this.busDetailsForm.value.assignedDriver
      ),
      active: JSON.parse(
        this.busDetailsForm.value.active.toString().toLowerCase()
      ),
      vin: this.busDetailsForm.value.vin,
    };

    this.crudService.AddBus(busDetails);

    //wait 1 second for bus to be added then dismiss modal
    setTimeout(() => {
      this.modal.dismissAll();
      this.ngOnInit();
    }, 1000);
  }
}
