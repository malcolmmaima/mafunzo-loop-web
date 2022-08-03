import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
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
    public authService: AuthService
  ) {}
  loginForm!: FormGroup;
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      inputEmail: ["", Validators.required],
      inputPassword: ["", [Validators.required]],
    });
  }

  login() {
    this.loading = true;
    console.log("Form user data", this.loginForm.value);
  }
}
