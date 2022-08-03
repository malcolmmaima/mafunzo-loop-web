import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ToastrModule } from "ngx-toastr";

import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireDatabaseModule } from "@angular/fire/compat/database";
import { firebaseConfig } from "../environments/environment";

import { SidebarModule } from "./sidebar/sidebar.module";
import { FooterModule } from "./shared/footer/footer.module";
import { NavbarModule } from "./shared/navbar/navbar.module";
import { FixedPluginModule } from "./shared/fixedplugin/fixedplugin.module";
import { ReactiveFormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app.routing";

import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { VerifyEmailComponent } from "./verify-email/verify-email.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";

import { AuthService } from "./shared/services/auth.service";

@NgModule({
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    RouterModule,
    ReactiveFormsModule,
    NavbarModule,
    FooterModule,
    SidebarModule,
    FixedPluginModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    SignupComponent,
    VerifyEmailComponent,
    ForgotPasswordComponent,
  ],
  providers: [AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
