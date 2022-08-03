import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import Utils from "../helpers/utils";
import { AuthService } from "../shared/services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  submitted = false;
  userExists = false;
  loading = false;
  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthService,
    public router: Router
  ) {}
  loginForm!: FormGroup;
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      inputEmail: ["", Validators.required],
      inputPassword: ["", [Validators.required]],
    });

    if (this.authService.isLoggedIn) {
      this.loading = false;
      this.router.navigate(["dashboard"]);
    }
  }

  login() {
    this.loading = true;
    this.authService
      .SignIn(
        this.loginForm.value.inputEmail,
        this.loginForm.value.inputPassword
      )
      .then((res) => {
        this.loading = false;
      })
      .catch((err) => {
        this.loading = false;
      });
  }
}
