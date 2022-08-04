import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import Utils from "../helpers/utils";
import { AuthService } from "../shared/services/auth.service";
import { UserModel } from "../shared/services/UserModel";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent implements OnInit {
  loading = false;
  agree = false;
  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthService,
    public router: Router,
    public toastr: ToastrService
  ) {}

  signupForm!: FormGroup;
  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      inputSchoolName: ["", Validators.required],
      inputEmail: ["", Validators.required],
      inputPassword: ["", [Validators.required]],
    });
    if (this.authService.isLoggedIn) {
      this.loading = false;
      this.router.navigate(["dashboard"]);
    }
  }

  agreePrivacyPolicy() {
    if (this.agree) {
      this.agree = false;
    } else {
      this.agree = true;
    }
  }

  signup() {
    const webDashDefaultAccountType = "SCHOOL";
    this.loading = true;

    // //we're re-using UserModel field like first naem and last name as school name
    // //and location respectively
    if (this.agree) {
      const userData: UserModel = {
        firstName: this.signupForm.value.inputSchoolName,
        lastName: this.signupForm.value.inputLocation,
        email: this.signupForm.value.inputEmail,
        dateCreated: Utils.getCurrentTime(),
        profilePic: "",
        accountType: webDashDefaultAccountType,
        enabled: false,
      };
      this.authService.SignUp(
        this.signupForm.value.inputEmail,
        this.signupForm.value.inputPassword,
        userData
      );
    } else {
      this.loading = false;
      this.toastr.error("You must agree to the privacy policy");
    }
  }
}
