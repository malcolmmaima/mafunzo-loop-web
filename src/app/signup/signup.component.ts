import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import Utils from "../helpers/utils";
import { AuthService } from "../shared/services/auth.service";
import { User } from "../shared/services/user";
import { Router } from "@angular/router";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent implements OnInit {
  loading = false;
  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthService,
    public router: Router
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

  signup() {
    const webDashDefaultAccountType = "SCHOOL";
    const userData: User = {
      firstName: this.signupForm.value.inputSchoolName,
      lastName: "",
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
  }
}
