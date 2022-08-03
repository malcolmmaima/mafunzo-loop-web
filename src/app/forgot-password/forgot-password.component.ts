import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../shared/services/auth.service";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.css"],
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm!: FormGroup;
  loading = false;
  constructor(
    public authService: AuthService,
    public router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn) {
      this.router.navigate(["dashboard"]);
    }

    this.forgotForm = this.formBuilder.group({
      inputEmail: ["", Validators.required],
    });
  }

  forgotPassword() {
    this.loading = true;
    this.authService.ForgotPassword(this.forgotForm.value.inputEmail);
  }
}
