import { Component, OnInit } from "@angular/core";
import Utils from "../../helpers/MafunzoUtils";
import { CrudService } from "../../shared/services/crud.service";
import { ToastrService } from "ngx-toastr";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "user-cmp",
  moduleId: module.id,
  templateUrl: "profile.component.html",
})
export class ProfileComponent implements OnInit {
  constructor(
    private crudService: CrudService,
    public toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {}

  profileForm!: FormGroup;

  schoolName: string;
  schoolLocation: string;
  dateJoined: string;
  profilePicture: string = "assets/img/logo.png";
  emailAddress: string;
  bio: string;
  ngOnInit() {
    this.getUserProfile();
    this.profileForm = this.formBuilder.group({
      schoolName: [this.schoolName, Validators.required],
      location: [this.schoolLocation, Validators.required],
      email: [this.emailAddress, Validators.required],
      joined: [this.dateJoined, Validators.required],
      bio: [this.bio, Validators.required],
    });
  }

  getUserProfile() {
    const userId = Utils.getUserId();
    return this.crudService.getUserDetails(userId).subscribe(
      (res) => {
        this.schoolName = res.firstName;
        this.schoolLocation = res.lastName;
        this.profilePicture = res.profilePic
          ? res.profilePic
          : "assets/img/logo.png";
        this.emailAddress = res.email;
        this.dateJoined = Utils.getDateFromMilliseconds(
          res.dateCreated
        ).toDateString();
        this.bio = res.bio;
      },
      (err) => {
        console.log(err);
        this.toastr.error("Error getting user profile");
      }
    );
  }

  updateUser() {
    //make sure fields are not empty
    if (
      this.profileForm.value.schoolName === "" ||
      this.profileForm.value.location === "" ||
      this.profileForm.value.bio === ""
    ) {
      this.toastr.error("Please fill in all fields");
    } else {
      const updatedSchoolDetails = {
        firstName: this.profileForm.value.schoolName
          ? this.profileForm.value.schoolName
          : this.schoolName,
        lastName: this.profileForm.value.location
          ? this.profileForm.value.location
          : this.schoolLocation,
        bio: this.profileForm.value.bio ? this.profileForm.value.bio : this.bio,
      };
      return this.crudService.updateUser(updatedSchoolDetails).then(
        (res) => {
          this.toastr.success("User profile updated successfully");
        },
        (err) => {
          this.toastr.error("Error updating user profile");
        }
      );
    }
  }
}
