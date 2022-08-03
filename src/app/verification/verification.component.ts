import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import Utils from "../helpers/utils";

@Component({
  selector: "app-verification",
  templateUrl: "./verification.component.html",
  styleUrls: ["./verification.component.css"],
})
export class VerificationComponent implements OnInit {
  countries = [
    { id: 1, code: "KE(+254)", countryCode: "+254" },
    { id: 2, code: "TZ(+255)", countryCode: "+255" },
    { id: 3, code: "UG(+256)", countryCode: "+256" },
  ];

  submitted = false;
  userExists = false;
  loading = false;
  constructor(private formBuilder: FormBuilder) {}
  registerForm!: FormGroup;
  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      countryCode: ["", Validators.required],
      phoneNumber: ["", [Validators.required, Validators.minLength(9)]],
    });
  }

  register() {
    this.loading = true;
    let phoneNumber =
      this.countries[this.registerForm.value.countryCode - 1].countryCode +
      Utils.formatPhoneNumber(this.registerForm.value.phoneNumber);
  }
}
